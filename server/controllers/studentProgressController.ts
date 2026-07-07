import { Response } from 'express';
import StudentProgress from '../models/StudentProgress';
import Application from '../models/Application';
import Notification from '../models/Notification';
import PracticeProblem from '../models/PracticeProblem';

// @desc    Get student progress
// @route   GET /api/student-progress
// @access  Private
export const getStudentProgress = async (req: any, res: Response): Promise<void> => {
  try {
    let progress = await (StudentProgress as any).findOne({ userId: req.user._id });
    
    // If somehow it wasn't created during registration, create it now
    if (!progress) {
      progress = await (StudentProgress as any).create({ userId: req.user._id });
    }
    
    const applications = await (Application as any).find({ userId: req.user._id }).populate('companyId').sort({ createdAt: -1 }).limit(5);
    const notifications = await (Notification as any).find({ 
      $or: [{ userId: req.user._id }, { userId: { $exists: false } }] 
    }).sort({ date: -1 }).limit(5);
    const practiceProblems = await (PracticeProblem as any).find().limit(5);

    const dashboardData = {
      ...progress.toObject(),
      applications,
      notifications,
      practiceProblems,
      chartData: [
        { name: 'Algorithms', completed: progress.practiceSolved > 10 ? 80 : progress.practiceSolved * 5, total: 100 },
        { name: 'Data Structures', completed: progress.completedCourses > 5 ? 90 : progress.completedCourses * 10, total: 100 },
        { name: 'System Design', completed: progress.certificates > 2 ? 70 : progress.certificates * 20, total: 100 }
      ]
    };

    res.json(dashboardData);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student progress
// @route   PUT /api/student-progress
// @access  Private
export const updateStudentProgress = async (req: any, res: Response): Promise<void> => {
  try {
    let progress = await (StudentProgress as any).findOne({ userId: req.user._id });
    
    if (progress) {
      progress.completedCourses = req.body.completedCourses ?? progress.completedCourses;
      progress.practiceSolved = req.body.practiceSolved ?? progress.practiceSolved;
      progress.certificates = req.body.certificates ?? progress.certificates;
      progress.companiesApplied = req.body.companiesApplied ?? progress.companiesApplied;
      progress.profileCompletion = req.body.profileCompletion ?? progress.profileCompletion;
      
      if (req.body.recentActivity) {
        progress.recentActivity = req.body.recentActivity;
      }
      if (req.body.bookmarkedResources) {
        progress.bookmarkedResources = req.body.bookmarkedResources;
      }
      if (req.body.notifications) {
        progress.notifications = req.body.notifications;
      }

      const updatedProgress = await progress.save();
      res.json(updatedProgress);
    } else {
      res.status(404).json({ message: 'Progress not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
