import Consultation from '../models/Consultation.js';

// @desc    Create a new consultation request
// @route   POST /api/consultations
// @access  Private
export const createConsultation = async (req, res) => {
  try {
    const { fullName, village, phoneNumber, consultationType, description } = req.body;

    // Validate required fields
    if (!fullName || !village || !phoneNumber || !consultationType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const consultation = await Consultation.create({
      userId: req.user._id,
      fullName,
      village,
      phoneNumber,
      consultationType,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Consultation request created successfully',
      data: consultation
    });

  } catch (error) {
    console.error('Create consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating consultation request'
    });
  }
};

// @desc    Get all consultation requests for logged in user
// @route   GET /api/consultations
// @access  Private
export const getUserConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });

  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching consultations'
    });
  }
};

// @desc    Get all consultation requests (Admin)
// @route   GET /api/consultations/all
// @access  Private/Admin
export const getAllConsultations = async (req, res) => {
  try {
    const { status, priority, consultationType } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (consultationType) filter.consultationType = consultationType;

    const consultations = await Consultation.find(filter)
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });

  } catch (error) {
    console.error('Get all consultations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching consultations'
    });
  }
};

// @desc    Get single consultation request
// @route   GET /api/consultations/:id
// @access  Private
export const getConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('userId', 'fullName email phone');

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation request not found'
      });
    }

    // Check if user owns this consultation or is admin
    if (consultation.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this consultation'
      });
    }

    res.status(200).json({
      success: true,
      data: consultation
    });

  } catch (error) {
    console.error('Get consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching consultation'
    });
  }
};

// @desc    Update consultation request
// @route   PUT /api/consultations/:id
// @access  Private
export const updateConsultation = async (req, res) => {
  try {
    let consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation request not found'
      });
    }

    // Check if user owns this consultation
    if (consultation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this consultation'
      });
    }

    // Update fields
    const { fullName, village, phoneNumber, consultationType, description, status, priority, scheduledDate, notes } = req.body;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (village) updateData.village = village;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (consultationType) updateData.consultationType = consultationType;
    if (description) updateData.description = description;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (notes !== undefined) updateData.notes = notes;

    consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Consultation request updated successfully',
      data: consultation
    });

  } catch (error) {
    console.error('Update consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating consultation'
    });
  }
};

// @desc    Delete consultation request
// @route   DELETE /api/consultations/:id
// @access  Private
export const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation request not found'
      });
    }

    // Check if user owns this consultation
    if (consultation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this consultation'
      });
    }

    await Consultation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Consultation request deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Delete consultation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting consultation'
    });
  }
};
