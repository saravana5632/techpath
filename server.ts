import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import authRoutes from './server/routes/authRoutes';
import progressRoutes from './server/routes/progressRoutes';
import adminRoutes from './server/routes/adminRoutes';
import userRoutes from './server/routes/userRoutes';
import studentProgressRoutes from './server/routes/studentProgressRoutes';
import companyRoutes from './server/routes/companyRoutes';
import resourceRoutes from './server/routes/resourceRoutes';
import practiceProblemRoutes from './server/routes/practiceProblemRoutes';
import { connectDB } from './server/db';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = 3000;

// Initialize Google Gemini API standard SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ----------------------------------------------------
// API ENDPOINTS
// ----------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/student-progress', studentProgressRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/practice-problems', practiceProblemRoutes);

// 1. Resume ATS Analyzer API
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Resume contents are required.' });
    }

    const jdPromptContext = jobDescription 
      ? `Ensure you evaluate this resume specifically against this target Job Description:\n"""\n${jobDescription}\n"""`
      : 'Evaluate this resume universally for a generic entry-level / mid-level SDE, Data Analyst, or Cloud Engineer starting role in the tech industry.';

    const prompt = `You are an elite Tech Recruiter and ATS (Applicant Tracking System) Analyzer.
Your task is to analyze the following candidate resume contents and score it based on search keywords matching, phrasing quality, missing key skills, strengths, grammatical issues, and overall readability.

Candidate Resume Text:
"""
${resumeText}
"""

${jdPromptContext}

Verify grammar, check if standard action verbs are used, and identify core keywords that are highly demanded for this candidate's target profile but are absent in the provided resume.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an objective, professional ATS analyzer. Return your analysis strictly as a JSON object matching the defined schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['score', 'strengths', 'weaknesses', 'improvements', 'missingSkills', 'keywordAnalysis'],
          properties: {
            score: {
              type: Type.INTEGER,
              description: 'ATS optimization score between 0 and 100.'
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Highly polished parts of the resume, skills highlighted well, metric actions utilized, etc.'
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Critical issues such as soft-vague descriptions, layout clutter warning, or missing credentials.'
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step constructive instructions to edit the bullets or add metric quantities.'
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'High priority programming languages, tech frameworks or tools missing but expected for the role.'
            },
            keywordAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['keyword', 'count', 'recommendedCount'],
                properties: {
                  keyword: { type: Type.STRING },
                  count: { type: Type.INTEGER, description: 'Number of times it was parsed in the resume text.' },
                  recommendedCount: { type: Type.INTEGER, description: 'Target density count standard for ATS filters.' }
                }
              },
              description: 'Keyword density counts for core technical nouns.'
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('ATS Resume analysis failed:', error);
    res.status(500).json({ error: 'AI ATS analysis failed. Ensure GEMINI_API_KEY is configured.', details: error.message });
  }
});

// 2. Mock Interview Start API
app.post('/api/mock-interview/start', async (req, res) => {
  try {
    const { companyName, roleName, interviewType, resumeSummary } = req.body;

    const resumeContext = resumeSummary 
      ? `Candidate Background/Resume Summary:\n"""\n${resumeSummary}\n"""`
      : 'No specific resume uploaded. Tailor questions to standard university level CS foundations.';

    const systemPrompt = `You are an elite Technical/HR Interviewer at ${companyName || 'a top-tier tech firm'}.
You are conducting a strict ${interviewType || 'Technical'} interview for the role of ${roleName || 'Software Engineer'}.

Guidelines:
1. Greet the candidate warmly and state that this is the ${interviewType} round for ${roleName} at ${companyName}.
2. Review the background and ask ONE initial, highly tailored and challenging question.
   - If Technical: Ask a query about a core computer science foundation (e.g., specific SDE logic, databases, arrays, system design problem, or an interactive coding puzzle based on their resume projects).
   - If HR: Ask a professional behavioral behavioral question (e.g. self-introduction, overcoming an agile development bottleneck, or a teamwork situation).
3. Keep your response brief, friendly, and precise. DO NOT output multiple questions at once. Ask exactly ONE question.

${resumeContext}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Please start the interview and ask the first question.',
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({
      message: response.text || "Hello! Welcome to your interview. Let's get started. Could you introduce yourself and tell me about a technical project you are proud of?"
    });
  } catch (error: any) {
    console.error('Failed to start mock interview:', error);
    res.status(500).json({ error: 'Could not connect with Gemini.', details: error.message });
  }
});

// 3. Mock Interview Message Round API (Multi-turn exchange)
app.post('/api/mock-interview/message', async (req, res) => {
  try {
    const { companyName, roleName, interviewType, history, userResponse } = req.body;

    if (!userResponse) {
      return res.status(400).json({ error: 'User response is missing.' });
    }

    const systemPrompt = `You are an expert interviewer at ${companyName || 'Tech company'} conducting a ${interviewType} round for a ${roleName} position.
You are evaluating the student's answers and asking follow-up questions.

Rules:
1. Review the dialogue history.
2. Formulate a constructive follow-up question.
3. Be realistic. If their previous answer was incomplete, drill down on the exact gaps. If it was correct, present a harder twist or shift to another logical subject (e.g., if DSA is done, move to OS/SQL or behavioral scenarios).
4. Do not output more than one question. Keep the flow interactive, exactly like a real conversation.
5. Keep your tone professional, encouraging but direct.`;

    const chatPayload = [
      ...history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: userResponse }]
      }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatPayload,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({
      message: response.text || "Thank you. Let's move on to the next topic..."
    });
  } catch (error: any) {
    console.error('Failed to process interview message:', error);
    res.status(500).json({ error: 'Interview communication failed.', details: error.message });
  }
});

// 4. Mock Interview Final Evaluation Feedback API
app.post('/api/mock-interview/feedback', async (req, res) => {
  try {
    const { companyName, roleName, interviewType, history } = req.body;

    if (!history || history.length < 2) {
      return res.status(400).json({ error: 'Insufficient conversation history to generate analytics.' });
    }

    const conversationTranscript = history.map((msg: any) => {
      return `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`;
    }).join('\n\n');

    const prompt = `As an elite tech recruitment panel evaluator, analyze the following transcript of a mock interview:

[Interview Transcript]
${conversationTranscript}

Provide structured grading and direct pedagogical items to help the student succeed. 
Calculate scores (0-100) for overall performance, technical accuracy/domain skills, behavioral fit, and conversational communication.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an objective interview auditor. Return feedback strictly as formatted JSON matching the requested schema structure.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['overallScore', 'technicalScore', 'behavioralScore', 'communicationScore', 'strengths', 'weaknesses', 'improvements', 'suggestedAnswers'],
          properties: {
            overallScore: { type: Type.INTEGER, description: 'Composite average score from 0 to 100.' },
            technicalScore: { type: Type.INTEGER, description: 'Specific rating of technical depth (use 0 if purely HR interview).' },
            behavioralScore: { type: Type.INTEGER, description: 'Alignment with standard workplace scenarios.' },
            communicationScore: { type: Type.INTEGER, description: 'Clarity, conciseness, pacing, and confidence.' },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exact spots where candidate answered excellently or displayed great problem-solving.'
            },
            weaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Conceptual gaps, vague replies, or missing keywords identified during the round.'
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Step-by-step guide to re-studying topics or improving body-language verbal patterns.'
            },
            suggestedAnswers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['question', 'answer'],
                properties: {
                  question: { type: Type.STRING, description: 'The question asked.' },
                  answer: { type: Type.STRING, description: 'A model production-grade answering structure that the candidate should use.' }
                }
              },
              description: 'Sample high-quality answers for key questions asked during the session.'
            }
          }
        }
      }
    });

    const parsedFeedback = JSON.parse(response.text || '{}');
    res.json(parsedFeedback);
  } catch (error: any) {
    console.error('Failed to analyze mock interview feedback:', error);
    res.status(500).json({ error: 'Failed to synthesize feedback. Try ending again after further exchanges.', details: error.message });
  }
});

// ----------------------------------------------------
// ----------------------------------------------------
// FRONTEND VITE INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CS Career Guide Server is active at http://localhost:${PORT}`);
  });
}

startServer();
