import { Request, Response } from 'express';
import User from '../models/User';
import StudentProgress from '../models/StudentProgress';
import generateToken from '../utils/generateToken';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, collegeName, registerNumber, department, year, email, mobile, password } = req.body;

    const userExists = await User.findOne({ 
      $or: [{ email }, { registerNumber }, { mobile }] 
    });

    if (userExists) {
      res.status(400).json({ message: 'User with this email, register number, or mobile already exists' });
      return;
    }

    const user = await User.create({
      fullName,
      collegeName,
      registerNumber,
      department,
      year,
      email,
      mobile,
      password,
      role: 'student',
    });

    if (user) {
      if (user.role === 'student') {
        await StudentProgress.create({
          userId: user._id
        });
      }

      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await (user as any).matchPassword(password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
        department: user.department,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logged out successfully' });
};
