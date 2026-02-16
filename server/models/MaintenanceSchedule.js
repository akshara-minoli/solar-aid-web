import mongoose from 'mongoose';

const maintenanceScheduleSchema = new mongoose.Schema({
  assistanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assistance',
    required: [true, 'Assistance ID is required']
  },
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Technician',
    required: [true, 'Technician ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Household',
    default: null
  },
  serviceType: {
    type: String,
    enum: ['Routine Maintenance', 'Panel Cleaning', 'Battery Check', 'Inverter Inspection', 'Wiring Check', 'Complete System Check', 'Repair Service', 'Other'],
    required: [true, 'Please select service type'],
    default: 'Routine Maintenance'
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Please provide service description'],
    minlength: [10, 'Description must be at least 10 characters']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please provide scheduled date'],
    validate: {
      validator: function(v) {
        return v >= new Date();
      },
      message: 'Scheduled date must be in the future'
    }
  },
  estimatedDuration: {
    type: Number,
    default: 2,
    min: [0.5, 'Duration must be at least 30 minutes'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  completionDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  completionNotes: {
    type: String,
    trim: true,
    default: ''
  },
  issues: {
    type: [String],
    default: []
  },
  partsReplaced: {
    type: [String],
    default: []
  },
  nextScheduleDate: {
    type: Date,
    default: null
  },
  userConfirmed: {
    type: Boolean,
    default: false
  },
  technicianConfirmed: {
    type: Boolean,
    default: false
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
maintenanceScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const MaintenanceSchedule = mongoose.model('MaintenanceSchedule', maintenanceScheduleSchema);

export default MaintenanceSchedule;
