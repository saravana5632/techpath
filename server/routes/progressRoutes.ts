import express from 'express';
import { protect } from '../middleware/authMiddleware';
import CodeProgress from '../models/CodeProgress';

const router = express.Router();

// Get code progress
router.get('/:problemId/:language', protect, async (req: any, res) => {
  try {
    const progress = await CodeProgress.findOne({
      userId: req.user._id,
      problemId: req.params.problemId,
      language: req.params.language,
    });
    res.json(progress || { code: '' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Save code progress
router.post('/', protect, async (req: any, res) => {
  try {
    const { problemId, language, code, status, score, testCasesPassed, totalTestCases, lastExecutionTime } = req.body;

    let progress = await CodeProgress.findOne({
      userId: req.user._id,
      problemId,
      language
    });

    if (progress) {
      progress.code = code;
      if (status) progress.status = status;
      if (score !== undefined) progress.score = score;
      if (testCasesPassed !== undefined) progress.testCasesPassed = testCasesPassed;
      if (totalTestCases !== undefined) progress.totalTestCases = totalTestCases;
      if (lastExecutionTime !== undefined) progress.lastExecutionTime = lastExecutionTime;
      await progress.save();
    } else {
      progress = await CodeProgress.create({
        userId: req.user._id,
        problemId,
        language,
        code,
        status,
        score,
        testCasesPassed,
        totalTestCases,
        lastExecutionTime
      });
    }

    res.json(progress);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
