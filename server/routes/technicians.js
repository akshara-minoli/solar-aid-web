import express from 'express';
import {
  createTechnician,
  getAllTechnicians,
  getAvailableTechnicians,
  getTechnician,
  updateTechnician,
  deleteTechnician,
  getTechnicianStats
} from '../controllers/technicianController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/technicians/stats
// @desc    Get technician statistics
router.get('/stats', getTechnicianStats);

// @route   GET /api/technicians/available
// @desc    Get available technicians
router.get('/available', getAvailableTechnicians);

// @route   POST /api/technicians
// @desc    Create new technician
router.post('/', createTechnician);

// @route   GET /api/technicians
// @desc    Get all technicians
router.get('/', getAllTechnicians);

// @route   GET /api/technicians/:id
// @desc    Get single technician
router.get('/:id', getTechnician);

// @route   PUT /api/technicians/:id
// @desc    Update technician
router.put('/:id', updateTechnician);

// @route   DELETE /api/technicians/:id
// @desc    Delete technician
router.delete('/:id', deleteTechnician);

export default router;
