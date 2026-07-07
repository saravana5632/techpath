import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  driveLink: { type: String },
  thumbnail: { type: String }
}, { timestamps: true });

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

export default Resource;
