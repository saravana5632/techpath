import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  collegeName: { type: String, required: true },
  registerNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  year: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['student', 'admin'], default: 'student' },
  profileImage: { type: String, default: '' },
  skills: { type: [String], default: [] },
  bio: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  const doc = this as any;
  if (!doc.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  doc.password = await bcrypt.hash(doc.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
