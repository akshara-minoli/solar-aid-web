import express from 'express';
import {
  createMaintenanceSchedule,
  getAllMaintenanceSchedules,
  getMaintenanceSchedule,
  updateMaintenanceSchedule,
  completeMaintenanceSchedule,
  cancelMaintenanceSchedule,
  rescheduleMaintenanceSchedule,
  confirmMaintenanceSchedule,
  getUpcomingSchedules,
  getSchedulesByTechnician,
  deleteMaintenanceSchedule
} from '../controllers/maintenanceScheduleController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

// @route   POST /api/maintenance-schedules
// @desc    Create maintenance schedule
router.post('/', createMaintenanceSchedule);

// @route   GET /api/maintenance-schedules
// @desc    Get all maintenance schedules
router.get('/', getAllMaintenanceSchedules);

// @route   GET /api/maintenance-schedules/upcoming/:days
// @desc    Get upcoming schedules (next N days)
router.get('/upcoming/:days', getUpcomingSchedules);

// @route   GET /api/maintenance-schedules/technician/:technicianId
// @desc    Get schedules by technician
router.get('/technician/:technicianId', getSchedulesByTechnician);

// @route   GET /api/maintenance-schedules/:id
// @desc    Get single maintenance schedule
router.get('/:id', getMaintenanceSchedule);

// @route   PUT /api/maintenance-schedules/:id
// @desc    Update maintenance schedule
router.put('/:id', updateMaintenanceSchedule);

// @route   PUT /api/maintenance-schedules/:id/complete
// @desc    Complete maintenance schedule
router.put('/:id/complete', completeMaintenanceSchedule);

// @route   PUT /api/maintenance-schedules/:id/cancel
// @desc    Cancel maintenance schedule
router.put('/:id/cancel', cancelMaintenanceSchedule);

// @route   PUT /api/maintenance-schedules/:id/reschedule
// @desc    Reschedule maintenance
router.put('/:id/reschedule', rescheduleMaintenanceSchedule);

// @route   PUT /api/maintenance-schedules/:id/confirm
// @desc    Confirm schedule (by technician or user)
router.put('/:id/confirm', confirmMaintenanceSchedule);

// @route   DELETE /api/maintenance-schedules/:id
// @desc    Delete maintenance schedule
router.delete('/:id', deleteMaintenanceSchedule);

export default router;
