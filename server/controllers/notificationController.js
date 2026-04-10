import Notification from '../models/Notification.js';
import User from '../models/User.js';

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private/Admin
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, notificationType, priority, relatedContentId, relatedServiceId } = req.body;

    // Validate required fields
    if (!userId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      notificationType,
      priority,
      relatedContentId,
      relatedServiceId
    });

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });

  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating notification'
    });
  }
};

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const { status } = req.query;

    // Build filter object
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const notifications = await Notification.find(filter)
      .populate('relatedContentId', 'title')
      .populate('relatedServiceId', 'title')
      .sort({ createdAt: -1 });

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      status: 'Sent'
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notifications'
    });
  }
};

// @desc    Get all notifications for all users (Admin)
// @route   GET /api/notifications/all
// @access  Private/Admin
export const getAllNotifications = async (req, res) => {
  try {
    const { status, notificationType, priority } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (notificationType) filter.notificationType = notificationType;
    if (priority) filter.priority = priority;

    const notifications = await Notification.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('relatedContentId', 'title')
      .populate('relatedServiceId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error('Get all notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notifications'
    });
  }
};

// @desc    Get single notification
// @route   GET /api/notifications/:id
// @access  Private
export const getNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id)
      .populate('userId', 'fullName email')
      .populate('relatedContentId')
      .populate('relatedServiceId');

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check authorization
    if (notification.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this notification'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching notification'
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    let notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check authorization
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.status = 'Read';
    notification.readAt = Date.now();
    notification = await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking notification as read'
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all/read
// @access  Private
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, status: 'Sent' },
      { status: 'Read', readAt: Date.now() }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Mark all notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking notifications as read'
    });
  }
};

// @desc    Archive notification
// @route   PUT /api/notifications/:id/archive
// @access  Private
export const archiveNotification = async (req, res) => {
  try {
    const { id } = req.params;

    let notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check authorization
    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification'
      });
    }

    notification.status = 'Archived';
    notification = await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification archived',
      data: notification
    });

  } catch (error) {
    console.error('Archive notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error archiving notification'
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check authorization
    if (notification.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting notification'
    });
  }
};

// @desc    Send bulk notifications (Admin)
// @route   POST /api/notifications/bulk
// @access  Private/Admin
export const sendBulkNotifications = async (req, res) => {
  try {
    const { userIds, title, message, notificationType, priority, sendToAll, expiresAt } = req.body;

    let targetUserIds = userIds;

    if (sendToAll) {
      const users = await User.find({ role: 'user' }).select('_id');
      targetUserIds = users.map(u => u._id);
    }

    if (!targetUserIds || !Array.isArray(targetUserIds) || targetUserIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide user IDs or set sendToAll to true'
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and message'
      });
    }

    const notifications = await Notification.insertMany(
      targetUserIds.map(userId => ({
        userId,
        title,
        message,
        notificationType,
        priority,
        expiresAt: expiresAt || undefined
      }))
    );

    res.status(201).json({
      success: true,
      message: `${notifications.length} notifications sent successfully`,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error('Send bulk notifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending bulk notifications'
    });
  }
};
