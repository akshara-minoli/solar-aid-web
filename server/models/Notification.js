import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Please provide notification title'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Please provide notification message'],
    trim: true
  },
  notificationType: {
    type: String,
    enum: ['Maintenance Reminder', 'New Subsidy', 'Education Alert', 'System Update', 'Service Notification', 'General'],
    default: 'General'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Sent', 'Read', 'Archived'],
    default: 'Sent'
  },
  relatedContentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationContent',
    default: null
  },
  relatedServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistance',
    default: null
  },
  readAt: {
    type: Date,
    default: null
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
notificationSchema.index({ userId: 1, status: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
