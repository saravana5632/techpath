import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If empty, it's a global broadcast
  title: { type: String, required: true },
  message: { type: String },
  type: { type: String }, // e.g. 'Workshop', 'Practice', 'Alert'
  date: { type: Date, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
