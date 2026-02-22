import express from 'express';
import {
  createNotification,
  getUserNotifications,
  getAllNotifications,
  getNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  archiveNotification,
  deleteNotification,
  sendBulkNotifications
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/notifications
// @desc    Get all notifications for logged in user
router.get('/', getUserNotifications);

// @route   GET /api/notifications/all
// @desc    Get all notifications (Admin)
router.get('/all', getAllNotifications);

// @route   POST /api/notifications
// @desc    Create new notification (Admin)
router.post('/', createNotification);

// @route   POST /api/notifications/bulk
// @desc    Send bulk notifications (Admin)
router.post('/bulk', sendBulkNotifications);

// @route   GET /api/notifications/:id
// @desc    Get single notification
router.get('/:id', getNotification);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// @route   PUT /api/notifications/mark-all/read
// @desc    Mark all notifications as read
router.put('/mark-all/read', markAllNotificationsAsRead);

// @route   PUT /api/notifications/:id/archive
// @desc    Archive notification
router.put('/:id/archive', archiveNotification);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
router.delete('/:id', deleteNotification);

export default router;
