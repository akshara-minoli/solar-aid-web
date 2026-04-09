import express from 'express';
import {
  createFeedback,
  getUserFeedback,
  getAllFeedback,
  getFeedback,
  approveFeedback,
  rejectFeedback,
  deleteFeedback,
  getFeedbackStats,
  getApprovedFeedback
} from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
// @route   GET /api/feedback/public
// @desc    Get all approved feedback for testimonials
router.get('/public', getApprovedFeedback);

// Protected routes (require authentication)
router.use(protect);

// @route   POST /api/feedback
// @desc    Create new feedback
router.post('/', createFeedback);

// @route   GET /api/feedback/my
// @desc    Get all feedback for logged in user
router.get('/my', getUserFeedback);

// @route   GET /api/feedback/stats
// @desc    Get feedback statistics (Admin)
router.get('/stats', getFeedbackStats);

// @route   GET /api/feedback
// @desc    Get all feedback (Admin)
router.get('/', getAllFeedback);

// @route   GET /api/feedback/:id
// @desc    Get single feedback
router.get('/:id', getFeedback);

// @route   PUT /api/feedback/:id/approve
// @desc    Approve feedback (Admin)
router.put('/:id/approve', approveFeedback);

// @route   PUT /api/feedback/:id/reject
// @desc    Reject feedback (Admin)
router.put('/:id/reject', rejectFeedback);

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback
router.delete('/:id', deleteFeedback);

export default router;
