import express from 'express';
import {
  createConsultation,
  getUserConsultations,
  getAllConsultations,
  getConsultation,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/consultations
// @desc    Create new consultation request
router.post('/', createConsultation);

// @route   GET /api/consultations
// @desc    Get all user's consultation requests
router.get('/', getUserConsultations);

// @route   GET /api/consultations/all
// @desc    Get all consultation requests (Admin)
router.get('/all', getAllConsultations);

// @route   GET /api/consultations/:id
// @desc    Get single consultation request
router.get('/:id', getConsultation);

// @route   PUT /api/consultations/:id
// @desc    Update consultation request
router.put('/:id', updateConsultation);

// @route   DELETE /api/consultations/:id
// @desc    Delete consultation request
router.delete('/:id', deleteConsultation);

export default router;
