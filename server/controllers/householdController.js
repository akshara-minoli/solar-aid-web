import Household from '../models/Household.js';

// @desc    Add new household
// @route   POST /api/households
// @access  Private
export const addHousehold = async (req, res) => {
  try {
    const { houseName, houseType, roofArea, district, members, houseAddress, appliances } = req.body;

    // Create household
    const household = await Household.create({
      userId: req.user._id,
      houseName,
      houseType,
      roofArea,
      district,
      members,
      houseAddress,
      appliances
    });

    res.status(201).json({
      success: true,
      message: 'Household added successfully',
      household
    });
  } catch (error) {
    console.error('Add household error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add household',
      error: error.message
    });
  }
};

// @desc    Get all households for user
// @route   GET /api/households
// @access  Private
export const getUserHouseholds = async (req, res) => {
  try {
    const households = await Household.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: households.length,
      households
    });
  } catch (error) {
    console.error('Get households error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve households',
      error: error.message
    });
  }
};

// @desc    Get single household
// @route   GET /api/households/:id
// @access  Private
export const getHousehold = async (req, res) => {
  try {
    const household = await Household.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    res.status(200).json({
      success: true,
      household
    });
  } catch (error) {
    console.error('Get household error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve household',
      error: error.message
    });
  }
};

// @desc    Update household
// @route   PUT /api/households/:id
// @access  Private
export const updateHousehold = async (req, res) => {
  try {
    const { houseName, houseType, roofArea, district, members, houseAddress, appliances } = req.body;

    let household = await Household.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    // Update household
    household.houseName = houseName || household.houseName;
    household.houseType = houseType || household.houseType;
    household.roofArea = roofArea || household.roofArea;
    household.district = district || household.district;
    household.members = members || household.members;
    household.houseAddress = houseAddress || household.houseAddress;
    household.appliances = appliances || household.appliances;

    await household.save();

    res.status(200).json({
      success: true,
      message: 'Household updated successfully',
      household
    });
  } catch (error) {
    console.error('Update household error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update household',
      error: error.message
    });
  }
};

// @desc    Delete household
// @route   DELETE /api/households/:id
// @access  Private
export const deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Household deleted successfully'
    });
  } catch (error) {
    console.error('Delete household error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete household',
      error: error.message
    });
  }
};
