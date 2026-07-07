import express from 'express';
import { getStudentProgress, updateStudentProgress } from '../controllers/studentProgressController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, getStudentProgress)
  .put(protect, updateStudentProgress);

export default router;