import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.collegeName = req.body.collegeName || user.collegeName;
      user.department = req.body.department || user.department;
      user.mobile = req.body.mobile || user.mobile;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new admin
// @route   POST /api/admin/create
// @access  Private/Admin
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    
    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'Please provide full name, email, and password' });
      return;
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    const adminUser = await User.create({
      fullName,
      email,
      password,
      role: 'admin',
    });

    if (adminUser) {
      res.status(201).json({
        _id: adminUser._id,
        fullName: adminUser.fullName,
        email: adminUser.email,
        role: adminUser.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
