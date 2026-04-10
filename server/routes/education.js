import express from 'express';
import {
  createEducationContent,
  getAllEducationContent,
  getEducationContent,
  updateEducationContent,
  deleteEducationContent,
  likeEducationContent,
  getContentByCategory
} from '../controllers/educationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
// @route   GET /api/education
// @desc    Get all education content
router.get('/', getAllEducationContent);

// @route   GET /api/education/category/:category
// @desc    Get content by category
router.get('/category/:category', getContentByCategory);

// @route   GET /api/education/:id
// @desc    Get single education content
router.get('/:id', getEducationContent);

// Protected routes (require authentication)
router.use(protect);

// @route   POST /api/education
// @desc    Create new education content (Admin)
router.post('/', createEducationContent);

// @route   PUT /api/education/:id
// @desc    Update education content
router.put('/:id', updateEducationContent);

// @route   DELETE /api/education/:id
// @desc    Delete education content
router.delete('/:id', deleteEducationContent);

// @route   PUT /api/education/:id/like
// @desc    Like/Unlike education content
router.put('/:id/like', likeEducationContent);

export default router;
