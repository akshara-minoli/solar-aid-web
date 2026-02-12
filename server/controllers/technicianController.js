import Technician from '../models/Technician.js';

// @desc    Create a new technician
// @route   POST /api/technicians
// @access  Private
export const createTechnician = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      specialization, 
      skillLevel, 
      availability, 
      assignedArea,
      experienceYears 
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and phone'
      });
    }

    // Check if technician with email already exists
    const existingTechnician = await Technician.findOne({ email });
    if (existingTechnician) {
      return res.status(400).json({
        success: false,
        message: 'Technician with this email already exists'
      });
    }

    const technician = await Technician.create({
      name,
      email,
      phone,
      specialization,
      skillLevel,
      availability,
      assignedArea,
      experienceYears
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
// @access  Private
export const getAllTechnicians = async (req, res) => {
  try {
    const { availability, specialization, skillLevel } = req.query;
    
    // Build filter object
    const filter = {};
    if (availability) filter.availability = availability;
    if (specialization) filter.specialization = specialization;
    if (skillLevel) filter.skillLevel = skillLevel;

    const technicians = await Technician.find(filter).sort({ createdAt: -1 });

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

// @desc    Get available technicians
// @route   GET /api/technicians/available
// @access  Private
export const getAvailableTechnicians = async (req, res) => {
  try {
    const { specialization } = req.query;
    
    const filter = { availability: 'Available' };
    if (specialization) filter.specialization = specialization;

    const technicians = await Technician.find(filter).sort({ rating: -1 });

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

// @desc    Get single technician
// @route   GET /api/technicians/:id
// @access  Private
export const getTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

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

// @desc    Update technician
// @route   PUT /api/technicians/:id
// @access  Private
export const updateTechnician = async (req, res) => {
  try {
    let technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    const { 
      name, 
      email, 
      phone, 
      specialization, 
      skillLevel, 
      availability, 
      assignedArea,
      experienceYears,
      completedJobs,
      rating 
    } = req.body;

    // Check if email is being changed and if it's already in use
    if (email && email !== technician.email) {
      const emailExists = await Technician.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another technician'
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (specialization) updateData.specialization = specialization;
    if (skillLevel) updateData.skillLevel = skillLevel;
    if (availability) updateData.availability = availability;
    if (assignedArea !== undefined) updateData.assignedArea = assignedArea;
    if (experienceYears !== undefined) updateData.experienceYears = experienceYears;
    if (completedJobs !== undefined) updateData.completedJobs = completedJobs;
    if (rating !== undefined) updateData.rating = rating;

    technician = await Technician.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

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

// @desc    Delete technician
// @route   DELETE /api/technicians/:id
// @access  Private
export const deleteTechnician = async (req, res) => {
  try {
    const technician = await Technician.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    await Technician.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Technician deleted successfully'
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
// @route   GET /api/technicians/stats
// @access  Private
export const getTechnicianStats = async (req, res) => {
  try {
    const totalTechnicians = await Technician.countDocuments();
    const availableTechnicians = await Technician.countDocuments({ availability: 'Available' });
    const busyTechnicians = await Technician.countDocuments({ availability: 'Busy' });
    const onLeaveTechnicians = await Technician.countDocuments({ availability: 'On Leave' });

    // Get technicians by specialization
    const bySpecialization = await Technician.aggregate([
      { $group: { _id: '$specialization', count: { $sum: 1 } } }
    ]);

    // Get technicians by skill level
    const bySkillLevel = await Technician.aggregate([
      { $group: { _id: '$skillLevel', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        total: totalTechnicians,
        available: availableTechnicians,
        busy: busyTechnicians,
        onLeave: onLeaveTechnicians,
        bySpecialization,
        bySkillLevel
      }
    });

  } catch (error) {
    console.error('Get technician stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching statistics'
    });
  }
};
