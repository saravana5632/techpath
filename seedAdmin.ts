import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './server/models/User';

dotenv.config();

const seedAdmin = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
        console.log('Skipping admin seed in local/in-memory mode, set real MONGODB_URI to seed.');
        process.exit(0);
    }
    await mongoose.connect(uri);

    const adminExists = await User.findOne({ email: 'admin@techpath.com' });
    if (adminExists) {
      console.log('Admin already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      fullName: 'System Administrator',
      collegeName: 'System',
      registerNumber: 'ADMIN-001',
      department: 'Admin',
      year: 0,
      email: 'admin@techpath.com',
      mobile: '0000000000',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
