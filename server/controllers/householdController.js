import Household from '../models/Household.js';

// @desc    Add new household
// @route   POST /api/households
// @access  Private
export const addHousehold = async (req, res) => {
  try {
    const { houseName, houseType, roofArea, district, members, houseAddress, appliances } = req.body;

    // Validate and convert numeric fields
    const numRoofArea = Number(roofArea);
    const numMembers = Number(members);

    if (isNaN(numRoofArea) || numRoofArea <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid roof area'
      });
    }

    if (isNaN(numMembers) || numMembers <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid number of members'
      });
    }

    // Create household
    const household = await Household.create({
      userId: req.user._id,
      houseName,
      houseType,
      roofArea: numRoofArea,
      district,
      members: numMembers,
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
      message: error.message || 'Failed to add household',
      error: error.message
    });
  }
};

// @desc    Get all households for user
// @route   GET /api/households
// @access  Private
export const getUserHouseholds = async (req, res) => {
  try {
    const households = await Household.find({ userId: req.user._id }).sort({ updatedAt: -1 });

    console.log(`Found ${households.length} households for user ${req.user._id}`);

    res.status(200).json({
      success: true,
      count: households.length,
      households: households
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

    // Update fields if provided
    if (houseName !== undefined) household.houseName = houseName;
    if (houseType) household.houseType = houseType;
    if (district) household.district = district;
    if (houseAddress) household.houseAddress = houseAddress;
    if (appliances !== undefined) household.appliances = appliances;

    // Handle numeric fields with conversion
    if (roofArea !== undefined) {
      const numRoofArea = Number(roofArea);
      if (isNaN(numRoofArea) || numRoofArea <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid roof area'
        });
      }
      household.roofArea = numRoofArea;
    }

    if (members !== undefined) {
      const numMembers = Number(members);
      if (isNaN(numMembers) || numMembers <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid number of members'
        });
      }
      household.members = numMembers;
    }

    await household.save();

    console.log('Household updated successfully:', household._id);

    res.status(200).json({
      success: true,
      message: 'Household updated successfully',
      household
    });
  } catch (error) {
    console.error('Update household error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update household',
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
