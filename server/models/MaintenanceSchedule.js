import mongoose from 'mongoose';

const maintenanceScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household'
  },
  serviceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistance'
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician'
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  serviceAddress: {
    type: String,
    required: [true, 'Service address is required'],
    trim: true
  },
  // OpenCage Geocoding API data
  addressCoordinates: {
    latitude: { type: Number },
    longitude: { type: Number },
    formatted: { type: String }
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required'],
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['Panel Cleaning', 'System Inspection', 'Battery Check', 'Wiring Repair', 'Full Maintenance', 'Emergency Repair', 'Installation Support'],
    default: 'System Inspection'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  completionStatus: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 60
  },
  actualDuration: {
    type: Number // in minutes
  },
  notes: {
    type: String,
    trim: true
  },
  completionNotes: {
    type: String,
    trim: true
  },
  completedAt: {
    type: Date
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
maintenanceScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MaintenanceSchedule = mongoose.model('MaintenanceSchedule', maintenanceScheduleSchema);

export default MaintenanceSchedule;
