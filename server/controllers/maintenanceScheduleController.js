import MaintenanceSchedule from '../models/MaintenanceSchedule.js';
import Technician from '../models/Technician.js';
import Assistance from '../models/Assistance.js';
import User from '../models/User.js';
import {
  sendMaintenanceReminderSMS,
  sendScheduleConfirmationSMS
} from '../services/smsService.js';

// @desc    Create maintenance schedule
// @route   POST /api/maintenance-schedules
// @access  Private/Admin
export const createMaintenanceSchedule = async (req, res) => {
  try {
    const {
      assistanceId,
      technicianId,
      userId,
      householdId,
      serviceType,
      description,
      scheduledDate,
      estimatedDuration,
      priority
    } = req.body;

    // Validate required fields
    if (!assistanceId || !technicianId || !userId || !serviceType || !description || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Verify technician exists
    const technician = await Technician.findById(technicianId);
    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found'
      });
    }

    // Verify assistance exists
    const assistance = await Assistance.findById(assistanceId);
    if (!assistance) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found'
      });
    }

    const schedule = await MaintenanceSchedule.create({
      assistanceId,
      technicianId,
      userId,
      householdId: householdId || null,
      serviceType,
      description,
      scheduledDate,
      estimatedDuration: estimatedDuration || 2,
      priority: priority || 'Medium'
    });

    res.status(201).json({
      success: true,
      message: 'Maintenance schedule created successfully',
      data: schedule
    });

    // --- Send SMS notifications after responding (non-blocking) ---
    try {
      // SMS to the user: maintenance reminder
      const user = await User.findById(userId).select('phone fullName');
      if (user?.phone) {
        await sendMaintenanceReminderSMS(user.phone, scheduledDate, technician.fullName);
      }
      // SMS to technician: new schedule confirmation
      if (technician?.phone) {
        await sendScheduleConfirmationSMS(technician.phone, scheduledDate, serviceType);
      }
    } catch (smsErr) {
      console.warn('⚠️ SMS notification failed (non-critical):', smsErr.message);
    }
  } catch (error) {
    console.error('Create maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating maintenance schedule'
    });
  }
};

// @desc    Get all maintenance schedules
// @route   GET /api/maintenance-schedules
// @access  Private/Admin
export const getAllMaintenanceSchedules = async (req, res) => {
  try {
    const { status, priority, technicianId, userId } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (technicianId) filter.technicianId = technicianId;

    // Safety: If not admin, force filter by user's own ID
    if (req.user.role !== 'admin') {
      filter.userId = req.user.id;
    } else if (userId) {
      filter.userId = userId;
    }

    const schedules = await MaintenanceSchedule.find(filter)
      .populate('technicianId', 'fullName phone email')
      .populate('userId', 'fullName phone')
      .populate('assistanceId', 'assistanceType priority')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get maintenance schedules error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching schedules'
    });
  }
};

// @desc    Get single maintenance schedule
// @route   GET /api/maintenance-schedules/:id
// @access  Private
export const getMaintenanceSchedule = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findById(req.params.id)
      .populate('technicianId', 'fullName phone email specialization')
      .populate('userId', 'fullName phone village')
      .populate('assistanceId')
      .populate('householdId');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching schedule'
    });
  }
};

// @desc    Update maintenance schedule
// @route   PUT /api/maintenance-schedules/:id
// @access  Private/Admin
export const updateMaintenanceSchedule = async (req, res) => {
  try {
    const {
      serviceType,
      technicianId,
      description,
      scheduledDate,
      estimatedDuration,
      priority,
      status,
      notes,
      issues,
      partsReplaced,
      nextScheduleDate
    } = req.body;

    let schedule = await MaintenanceSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Update fields
    if (serviceType) schedule.serviceType = serviceType;
    if (technicianId) schedule.technicianId = technicianId;
    if (description) schedule.description = description;
    if (scheduledDate) schedule.scheduledDate = scheduledDate;
    if (estimatedDuration) schedule.estimatedDuration = estimatedDuration;
    if (priority) schedule.priority = priority;
    if (status) schedule.status = status;
    if (notes) schedule.notes = notes;
    if (issues) schedule.issues = issues;
    if (partsReplaced) schedule.partsReplaced = partsReplaced;
    if (nextScheduleDate) schedule.nextScheduleDate = nextScheduleDate;

    schedule = await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule updated successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Update maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating schedule'
    });
  }
};

// @desc    Complete maintenance schedule
// @route   PUT /api/maintenance-schedules/:id/complete
// @access  Private/Admin
export const completeMaintenanceSchedule = async (req, res) => {
  try {
    const { completionNotes, issues, partsReplaced, nextScheduleDate } = req.body;

    let schedule = await MaintenanceSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    schedule.status = 'Completed';
    schedule.completionDate = new Date();
    schedule.completionNotes = completionNotes || '';
    if (issues) schedule.issues = issues;
    if (partsReplaced) schedule.partsReplaced = partsReplaced;
    if (nextScheduleDate) schedule.nextScheduleDate = nextScheduleDate;

    schedule = await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Maintenance completed successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Complete maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error completing maintenance'
    });
  }
};

// @desc    Cancel maintenance schedule
// @route   PUT /api/maintenance-schedules/:id/cancel
// @access  Private/Admin
export const cancelMaintenanceSchedule = async (req, res) => {
  try {
    const { reason } = req.body;

    let schedule = await MaintenanceSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Check ownership if not admin
    if (req.user.role !== 'admin' && schedule.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this schedule' });
    }

    if (schedule.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Schedule is already cancelled'
      });
    }

    schedule.status = 'Cancelled';
    schedule.notes = reason || 'Cancelled by user';

    schedule = await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule cancelled successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Cancel maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling schedule'
    });
  }
};

// @desc    Reschedule maintenance
// @route   PUT /api/maintenance-schedules/:id/reschedule
// @access  Private/Admin
export const rescheduleMaintenanceSchedule = async (req, res) => {
  try {
    const { newScheduledDate } = req.body;

    if (!newScheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new scheduled date'
      });
    }

    let schedule = await MaintenanceSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    schedule.scheduledDate = newScheduledDate;
    schedule.status = 'Rescheduled';

    schedule = await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule rescheduled successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Reschedule maintenance error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error rescheduling maintenance'
    });
  }
};

// @desc    Confirm schedule (by technician or user)
// @route   PUT /api/maintenance-schedules/:id/confirm
// @access  Private
export const confirmMaintenanceSchedule = async (req, res) => {
  try {
    const { confirmedBy } = req.body; // 'technician' or 'user'

    let schedule = await MaintenanceSchedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    if (confirmedBy === 'technician') {
      schedule.technicianConfirmed = true;
    } else if (confirmedBy === 'user') {
      schedule.userConfirmed = true;
    }

    schedule = await schedule.save();

    res.status(200).json({
      success: true,
      message: 'Schedule confirmed successfully',
      data: schedule
    });
  } catch (error) {
    console.error('Confirm schedule error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error confirming schedule'
    });
  }
};

// @desc    Get upcoming schedules
// @route   GET /api/maintenance-schedules/upcoming/:days
// @access  Private/Admin
export const getUpcomingSchedules = async (req, res) => {
  try {
    const { days } = req.params;
    const daysNum = parseInt(days) || 7;

    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + daysNum * 24 * 60 * 60 * 1000);

    const schedules = await MaintenanceSchedule.find({
      scheduledDate: { $gte: currentDate, $lte: futureDate },
      status: { $ne: 'Cancelled' }
    })
      .populate('technicianId', 'fullName phone')
      .populate('userId', 'fullName phone')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get upcoming schedules error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching upcoming schedules'
    });
  }
};

// @desc    Get schedules by technician
// @route   GET /api/maintenance-schedules/technician/:technicianId
// @access  Private
export const getSchedulesByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const { status } = req.query;

    const filter = { technicianId };
    if (status) filter.status = status;

    const schedules = await MaintenanceSchedule.find(filter)
      .populate('userId', 'fullName phone village')
      .populate('assistanceId')
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Get schedules by technician error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching schedules'
    });
  }
};

// @desc    Delete maintenance schedule
// @route   DELETE /api/maintenance-schedules/:id
// @access  Private/Admin
export const deleteMaintenanceSchedule = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByIdAndDelete(req.params.id);

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Delete maintenance schedule error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting schedule'
    });
  }
};
