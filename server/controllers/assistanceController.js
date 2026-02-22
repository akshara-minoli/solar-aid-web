import Assistance from '../models/Assistance.js';

// @desc    Create a new assistance request
// @route   POST /api/assistances
// @access  Private
export const createAssistance = async (req, res) => {
  try {
    const { fullName, village, phoneNumber, assistanceType, problemDescription, image } = req.body;

    // Validate required fields
    if (!fullName || !village || !phoneNumber || !assistanceType || !problemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const assistance = await Assistance.create({
      userId: req.user._id,
      fullName,
      village,
      phoneNumber,
      assistanceType,
      problemDescription,
      image: image || null
    });

    res.status(201).json({
      success: true,
      message: 'Assistance request created successfully',
      data: assistance
    });

  } catch (error) {
    console.error('Create assistance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating assistance request'
    });
  }
};

// @desc    Get all assistance requests for logged in user
// @route   GET /api/assistances
// @access  Private
export const getUserAssistances = async (req, res) => {
  try {
    const assistances = await Assistance.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assistances.length,
      data: assistances
    });

  } catch (error) {
    console.error('Get assistances error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching assistance requests'
    });
  }
};

// @desc    Get all assistance requests (Admin)
// @route   GET /api/assistances/all
// @access  Private/Admin
export const getAllAssistances = async (req, res) => {
  try {
    const { status, priority, assistanceType } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assistanceType) filter.assistanceType = assistanceType;

    const assistances = await Assistance.find(filter)
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assistances.length,
      data: assistances
    });

  } catch (error) {
    console.error('Get all assistances error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching assistance requests'
    });
  }
};

// @desc    Get single assistance request
// @route   GET /api/assistances/:id
// @access  Private
export const getAssistance = async (req, res) => {
  try {
    const assistance = await Assistance.findById(req.params.id)
      .populate('userId', 'fullName email phone');

    if (!assistance) {
      return res.status(404).json({
        success: false,
        message: 'Assistance request not found'
      });
    }

    // Check if user owns this assistance or is admin
    if (assistance.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this assistance request'
      });
    }

    res.status(200).json({
      success: true,
      data: assistance
    });

  } catch (error) {
    console.error('Get assistance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching assistance request'
    });
  }
};

// @desc    Update assistance request
// @route   PUT /api/assistances/:id
// @access  Private
export const updateAssistance = async (req, res) => {
  try {
    let assistance = await Assistance.findById(req.params.id);

    if (!assistance) {
      return res.status(404).json({
        success: false,
        message: 'Assistance request not found'
      });
    }

    // Check if user owns this assistance or is admin
    if (assistance.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assistance request'
      });
    }

    // Update fields
    const {
      fullName,
      village,
      phoneNumber,
      assistanceType,
      problemDescription,
      image,
      status,
      priority,
      assignedTo,
      scheduledDate,
      resolutionNotes
    } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (village) updateData.village = village;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (assistanceType) updateData.assistanceType = assistanceType;
    if (problemDescription) updateData.problemDescription = problemDescription;
    if (image !== undefined) updateData.image = image;
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;

    assistance = await Assistance.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Assistance request updated successfully',
      data: assistance
    });

  } catch (error) {
    console.error('Update assistance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating assistance request'
    });
  }
};

// @desc    Delete assistance request
// @route   DELETE /api/assistances/:id
// @access  Private
export const deleteAssistance = async (req, res) => {
  try {
    const assistance = await Assistance.findById(req.params.id);

    if (!assistance) {
      return res.status(404).json({
        success: false,
        message: 'Assistance request not found'
      });
    }

    // Check if user owns this assistance or is admin
    if (assistance.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assistance request'
      });
    }

    await Assistance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Assistance request deleted successfully',
      data: {}
    });

  } catch (error) {
    console.error('Delete assistance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting assistance request'
    });
  }
};
