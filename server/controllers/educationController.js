import EducationContent from '../models/EducationContent.js';

// @desc    Create new education content
// @route   POST /api/education
// @access  Private/Admin
export const createEducationContent = async (req, res) => {
  try {
    const { title, category, description, content, contentType, imageUrl, videoUrl, tags, difficulty } = req.body;

    // Validate required fields
    if (!title || !category || !description || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const educationContent = await EducationContent.create({
      title,
      category,
      description,
      content,
      contentType,
      imageUrl,
      videoUrl,
      tags,
      difficulty,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Education content created successfully',
      data: educationContent
    });

  } catch (error) {
    console.error('Create education content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating education content'
    });
  }
};

// @desc    Get all education content (Public)
// @route   GET /api/education
// @access  Public
export const getAllEducationContent = async (req, res) => {
  try {
    const { category, difficulty, contentType, search } = req.query;
    
    // Build filter object
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (contentType) filter.contentType = contentType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const content = await EducationContent.find(filter)
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 })
      .select('-content'); // Don't send full content in list view

    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });

  } catch (error) {
    console.error('Get education content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching education content'
    });
  }
};

// @desc    Get single education content by ID
// @route   GET /api/education/:id
// @access  Public
export const getEducationContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await EducationContent.findById(id)
      .populate('author', 'fullName email');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Education content not found'
      });
    }

    // Increment views
    content.views += 1;
    await content.save();

    res.status(200).json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Get education content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching education content'
    });
  }
};

// @desc    Update education content
// @route   PUT /api/education/:id
// @access  Private/Admin
export const updateEducationContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, content, contentType, imageUrl, videoUrl, tags, difficulty, isPublished } = req.body;

    let educationContent = await EducationContent.findById(id);

    if (!educationContent) {
      return res.status(404).json({
        success: false,
        message: 'Education content not found'
      });
    }

    // Check if user is the author or admin
    if (educationContent.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this content'
      });
    }

    // Update fields
    if (title) educationContent.title = title;
    if (category) educationContent.category = category;
    if (description) educationContent.description = description;
    if (content) educationContent.content = content;
    if (contentType) educationContent.contentType = contentType;
    if (imageUrl) educationContent.imageUrl = imageUrl;
    if (videoUrl) educationContent.videoUrl = videoUrl;
    if (tags) educationContent.tags = tags;
    if (difficulty) educationContent.difficulty = difficulty;
    if (typeof isPublished !== 'undefined') educationContent.isPublished = isPublished;

    educationContent = await educationContent.save();

    res.status(200).json({
      success: true,
      message: 'Education content updated successfully',
      data: educationContent
    });

  } catch (error) {
    console.error('Update education content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating education content'
    });
  }
};

// @desc    Delete education content
// @route   DELETE /api/education/:id
// @access  Private/Admin
export const deleteEducationContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await EducationContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Education content not found'
      });
    }

    // Check if user is the author or admin
    if (content.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this content'
      });
    }

    await EducationContent.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Education content deleted successfully'
    });

  } catch (error) {
    console.error('Delete education content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting education content'
    });
  }
};

// @desc    Like/Unlike education content
// @route   PUT /api/education/:id/like
// @access  Private
export const likeEducationContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'like' or 'unlike'

    const content = await EducationContent.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Education content not found'
      });
    }

    if (action === 'like') {
      content.likes += 1;
    } else if (action === 'unlike' && content.likes > 0) {
      content.likes -= 1;
    }

    await content.save();

    res.status(200).json({
      success: true,
      message: `Content ${action}d successfully`,
      data: { likes: content.likes }
    });

  } catch (error) {
    console.error('Like education content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error liking content'
    });
  }
};

// @desc    Get content by category
// @route   GET /api/education/category/:category
// @access  Public
export const getContentByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const content = await EducationContent.find({ category, isPublished: true })
      .populate('author', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: content.length,
      data: content
    });

  } catch (error) {
    console.error('Get content by category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching content by category'
    });
  }
};
