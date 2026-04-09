import Feedback from '../models/Feedback.js';

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (req, res) => {
  try {
    const { feedbackType, rating, title, message, relatedEntityType, relatedEntityId, isAnonymous, attachments } = req.body;

    // Validate required fields
    if (!feedbackType || !rating || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Determine user ID based on anonymity
    // Safety check: fall back to null if req.user is missing
    const userId = isAnonymous ? null : (req.user ? req.user._id : null);

    const feedbackData = {
      feedbackType,
      rating,
      title,
      message,
      relatedEntityType: relatedEntityType || 'System',
      isAnonymous: Boolean(isAnonymous),
      attachments: attachments || []
    };

    // Only add userId if it exists to avoid null validation issues in some environments
    if (userId) {
      feedbackData.userId = userId;
    }

    const feedback = await Feedback.create(feedbackData);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating feedback'
    });
  }
};

// @desc    Get all feedback for logged in user
// @route   GET /api/feedback/my
// @access  Private
export const getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });

  } catch (error) {
    console.error('Get user feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user feedback'
    });
  }
};

// @desc    Get all feedback (Admin)
// @route   GET /api/feedback
// @access  Private/Admin
export const getAllFeedback = async (req, res) => {
  try {
    const { status, feedbackType, rating } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (feedbackType) filter.feedbackType = feedbackType;
    if (rating) filter.rating = rating;

    const feedback = await Feedback.find(filter)
      .populate('userId', 'fullName email phone')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(2)
      : 0;

    res.status(200).json({
      success: true,
      count: feedback.length,
      averageRating: avgRating,
      data: feedback
    });

  } catch (error) {
    console.error('Get all feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching feedback'
    });
  }
};

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private/Admin
export const getFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id)
      .populate('userId', 'fullName email phone');

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    res.status(200).json({
      success: true,
      data: feedback
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching feedback'
    });
  }
};

// @desc    Approve feedback
// @route   PUT /api/feedback/:id/approve
// @access  Private/Admin
export const approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    let feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    feedback.status = 'Approved';
    feedback.approvedAt = Date.now();
    if (adminNotes) feedback.adminNotes = adminNotes;

    feedback = await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback approved successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Approve feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving feedback'
    });
  }
};

// @desc    Reject feedback
// @route   PUT /api/feedback/:id/reject
// @access  Private/Admin
export const rejectFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    let feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    feedback.status = 'Rejected';
    if (adminNotes) feedback.adminNotes = adminNotes;

    feedback = await feedback.save();

    res.status(200).json({
      success: true,
      message: 'Feedback rejected successfully',
      data: feedback
    });

  } catch (error) {
    console.error('Reject feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting feedback'
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check authorization
    if (feedback.userId && feedback.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this feedback'
      });
    }

    await Feedback.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting feedback'
    });
  }
};

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private/Admin
// @desc    Get all approved feedback for public testimonials
// @route   GET /api/feedback/public
// @access  Public
export const getApprovedFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ status: 'Approved' })
      .populate('userId', 'fullName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedback.length,
      data: feedback
    });

  } catch (error) {
    console.error('Get public feedback error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching testimonials'
    });
  }
};

export const getFeedbackStats = async (req, res) => {
  try {
    const totalFeedback = await Feedback.countDocuments();
    const approvedFeedback = await Feedback.countDocuments({ status: 'Approved' });
    const pendingFeedback = await Feedback.countDocuments({ status: 'Pending' });
    const rejectedFeedback = await Feedback.countDocuments({ status: 'Rejected' });

    const feedbackByType = await Feedback.aggregate([
      {
        $group: {
          _id: '$feedbackType',
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingDistribution = await Feedback.aggregate([
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const avgRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalFeedback,
        approvedFeedback,
        pendingFeedback,
        rejectedFeedback,
        averageRating: avgRating[0]?.average.toFixed(2) || 0,
        feedbackByType,
        ratingDistribution
      }
    });

  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching feedback statistics'
    });
  }
};
