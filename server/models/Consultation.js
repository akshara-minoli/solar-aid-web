import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  village: {
    type: String,
    required: [true, 'Please provide your village'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },
  consultationType: {
    type: String,
    required: [true, 'Please select consultation type'],
    enum: ['Solar Installation', 'System Maintenance', 'Energy Efficiency', 'Financial Planning', 'Other']
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  scheduledDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
consultationSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Consultation = mongoose.model('Consultation', consultationSchema);

export default Consultation;
