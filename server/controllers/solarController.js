import axios from 'axios';
import Household from '../models/Household.js';

// Sri Lanka coordinates mapping for districts (approximate centers)
const districtCoordinates = {
  'colombo': { lat: 6.9271, lon: 79.8612 },
  'gampaha': { lat: 7.0840, lon: 80.0098 },
  'kalutara': { lat: 6.5854, lon: 79.9607 },
  'kandy': { lat: 7.2906, lon: 80.6337 },
  'matale': { lat: 7.4675, lon: 80.6234 },
  'nuwara eliya': { lat: 6.9497, lon: 80.7891 },
  'galle': { lat: 6.0535, lon: 80.2210 },
  'matara': { lat: 5.9549, lon: 80.5550 },
  'hambantota': { lat: 6.1429, lon: 81.1212 },
  'jaffna': { lat: 9.6615, lon: 80.0255 },
  'kilinochchi': { lat: 9.3803, lon: 80.3770 },
  'mannar': { lat: 8.9736, lon: 79.9044 },
  'vavuniya': { lat: 8.7542, lon: 80.4982 },
  'mullaitivu': { lat: 9.2671, lon: 80.8142 },
  'batticaloa': { lat: 7.7310, lon: 81.6747 },
  'ampara': { lat: 7.2918, lon: 81.6747 },
  'trincomalee': { lat: 8.5874, lon: 81.2152 },
  'kurunegala': { lat: 7.4863, lon: 80.3623 },
  'puttalam': { lat: 8.0362, lon: 79.8283 },
  'anuradhapura': { lat: 8.3114, lon: 80.4037 },
  'polonnaruwa': { lat: 7.9403, lon: 81.0188 },
  'badulla': { lat: 6.9934, lon: 81.0550 },
  'moneragala': { lat: 6.8728, lon: 81.3507 },
  'ratnapura': { lat: 6.7056, lon: 80.3847 },
  'kegalle': { lat: 7.2513, lon: 80.3464 }
};

/**
 * @desc    Calculate solar production estimate for a household
 * @route   POST /api/solar/calculate/:householdId
 * @access  Private
 */
export const calculateSolarProduction = async (req, res) => {
  try {
    const { householdId } = req.params;
    const { systemSize, electricityRate, tiltAngle, azimuthAngle } = req.body;

    // Validate inputs
    if (!systemSize || systemSize <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid system size in kW'
      });
    }

    // Get household details
    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    // Verify household belongs to the authenticated user
    if (household.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this household'
      });
    }

    // Get coordinates for the district
    const district = household.district.toLowerCase();
    const coordinates = districtCoordinates[district];
    
    if (!coordinates) {
      return res.status(400).json({
        success: false,
        message: `Coordinates not found for district: ${household.district}. Please contact support.`
      });
    }

    // Call NREL PVWatts API
    const pvWattsData = await callPVWattsAPI({
      lat: coordinates.lat,
      lon: coordinates.lon,
      systemCapacity: systemSize,
      moduleType: 0, // Standard module
      losses: 14, // System losses percentage (default)
      arrayType: 1, // Fixed (roof-mounted)
      tilt: tiltAngle || 7, // Default tilt for Sri Lanka (approx latitude)
      azimuth: azimuthAngle || 180 // South-facing for Northern Hemisphere, North for Southern
    });

    // Calculate financial and environmental metrics
    const rate = electricityRate || 25; // Default LKR per kWh (Sri Lanka avg)
    const annualProduction = pvWattsData.outputs.ac_annual;
    const monthlyProduction = pvWattsData.outputs.ac_monthly;
    const annualSavings = annualProduction * rate;
    
    // Carbon offset calculation (kg CO2 per kWh for Sri Lanka)
    // Sri Lanka grid emission factor: ~0.65 kg CO2/kWh
    const carbonOffsetKg = annualProduction * 0.65;
    const carbonOffsetTons = carbonOffsetKg / 1000;

    // Calculate system performance ratio
    const performanceRatio = pvWattsData.outputs.capacity_factor;

    res.status(200).json({
      success: true,
      data: {
        household: {
          id: household._id,
          houseName: household.houseName,
          district: household.district,
          roofArea: household.roofArea
        },
        system: {
          size: systemSize,
          location: {
            lat: coordinates.lat,
            lon: coordinates.lon,
            district: household.district
          },
          tilt: tiltAngle || 7,
          azimuth: azimuthAngle || 180
        },
        production: {
          annualProductionKWh: Math.round(annualProduction),
          monthlyProductionKWh: monthlyProduction.map(val => Math.round(val)),
          averageMonthlyKWh: Math.round(annualProduction / 12),
          capacityFactor: performanceRatio
        },
        financial: {
          electricityRate: rate,
          annualSavingsLKR: Math.round(annualSavings),
          monthlySavingsLKR: Math.round(annualSavings / 12),
          currency: 'LKR'
        },
        environmental: {
          carbonOffsetTons: parseFloat(carbonOffsetTons.toFixed(2)),
          carbonOffsetKg: Math.round(carbonOffsetKg),
          equivalentTreesPlanted: Math.round(carbonOffsetTons * 50) // ~50 trees per ton CO2
        },
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Valid for 30 days
      }
    });

  } catch (error) {
    console.error('Solar calculation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating solar production',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * @desc    Get estimated system size based on roof area
 * @route   GET /api/solar/estimate-size/:householdId
 * @access  Private
 */
export const estimateSystemSize = async (req, res) => {
  try {
    const { householdId } = req.params;
    
    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    // Verify household belongs to the authenticated user
    if (household.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this household'
      });
    }

    // Calculate estimated system size
    // Typical: 1 kW requires ~8-10 m² of roof space
    // We'll use 8.5 m² per kW as average
    const roofArea = household.roofArea;
    const usableRoofArea = roofArea * 0.75; // 75% of roof is typically usable
    const estimatedSystemSize = usableRoofArea / 8.5;

    // Provide size recommendations
    const recommendations = [];
    if (estimatedSystemSize >= 1) {
      recommendations.push({
        size: Math.floor(estimatedSystemSize),
        roofAreaRequired: Math.floor(estimatedSystemSize) * 8.5,
        description: 'Maximum recommended system size based on available roof area'
      });
    }
    
    // Add smaller options
    const smallerSizes = [0.5, 1, 2, 3, 4, 5].filter(size => size <= estimatedSystemSize);
    smallerSizes.forEach(size => {
      if (!recommendations.find(r => r.size === size)) {
        recommendations.push({
          size: size,
          roofAreaRequired: size * 8.5,
          description: `${size} kW solar system`
        });
      }
    });

    res.status(200).json({
      success: true,
      data: {
        household: {
          id: household._id,
          houseName: household.houseName,
          roofArea: household.roofArea
        },
        estimation: {
          totalRoofArea: roofArea,
          usableRoofArea: Math.round(usableRoofArea * 100) / 100,
          maxSystemSize: Math.round(estimatedSystemSize * 100) / 100,
          recommendations: recommendations.sort((a, b) => b.size - a.size)
        }
      }
    });

  } catch (error) {
    console.error('System size estimation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error estimating system size'
    });
  }
};

/**
 * Helper function to call NREL PVWatts API
 */
const callPVWattsAPI = async (params) => {
  const apiKey = process.env.NREL_API_KEY;
  
  if (!apiKey) {
    throw new Error('NREL API key is not configured. Please add NREL_API_KEY to your .env file');
  }

  const baseURL = 'https://developer.nrel.gov/api/pvwatts/v8.json';
  
  const queryParams = {
    api_key: apiKey,
    lat: params.lat,
    lon: params.lon,
    system_capacity: params.systemCapacity,
    module_type: params.moduleType || 0,
    losses: params.losses || 14,
    array_type: params.arrayType || 1,
    tilt: params.tilt || 20,
    azimuth: params.azimuth || 180,
    dataset: 'intl' // Use international dataset for locations outside US
  };

  try {
    const response = await axios.get(baseURL, {
      params: queryParams,
      timeout: 10000 // 10 second timeout
    });

    if (response.data.errors && response.data.errors.length > 0) {
      throw new Error(`NREL API Error: ${response.data.errors.join(', ')}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`NREL API Error (${error.response.status}): ${error.response.data?.errors?.join(', ') || error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Unable to reach NREL API. Please check your internet connection.');
    } else {
      throw new Error(`API Request Error: ${error.message}`);
    }
  }
};

/**
 * @desc    Get available districts with coordinates
 * @route   GET /api/solar/districts
 * @access  Public
 */
export const getAvailableDistricts = async (req, res) => {
  try {
    const districts = Object.keys(districtCoordinates).map(district => ({
      name: district.charAt(0).toUpperCase() + district.slice(1),
      value: district,
      coordinates: districtCoordinates[district]
    }));

    res.status(200).json({
      success: true,
      count: districts.length,
      data: districts
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching districts'
    });
  }
};
