import { Request, Response } from 'express';
import PracticeProblem from '../models/PracticeProblem';

// @desc    Get all practice problems
// @route   GET /api/practice-problems
// @access  Public
export const getPracticeProblems = async (req: Request, res: Response): Promise<void> => {
  try {
    const practiceProblems = await (PracticeProblem as any).find().sort({ createdAt: -1 });
    res.json(practiceProblems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a practice problem
// @route   POST /api/practice-problems
// @access  Private/Admin
export const createPracticeProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const practiceProblem = new PracticeProblem(req.body);
    const createdPracticeProblem = await practiceProblem.save();
    res.status(201).json(createdPracticeProblem);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a practice problem
// @route   PUT /api/practice-problems/:id
// @access  Private/Admin
export const updatePracticeProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const practiceProblem = await (PracticeProblem as any).findByIdAndUpdate(req.params.id as any, req.body, { new: true });
    if (practiceProblem) {
      res.json(practiceProblem);
    } else {
      res.status(404).json({ message: 'Practice problem not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a practice problem
// @route   DELETE /api/practice-problems/:id
// @access  Private/Admin
export const deletePracticeProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const practiceProblem = await (PracticeProblem as any).findById(req.params.id as any);
    if (practiceProblem) {
      await (PracticeProblem as any).deleteOne({ _id: practiceProblem._id });
      res.json({ message: 'Practice problem removed' });
    } else {
      res.status(404).json({ message: 'Practice problem not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
