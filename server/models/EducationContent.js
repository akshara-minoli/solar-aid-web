import mongoose from 'mongoose';

const educationContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide content title'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Solar Basics',
      'Solar Installation',
      'Maintenance Tips',
      'Energy Efficiency',
      'Troubleshooting',
      'Government Incentives',
      'Technology Updates',
      'Safety Guidelines'
    ],
    default: 'Solar Basics'
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long']
  },
  content: {
    type: String,
    required: [true, 'Please provide detailed content'],
    trim: true
  },
  contentType: {
    type: String,
    enum: ['Article', 'Video', 'PDF', 'Infographic', 'Interactive'],
    default: 'Article'
  },
  imageUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  tags: {
    type: [String],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
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
educationContentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const EducationContent = mongoose.model('EducationContent', educationContentSchema);

export default EducationContent;
