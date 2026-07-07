import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Code2, Terminal, Loader2, Save, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

type Language = 'javascript' | 'python' | 'java' | 'c' | 'c++';

const LANGUAGE_VERSIONS: Record<Language, string> = {
  javascript: '18.15.0',
  python: '3.10.0',
  java: '15.0.2',
  c: '10.2.0',
  'c++': '10.2.0'
};

const BASIC_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: 'Write a function that returns the indices of the two numbers that add up to the target.',
    defaultCode: {
      javascript: `function twoSum(nums, target) {\n  // your code here\n  \n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
      python: `def two_sum(nums, target):\n    # your code here\n    pass\n\nprint(two_sum([2, 7, 11, 15], 9))`,
      java: `import java.util.Arrays;\n\npublic class Main {\n    public static int[] twoSum(int[] nums, int target) {\n        // your code here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));\n    }\n}`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // your code here\n    *returnSize = 0;\n    return NULL;\n}\n\nint main() {\n    int nums[] = {2, 7, 11, 15};\n    int returnSize;\n    int* result = twoSum(nums, 4, 9, &returnSize);\n    if (result) {\n        printf("[%d, %d]\\n", result[0], result[1]);\n        free(result);\n    }\n    return 0;\n}`,
      'c++': `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // your code here\n    return {};\n}\n\nint main() {\n    vector<int> nums = {2, 7, 11, 15};\n    vector<int> result = twoSum(nums, 9);\n    if (result.size() == 2) {\n        cout << "[" << result[0] << ", " << result[1] << "]\\n";\n    }\n    return 0;\n}`
    }
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    description: 'Write a function that reverses a string.',
    defaultCode: {
      javascript: `function reverseString(s) {\n  // your code here\n  \n}\n\nconsole.log(reverseString("hello"));`,
      python: `def reverse_string(s):\n    # your code here\n    pass\n\nprint(reverse_string("hello"))`,
      java: `public class Main {\n    public static String reverseString(String s) {\n        // your code here\n        return "";\n    }\n\n    public static void main(String[] args) {\n        System.out.println(reverseString("hello"));\n    }\n}`,
      c: `#include <stdio.h>\n#include <string.h>\n\nvoid reverseString(char* s) {\n    // your code here\n}\n\nint main() {\n    char str[] = "hello";\n    reverseString(str);\n    printf("%s\\n", str);\n    return 0;\n}`,
      'c++': `#include <iostream>\n#include <string>\n\nusing namespace std;\n\nvoid reverseString(string& s) {\n    // your code here\n}\n\nint main() {\n    string str = "hello";\n    reverseString(str);\n    cout << str << "\\n";\n    return 0;\n}`
    }
  },
  {
    id: 'fizz-buzz',
    title: 'FizzBuzz',
    description: 'Write a function that prints numbers from 1 to n. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz".',
    defaultCode: {
      javascript: `function fizzBuzz(n) {\n  // your code here\n  \n}\n\nfizzBuzz(15);`,
      python: `def fizz_buzz(n):\n    # your code here\n    pass\n\nfizz_buzz(15)`,
      java: `public class Main {\n    public static void fizzBuzz(int n) {\n        // your code here\n    }\n\n    public static void main(String[] args) {\n        fizzBuzz(15);\n    }\n}`,
      c: `#include <stdio.h>\n\nvoid fizzBuzz(int n) {\n    // your code here\n}\n\nint main() {\n    fizzBuzz(15);\n    return 0;\n}`,
      'c++': `#include <iostream>\n\nusing namespace std;\n\nvoid fizzBuzz(int n) {\n    // your code here\n}\n\nint main() {\n    fizzBuzz(15);\n    return 0;\n}`
    }
  }
];

export default function CodeSandbox() {
  const { user } = useAuth();
  const [activeProblem, setActiveProblem] = useState(BASIC_PROBLEMS[0]);
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(activeProblem.defaultCode['javascript']);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load code from DB when problem, language, or user changes
  useEffect(() => {
    const loadSavedCode = async () => {
      if (user && user.token) {
        try {
          const res = await fetch(`/api/progress/${activeProblem.id}/${language}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.code) {
              setCode(data.code);
              return;
            }
          }
          setCode(activeProblem.defaultCode[language]);
        } catch (error) {
          console.error("Error loading code:", error);
          setCode(activeProblem.defaultCode[language]);
        }
      } else {
        setCode(activeProblem.defaultCode[language]);
      }
    };
    loadSavedCode();
  }, [user, activeProblem.id, language]);

  const handleSaveCode = async (execTimeOrEvent?: number | React.SyntheticEvent) => {
    if (!user || !user.token) return;
    setIsSaving(true);
    try {
      const isEvent = execTimeOrEvent && typeof execTimeOrEvent === 'object' && 'nativeEvent' in execTimeOrEvent;
      const validExecTime = !isEvent && typeof execTimeOrEvent === 'number' ? execTimeOrEvent : undefined;

      const progressData: any = {
        problemId: activeProblem.id,
        language: language,
        code: code,
        status: "In Progress",
        score: 80,
        testCasesPassed: 8,
        totalTestCases: 10,
      };

      if (validExecTime !== undefined) {
         progressData.lastExecutionTime = validExecTime;
      } else {
         progressData.lastExecutionTime = Date.now();
      }

      await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(progressData)
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving code:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProblemChange = (problem: typeof BASIC_PROBLEMS[0]) => {
    setActiveProblem(problem);
    setOutput('');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
    setOutput('');
  };

  const handleReset = () => {
    setCode(activeProblem.defaultCode[language]);
    setOutput('');
  };

  const handleRunCode = async () => {
    setOutput('');
    setIsExecuting(true);
    
    // Auto-save on run if logged in
    if (user) handleSaveCode();
    
    const startTime = Date.now();
    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          language: language,
          version: LANGUAGE_VERSIONS[language],
          files: [
            {
              content: code
            }
          ]
        })
      });

      const data = await response.json();
      const execTime = Date.now() - startTime;
      
      if (user) handleSaveCode(execTime);
      
      if (data.compile && data.compile.code !== 0) {
        setOutput(`Compilation Error:\n${data.compile.output}`);
      } else if (data.run) {
        setOutput(data.run.output || 'Code executed successfully with no output.');
        if (data.run.code !== 0) {
          setOutput(prev => prev + `\n\nProcess exited with code ${data.run.code}`);
        }
      } else {
        setOutput(`Error: ${data.message || 'Unknown error occurred.'}`);
      }
    } catch (error: any) {
      setOutput(`Error connecting to execution server: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="bg-[#0f0f12] border border-white/5 rounded-3xl overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar with Problems */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-white font-bold mb-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h3>Basic Problems</h3>
        </div>
        <div className="flex flex-col gap-2">
          {BASIC_PROBLEMS.map(problem => (
            <button
              key={problem.id}
              onClick={() => handleProblemChange(problem)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeProblem.id === problem.id 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-300 border border-transparent'
              }`}
            >
              {problem.title}
            </button>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/5">
          <h4 className="text-sm font-bold text-gray-300 mb-2">Problem Description</h4>
          <p className="text-xs text-gray-500 leading-relaxed">
            {activeProblem.description}
          </p>
        </div>
      </div>

      {/* Editor & Output area */}
      <div className="w-full md:w-2/3 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-black/10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest hidden sm:inline-block">Playground</span>
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-[#1a1a1f] border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="javascript">JavaScript (Node.js)</option>
              <option value="python">Python 3</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="c++">C++</option>
            </select>
          </div>
          <div className="flex gap-2">
            {user && (
              <button
                onClick={() => handleSaveCode()}
                disabled={isSaving || saved}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : (isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />)}
                <span className="hidden sm:inline-block">{saved ? 'Saved' : 'Save Progress'}</span>
              </button>
            )}
            <button 
              onClick={() => handleReset()}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <button 
              onClick={() => handleRunCode()}
              disabled={isExecuting}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 hover:text-emerald-300 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {isExecuting ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 min-h-[300px] relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="absolute inset-0 w-full h-full bg-[#0a0a0c] text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/50 leading-relaxed"
            spellCheck="false"
          />
        </div>

        {/* Console Output */}
        <div className="h-48 border-t border-white/5 bg-black/40 flex flex-col">
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              Console Output
            </div>
            {isExecuting && <span className="text-[10px] text-blue-400 font-mono animate-pulse">Executing in Cloud...</span>}
          </div>
          <div className="p-4 overflow-auto font-mono text-sm flex-1">
            {output ? (
              <pre className={output.includes('Error:') || output.includes('Compilation Error:') ? 'text-rose-400 whitespace-pre-wrap' : 'text-gray-300 whitespace-pre-wrap'}>
                {output}
              </pre>
            ) : (
              <span className="text-gray-600 italic">Run your code to see the output here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

