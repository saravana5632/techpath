import express from 'express';
import { getPracticeProblems, createPracticeProblem, updatePracticeProblem, deletePracticeProblem } from '../controllers/practiceProblemController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getPracticeProblems)
  .post(protect, admin, createPracticeProblem);

router.route('/:id')
  .put(protect, admin, updatePracticeProblem)
  .delete(protect, admin, deletePracticeProblem);

export default router;
