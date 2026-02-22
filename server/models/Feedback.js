import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  feedbackType: {
    type: String,
    enum: ['General Feedback', 'Service Review', 'Content Review', 'Bug Report', 'Feature Request', 'System Improvement'],
    required: [true, 'Please select feedback type']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    required: [true, 'Please provide a rating']
  },
  title: {
    type: String,
    required: [true, 'Please provide feedback title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long']
  },
  message: {
    type: String,
    required: [true, 'Please provide feedback message'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long']
  },
  relatedEntityType: {
    type: String,
    enum: ['System', 'Content', 'Service', 'Technician', 'Other'],
    default: 'System'
  },
  relatedEntityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
    default: 'Pending'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  attachments: {
    type: [String],
    default: []
  },
  adminNotes: {
    type: String,
    trim: true,
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
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
feedbackSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
