import mongoose from 'mongoose';

const practiceProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  topic: { type: String, required: true },
  description: { type: String },
  timeEstimate: { type: String }, // e.g., '15 mins'
}, { timestamps: true });

const PracticeProblem = mongoose.models.PracticeProblem || mongoose.model('PracticeProblem', practiceProblemSchema);
export default PracticeProblem;
