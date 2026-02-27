import express from 'express';
import {
  createTechnician,
  getAllTechnicians,
  getTechnician,
  updateTechnician,
  assignServiceRequest,
  completeServiceRequest,
  updateAvailability,
  getAvailableTechnicians,
  toggleActivation,
  deleteTechnician,
  getTechnicianStats
} from '../controllers/technicianController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

// @route   POST /api/technicians
// @desc    Create new technician
router.post('/', admin, createTechnician);

// @route   GET /api/technicians
// @desc    Get all technicians
router.get('/', getAllTechnicians);

// @route   GET /api/technicians/available/:specialization
// @desc    Get available technicians by specialization
router.get('/available/:specialization', getAvailableTechnicians);

// @route   GET /api/technicians/:id
// @desc    Get single technician
router.get('/:id', getTechnician);

// @route   GET /api/technicians/:id/stats
// @desc    Get technician statistics
router.get('/:id/stats', getTechnicianStats);

// @route   PUT /api/technicians/:id
// @desc    Update technician
router.put('/:id', admin, updateTechnician);

// @route   PUT /api/technicians/:id/availability
// @desc    Update technician availability
router.put('/:id/availability', admin, updateAvailability);

// @route   PUT /api/technicians/:id/assign/:assistanceId
// @desc    Assign service request to technician
router.put('/:id/assign/:assistanceId', admin, assignServiceRequest);

// @route   PUT /api/technicians/:id/complete/:assistanceId
// @desc    Complete service request
router.put('/:id/complete/:assistanceId', admin, completeServiceRequest);

// @route   PUT /api/technicians/:id/toggle-activation
// @desc    Toggle technician activation
router.put('/:id/toggle-activation', admin, toggleActivation);

// @route   DELETE /api/technicians/:id
// @desc    Delete technician
router.delete('/:id', admin, deleteTechnician);

export default router;
