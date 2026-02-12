import express from 'express';
import {
  createAssistance,
  getUserAssistances,
  getAllAssistances,
  getAssistance,
  updateAssistance,
  deleteAssistance
} from '../controllers/assistanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/assistances
// @desc    Create new assistance request
router.post('/', createAssistance);

// @route   GET /api/assistances
// @desc    Get all user's assistance requests
router.get('/', getUserAssistances);

// @route   GET /api/assistances/all
// @desc    Get all assistance requests (Admin)
router.get('/all', getAllAssistances);

// @route   GET /api/assistances/:id
// @desc    Get single assistance request
router.get('/:id', getAssistance);

// @route   PUT /api/assistances/:id
// @desc    Update assistance request
router.put('/:id', updateAssistance);

// @route   DELETE /api/assistances/:id
// @desc    Delete assistance request
router.delete('/:id', deleteAssistance);

export default router;
