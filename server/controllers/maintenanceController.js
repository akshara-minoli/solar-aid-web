import MaintenanceSchedule from '../models/MaintenanceSchedule.js';
import Technician from '../models/Technician.js';

// OpenCage Geocoding API Integration
const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.OPENCAGE_API_KEY;
    if (!apiKey) {
      console.log('OpenCage API key not configured');
      return null;
    }

    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${apiKey}&limit=1`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        formatted: result.formatted
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// @desc    Create a new maintenance schedule
// @route   POST /api/maintenance
// @access  Private
export const createMaintenance = async (req, res) => {
  try {
    const { 
      householdId,
      serviceRequestId,
      technicianId,
      customerName,
      customerPhone,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      serviceType,
      priority,
      estimatedDuration,
      notes
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !serviceAddress || !scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Geocode the service address using OpenCage API
    const coordinates = await geocodeAddress(serviceAddress);

    // If technician is assigned, update their availability
    if (technicianId) {
      await Technician.findByIdAndUpdate(technicianId, { availability: 'Busy' });
    }

    const maintenance = await MaintenanceSchedule.create({
      userId: req.user._id,
      householdId,
      serviceRequestId,
      technicianId,
      customerName,
      customerPhone,
      serviceAddress,
      addressCoordinates: coordinates,
      scheduledDate,
      scheduledTime,
      serviceType,
      priority,
      estimatedDuration,
      notes
    });

    // Populate technician info
    await maintenance.populate('technicianId', 'name phone specialization');

    res.status(201).json({
      success: true,
      message: 'Maintenance scheduled successfully',
      data: maintenance
    });

  } catch (error) {
    console.error('Create maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating maintenance schedule'
    });
  }
};

// @desc    Get all maintenance schedules for logged in user
// @route   GET /api/maintenance
// @access  Private
export const getUserMaintenance = async (req, res) => {
  try {
    const maintenance = await MaintenanceSchedule.find({ userId: req.user._id })
      .populate('technicianId', 'name phone specialization availability')
      .populate('householdId', 'houseName district houseAddress')
      .sort({ scheduledDate: -1 });

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance
    });

  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching maintenance schedules'
    });
  }
};

// @desc    Get all maintenance schedules (Admin)
// @route   GET /api/maintenance/all
// @access  Private/Admin
export const getAllMaintenance = async (req, res) => {
  try {
    const { completionStatus, serviceType, priority, technicianId } = req.query;
    
    // Build filter object
    const filter = {};
    if (completionStatus) filter.completionStatus = completionStatus;
    if (serviceType) filter.serviceType = serviceType;
    if (priority) filter.priority = priority;
    if (technicianId) filter.technicianId = technicianId;

    const maintenance = await MaintenanceSchedule.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('technicianId', 'name phone specialization availability')
      .populate('householdId', 'houseName district houseAddress')
      .sort({ scheduledDate: -1 });

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance
    });

  } catch (error) {
    console.error('Get all maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching maintenance schedules'
    });
  }
};

// @desc    Get single maintenance schedule
// @route   GET /api/maintenance/:id
// @access  Private
export const getMaintenance = async (req, res) => {
  try {
    const maintenance = await MaintenanceSchedule.findById(req.params.id)
      .populate('userId', 'fullName email phone')
      .populate('technicianId', 'name phone specialization availability rating')
      .populate('householdId', 'houseName district houseAddress roofArea');

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: maintenance
    });

  } catch (error) {
    console.error('Get maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching maintenance schedule'
    });
  }
};

// @desc    Update maintenance schedule
// @route   PUT /api/maintenance/:id
// @access  Private
export const updateMaintenance = async (req, res) => {
  try {
    let maintenance = await MaintenanceSchedule.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found'
      });
    }

    const { 
      technicianId,
      customerName,
      customerPhone,
      serviceAddress,
      scheduledDate,
      scheduledTime,
      serviceType,
      priority,
      completionStatus,
      estimatedDuration,
      actualDuration,
      notes,
      completionNotes
    } = req.body;

    const updateData = {};
    
    // Update basic fields
    if (customerName) updateData.customerName = customerName;
    if (customerPhone) updateData.customerPhone = customerPhone;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (scheduledTime) updateData.scheduledTime = scheduledTime;
    if (serviceType) updateData.serviceType = serviceType;
    if (priority) updateData.priority = priority;
    if (estimatedDuration) updateData.estimatedDuration = estimatedDuration;
    if (actualDuration) updateData.actualDuration = actualDuration;
    if (notes !== undefined) updateData.notes = notes;
    if (completionNotes !== undefined) updateData.completionNotes = completionNotes;

    // Handle address change - re-geocode
    if (serviceAddress && serviceAddress !== maintenance.serviceAddress) {
      updateData.serviceAddress = serviceAddress;
      const coordinates = await geocodeAddress(serviceAddress);
      if (coordinates) {
        updateData.addressCoordinates = coordinates;
      }
    }

    // Handle technician change
    if (technicianId && technicianId !== maintenance.technicianId?.toString()) {
      // Set old technician to available
      if (maintenance.technicianId) {
        await Technician.findByIdAndUpdate(maintenance.technicianId, { availability: 'Available' });
      }
      // Set new technician to busy
      await Technician.findByIdAndUpdate(technicianId, { availability: 'Busy' });
      updateData.technicianId = technicianId;
    }

    // Handle status change
    if (completionStatus) {
      updateData.completionStatus = completionStatus;
      
      // If completed, update technician and add completion timestamp
      if (completionStatus === 'Completed') {
        updateData.completedAt = new Date();
        if (maintenance.technicianId) {
          await Technician.findByIdAndUpdate(maintenance.technicianId, { 
            availability: 'Available',
            $inc: { completedJobs: 1 }
          });
        }
      }
      
      // If cancelled, free up technician
      if (completionStatus === 'Cancelled' && maintenance.technicianId) {
        await Technician.findByIdAndUpdate(maintenance.technicianId, { availability: 'Available' });
      }
    }

    maintenance = await MaintenanceSchedule.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('technicianId', 'name phone specialization');

    res.status(200).json({
      success: true,
      message: 'Maintenance schedule updated successfully',
      data: maintenance
    });

  } catch (error) {
    console.error('Update maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating maintenance schedule'
    });
  }
};

// @desc    Delete maintenance schedule
// @route   DELETE /api/maintenance/:id
// @access  Private
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await MaintenanceSchedule.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance schedule not found'
      });
    }

    // Free up technician if assigned
    if (maintenance.technicianId && maintenance.completionStatus !== 'Completed') {
      await Technician.findByIdAndUpdate(maintenance.technicianId, { availability: 'Available' });
    }

    await MaintenanceSchedule.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Maintenance schedule deleted successfully'
    });

  } catch (error) {
    console.error('Delete maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting maintenance schedule'
    });
  }
};

// @desc    Get maintenance statistics
// @route   GET /api/maintenance/stats
// @access  Private
export const getMaintenanceStats = async (req, res) => {
  try {
    const totalSchedules = await MaintenanceSchedule.countDocuments();
    const scheduled = await MaintenanceSchedule.countDocuments({ completionStatus: 'Scheduled' });
    const inProgress = await MaintenanceSchedule.countDocuments({ completionStatus: 'In Progress' });
    const completed = await MaintenanceSchedule.countDocuments({ completionStatus: 'Completed' });
    const cancelled = await MaintenanceSchedule.countDocuments({ completionStatus: 'Cancelled' });

    // Get by service type
    const byServiceType = await MaintenanceSchedule.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } }
    ]);

    // Get by priority
    const byPriority = await MaintenanceSchedule.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Get upcoming maintenance (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const upcoming = await MaintenanceSchedule.countDocuments({
      scheduledDate: { $gte: new Date(), $lte: nextWeek },
      completionStatus: { $in: ['Scheduled', 'In Progress'] }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalSchedules,
        scheduled,
        inProgress,
        completed,
        cancelled,
        upcoming,
        byServiceType,
        byPriority
      }
    });

  } catch (error) {
    console.error('Get maintenance stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching statistics'
    });
  }
};

// @desc    Validate address using OpenCage API
// @route   POST /api/maintenance/validate-address
// @access  Private
export const validateAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an address'
      });
    }

    const coordinates = await geocodeAddress(address);

    if (!coordinates) {
      return res.status(404).json({
        success: false,
        message: 'Address could not be validated. Please check and try again.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Address validated successfully',
      data: coordinates
    });

  } catch (error) {
    console.error('Validate address error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error validating address'
    });
  }
};
