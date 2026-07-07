import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  roleTitle: { type: String, required: true },
  status: { type: String, enum: ['Applied', 'Under Review', 'Interview', 'Rejected', 'Selected'], default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
  interviewDate: { type: Date }
}, { timestamps: true });

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
