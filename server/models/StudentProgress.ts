import mongoose from 'mongoose';

const studentProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  completedCourses: { type: Number, default: 0 },
  practiceSolved: { type: Number, default: 0 },
  certificates: { type: Number, default: 0 },
  companiesApplied: { type: Number, default: 0 },
  profileCompletion: { type: Number, default: 30 },
  recentActivity: { type: Array, default: [] },
  bookmarkedResources: { type: Array, default: [] },
  notifications: { type: Array, default: [] }
}, {
  timestamps: true
});

const StudentProgress = mongoose.models.StudentProgress || mongoose.model('StudentProgress', studentProgressSchema);
export default StudentProgress;
