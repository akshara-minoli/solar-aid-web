import Technician from '../models/Technician.js';
import Assistance from '../models/Assistance.js';
import User from '../models/User.js';
import {
  sendServiceAssignmentSMS,
  sendServiceUpdateToUser,
  sendCompletionNotificationSMS
} from '../services/smsService.js';

// @desc    Create a new technician
// @route   POST /api/technicians
// @access  Private/Admin
export const createTechnician = async (req, res) => {
  try {
    const { fullName, email, phone, specialization, experience, certification, location } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if technician already exists
    const existingTechnician = await Technician.findOne({ email });
    if (existingTechnician) {
      return res.status(400).json({
        success: false,
        message: 'Technician with this email already exists'
      });
    }

    const technician = await Technician.create({
      fullName,
      email,
      phone,
      specialization: specialization || ['General Maintenance'],
      experience: experience || 0,
      certification: certification || null,
      location
    });

    res.status(201).json({
      success: true,
      message: 'Technician created successfully',
      data: technician
    });
  } catch (error) {
    console.error('Create technician error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating technician'
    });
  }
};

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Private/Admin
export const getAllTechnicians = async (req, res) => {
  try {
    const { availability, location, specialization } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (availability) filter.availability = availability;
    if (location) filter.location = new RegExp(location, 'i');
    if (specialization) filter.specialization = specialization;

    const technicians = await Technician.find(filter)
      .select('-__v')
      .sort({ completedRequests: -1, rating: -1 });

    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians
    });
  } catch (error) {
    console.error('Get technicians error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching technicians'
    });
  }
};

// @desc    Get single technician
// @route   GET /api/technicians/:id
// @access  Private/Admin
export const getTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id)
      .populate('assignedRequests', 'assistanceType status priority');

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.status(200).json({
      success: true,
      data: technician
    });
  } catch (error) {
    console.error('Get technician error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching technician'
    });
  }
};

// @desc    Update technician details
// @route   PUT /api/technicians/:id
// @access  Private/Admin
export const updateTechnician = async (req, res) => {
  try {
    const { fullName, email, phone, specialization, experience, certification, availability, location, rating } = req.body;

    let technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    // Check if new email is unique
    if (email && email !== technician.email) {
      const existingEmail = await Technician.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // Update fields
    if (fullName) technician.fullName = fullName;
    if (email) technician.email = email;
    if (phone) technician.phone = phone;
    if (specialization) technician.specialization = specialization;
    if (experience !== undefined) technician.experience = experience;
    if (certification) technician.certification = certification;
    if (availability) technician.availability = availability;
    if (location) technician.location = location;
    if (rating !== undefined) technician.rating = Math.min(rating, 5);

    technician = await technician.save();

    res.status(200).json({
      success: true,
      message: 'Technician updated successfully',
      data: technician
    });
  } catch (error) {
    console.error('Update technician error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating technician'
    });
  }
};

// @desc    Assign service request to technician
// @route   PUT /api/technicians/:id/assign/:assistanceId
// @access  Private/Admin
export const assignServiceRequest = async (req, res) => {
  try {
    const { id, assistanceId } = req.params;

    const technician = await Technician.findById(id);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    const assistance = await Assistance.findById(assistanceId);
    if (!assistance) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Add to assigned requests
    if (!technician.assignedRequests.includes(assistanceId)) {
      technician.assignedRequests.push(assistanceId);
    }

    // Update assistance with technician
    assistance.assignedTechnician = id;
    assistance.status = 'Assigned';

    await technician.save();
    await assistance.save();

    // Send SMS to technician and user
    try {
      await sendServiceAssignmentSMS(
        technician.phone,
        assistance.assistanceType || 'Service',
        assistance.phoneNumber
      );
      await sendServiceUpdateToUser(
        assistance.phoneNumber,
        technician.fullName,
        'Assigned'
      );
    } catch (smsError) {
      console.warn('SMS notification failed:', smsError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Service request assigned successfully',
      data: {
        technician,
        assistance
      }
    });
  } catch (error) {
    console.error('Assign service request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning service request'
    });
  }
};

// @desc    Complete service request
// @route   PUT /api/technicians/:id/complete/:assistanceId
// @access  Private/Admin
export const completeServiceRequest = async (req, res) => {
  try {
    const { id, assistanceId } = req.params;
    const { resolutionNotes } = req.body;

    const technician = await Technician.findById(id);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    const assistance = await Assistance.findById(assistanceId);
    if (!assistance) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    // Update counts
    technician.completedRequests += 1;
    technician.totalServices += 1;

    // Remove from assigned requests
    technician.assignedRequests = technician.assignedRequests.filter(
      req => req.toString() !== assistanceId
    );

    // Mark assistance as resolved
    assistance.status = 'Resolved';
    assistance.resolutionNotes = resolutionNotes || '';

    await technician.save();
    await assistance.save();

    // Send completion SMS to user
    try {
      await sendCompletionNotificationSMS(
        assistance.phoneNumber,
        resolutionNotes || 'Service completed successfully',
        technician.fullName
      );
    } catch (smsError) {
      console.warn('Completion SMS failed:', smsError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Service request completed successfully',
      data: {
        technician,
        assistance
      }
    });
  } catch (error) {
    console.error('Complete service request error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error completing service request'
    });
  }
};

// @desc    Update technician availability
// @route   PUT /api/technicians/:id/availability
// @access  Private/Admin
export const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (!availability || !['Available', 'Busy', 'On Leave'].includes(availability)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid availability status'
      });
    }

    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      data: technician
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating availability'
    });
  }
};

// @desc    Get available technicians by specialization
// @route   GET /api/technicians/available/:specialization
// @access  Private/Admin
export const getAvailableTechnicians = async (req, res) => {
  try {
    const { specialization } = req.params;

    const technicians = await Technician.find({
      availability: 'Available',
      specialization: specialization,
      isActive: true
    }).select('fullName phone email rating completedRequests');

    res.status(200).json({
      success: true,
      count: technicians.length,
      data: technicians
    });
  } catch (error) {
    console.error('Get available technicians error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching available technicians'
    });
  }
};

// @desc    Deactivate technician
// @route   PUT /api/technicians/:id/deactivate
// @access  Private/Admin
export const deactivateTechnician = async (req, res) => {
  try {
    const technician = await Technician.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technician deactivated successfully',
      data: technician
    });
  } catch (error) {
    console.error('Deactivate technician error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deactivating technician'
    });
  }
};

// @desc    Delete technician
// @route   DELETE /api/technicians/:id
// @access  Private/Admin
export const deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findByIdAndDelete(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technician deleted successfully',
      data: technician
    });
  } catch (error) {
    console.error('Delete technician error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting technician'
    });
  }
};

// @desc    Get technician statistics
// @route   GET /api/technicians/:id/stats
// @access  Private/Admin
export const getTechnicianStats = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    const stats = {
      totalServices: technician.totalServices,
      completedRequests: technician.completedRequests,
      pendingRequests: technician.assignedRequests.length,
      rating: technician.rating,
      specialization: technician.specialization,
      availability: technician.availability,
      experience: technician.experience
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get technician stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error getting technician statistics'
    });
  }
};
