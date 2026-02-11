import express from 'express';
import {
  addHousehold,
  getUserHouseholds,
  getHousehold,
  updateHousehold,
  deleteHousehold
} from '../controllers/householdController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/households
// @desc    Add new household
router.post('/', addHousehold);

// @route   GET /api/households
// @desc    Get all user households
router.get('/', getUserHouseholds);

// @route   GET /api/households/:id
// @desc    Get single household
router.get('/:id', getHousehold);

// @route   PUT /api/households/:id
// @desc    Update household
router.put('/:id', updateHousehold);

// @route   DELETE /api/households/:id
// @desc    Delete household
router.delete('/:id', deleteHousehold);

export default router;
