import mongoose from 'mongoose';

const householdSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  houseName: {
    type: String,
    trim: true
  },
  houseType: {
    type: String,
    required: [true, 'Please specify house type'],
    enum: ['house', 'apartment'],
    trim: true
  },
  roofArea: {
    type: Number,
    required: [true, 'Please provide roof area'],
    min: [0, 'Roof area must be positive']
  },
  district: {
    type: String,
    required: [true, 'Please provide district'],
    trim: true
  },
  members: {
    type: Number,
    required: [true, 'Please provide number of members'],
    min: [1, 'Must have at least 1 member']
  },
  houseAddress: {
    type: String,
    required: [true, 'Please provide house address'],
    trim: true
  },
  appliances: {
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
householdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Household = mongoose.model('Household', householdSchema);

export default Household;
