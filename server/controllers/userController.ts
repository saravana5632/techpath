import { Request, Response } from 'express';
import User from '../models/User';
import StudentProgress from '../models/StudentProgress';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/profile/photo
// @access  Private
export const uploadProfilePhoto = async (req: any, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const photoUrl = `/uploads/profile/${req.file.filename}`;
    user.profileImage = photoUrl;
    await user.save();

    res.json({ profileImage: photoUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await (User as any).findById(req.user._id);
    if (user) {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        res.status(400).json({ message: 'Please provide old and new password' });
        return;
      }
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid old password' });
        return;
      }
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/delete
// @access  Private
export const deleteUser = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      await User.deleteOne({ _id: user._id });
      await (StudentProgress as any).deleteOne({ userId: user._id });
      res.json({ message: 'User account deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;
      user.collegeName = req.body.collegeName || user.collegeName;
      user.registerNumber = req.body.registerNumber || user.registerNumber;
      user.department = req.body.department || user.department;
      user.year = req.body.year || user.year;
      user.skills = req.body.skills || user.skills;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.linkedinUrl = req.body.linkedinUrl !== undefined ? req.body.linkedinUrl : user.linkedinUrl;
      user.githubUrl = req.body.githubUrl !== undefined ? req.body.githubUrl : user.githubUrl;
      user.portfolioUrl = req.body.portfolioUrl !== undefined ? req.body.portfolioUrl : user.portfolioUrl;
      
      if (req.body.profileImage) {
        user.profileImage = req.body.profileImage;
      }

      const updatedUser = await user.save();

      // Calculate new profile completion
      const requiredFields = ['fullName', 'email', 'mobile', 'collegeName', 'department', 'year', 'skills', 'bio', 'linkedinUrl', 'githubUrl', 'portfolioUrl', 'profileImage'];
      
      const userObj = updatedUser.toObject();
      const filledFields = requiredFields.filter(field => {
        const val = userObj[field];
        if (Array.isArray(val)) return val.length > 0;
        return val && String(val).trim().length > 0;
      });
      
      const calculatedCompletion = Math.max(30, Math.round((filledFields.length / requiredFields.length) * 100));

      if (updatedUser.role === 'student') {
        const progress = await (StudentProgress as any).findOne({ userId: updatedUser._id });
        if (progress) {
          progress.profileCompletion = calculatedCompletion;
          await progress.save();
        }
      }

      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        collegeName: updatedUser.collegeName,
        registerNumber: updatedUser.registerNumber,
        department: updatedUser.department,
        year: updatedUser.year,
        skills: updatedUser.skills,
        bio: updatedUser.bio,
        linkedinUrl: updatedUser.linkedinUrl,
        githubUrl: updatedUser.githubUrl,
        portfolioUrl: updatedUser.portfolioUrl,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
