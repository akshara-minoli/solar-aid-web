import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide technician name'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true,
    match: [/^\+?[0-9\s-]{9,15}$/, 'Please provide a valid phone number (e.g., +94724055431)']
  },
  specialization: {
    type: [String],
    enum: ['Solar Panel Installation', 'Battery Replacement', 'Inverter Repair', 'Wiring & Maintenance', 'Panel Cleaning', 'General Maintenance'],
    required: [true, 'Please select specialization'],
    default: ['General Maintenance']
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0,
    required: true
  },
  certification: {
    type: String,
    trim: true,
    default: null
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'On Leave'],
    default: 'Available',
    required: true
  },
  location: {
    type: String,
    required: [true, 'Please provide service area/district'],
    trim: true
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  assignedRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistance'
  }],
  completedRequests: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalServices: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update the updatedAt field before saving
technicianSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Technician = mongoose.model('Technician', technicianSchema);

export default Technician;
