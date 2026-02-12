import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide technician name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Please specify specialization'],
    enum: ['Panel Installation', 'Battery Maintenance', 'Electrical Wiring', 'System Inspection', 'General Maintenance'],
    default: 'General Maintenance'
  },
  skillLevel: {
    type: String,
    required: true,
    enum: ['Junior', 'Mid-Level', 'Senior', 'Expert'],
    default: 'Junior'
  },
  availability: {
    type: String,
    required: true,
    enum: ['Available', 'Busy', 'On Leave'],
    default: 'Available'
  },
  assignedArea: {
    type: String,
    trim: true
  },
  experienceYears: {
    type: Number,
    default: 0,
    min: 0
  },
  completedJobs: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
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

// Update timestamp before saving
technicianSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Technician = mongoose.model('Technician', technicianSchema);

export default Technician;
