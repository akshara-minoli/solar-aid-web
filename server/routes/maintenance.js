import express from 'express';
import {
  createMaintenance,
  getUserMaintenance,
  getAllMaintenance,
  getMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceStats,
  validateAddress
} from '../controllers/maintenanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/maintenance/stats
// @desc    Get maintenance statistics
router.get('/stats', getMaintenanceStats);

// @route   GET /api/maintenance/all
// @desc    Get all maintenance schedules (Admin)
router.get('/all', getAllMaintenance);

// @route   POST /api/maintenance/validate-address
// @desc    Validate address using OpenCage API
router.post('/validate-address', validateAddress);

// @route   POST /api/maintenance
// @desc    Create new maintenance schedule
router.post('/', createMaintenance);

// @route   GET /api/maintenance
// @desc    Get user's maintenance schedules
router.get('/', getUserMaintenance);

// @route   GET /api/maintenance/:id
// @desc    Get single maintenance schedule
router.get('/:id', getMaintenance);

// @route   PUT /api/maintenance/:id
// @desc    Update maintenance schedule
router.put('/:id', updateMaintenance);

// @route   DELETE /api/maintenance/:id
// @desc    Delete maintenance schedule
router.delete('/:id', deleteMaintenance);

export default router;
