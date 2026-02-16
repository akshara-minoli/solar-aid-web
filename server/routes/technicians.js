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
  deactivateTechnician,
  deleteTechnician,
  getTechnicianStats
} from '../controllers/technicianController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes with authentication
router.use(protect);

// @route   POST /api/technicians
// @desc    Create new technician
router.post('/', createTechnician);

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
router.put('/:id', updateTechnician);

// @route   PUT /api/technicians/:id/availability
// @desc    Update technician availability
router.put('/:id/availability', updateAvailability);

// @route   PUT /api/technicians/:id/assign/:assistanceId
// @desc    Assign service request to technician
router.put('/:id/assign/:assistanceId', assignServiceRequest);

// @route   PUT /api/technicians/:id/complete/:assistanceId
// @desc    Complete service request
router.put('/:id/complete/:assistanceId', completeServiceRequest);

// @route   PUT /api/technicians/:id/deactivate
// @desc    Deactivate technician
router.put('/:id/deactivate', deactivateTechnician);

// @route   DELETE /api/technicians/:id
// @desc    Delete technician
router.delete('/:id', deleteTechnician);

export default router;
