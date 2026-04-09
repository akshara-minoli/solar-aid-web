//service request form model
import mongoose from 'mongoose';

const assistanceSchema = new mongoose.Schema({
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
  assistanceType: {
    type: String,
    required: [true, 'Please select assistance type'],
    enum: ['Technical Support', 'Repair Service', 'Battery Replacement', 'Panel Cleaning', 'Emergency Service', 'Other']
  },
  problemDescription: {
    type: String,
    required: [true, 'Please describe the problem'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  image: {
    type: String, // Store image URL or base64 string
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Cancelled'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  assignedTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    default: null
  },
  preferredTechnician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    default: null
  },
  scheduledDate: {
    type: Date
  },
  resolutionNotes: {
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
assistanceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Assistance = mongoose.model('Assistance', assistanceSchema);

export default Assistance;
