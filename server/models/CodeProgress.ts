import mongoose from 'mongoose';

const codeProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: { type: String },
  score: { type: Number },
  testCasesPassed: { type: Number },
  totalTestCases: { type: Number },
  lastExecutionTime: { type: Number },
}, { timestamps: true });

const CodeProgress = mongoose.model('CodeProgress', codeProgressSchema);
export default CodeProgress;
