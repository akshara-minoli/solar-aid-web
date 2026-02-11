import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SolarProductionReport from '../components/SolarProductionReport';

const SolarCalculator = () => {
  const [households, setHouseholds] = useState([]);
  const [selectedHousehold, setSelectedHousehold] = useState('');
  const [systemSize, setSystemSize] = useState('');
  const [electricityRate, setElectricityRate] = useState('25');
  const [tiltAngle, setTiltAngle] = useState('7');
  const [azimuthAngle, setAzimuthAngle] = useState('180');
  const [reportData, setReportData] = useState(null);
  const [estimatedSize, setEstimatedSize] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get API URL from environment or use default
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token;
  };

  // Fetch user's households on component mount
  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Please log in to view your households');
        return;
      }

      const response = await axios.get(`${API_URL}/api/households`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        setHouseholds(response.data.data);
        
        // Show message if no households found
        if (response.data.data.length === 0) {
          setError('No households found. Please add a household first.');
        }
      }
    } catch (err) {
      console.error('Error fetching households:', err);
      setError(err.response?.data?.message || 'Failed to fetch households');
    }
  };

  // Fetch estimated system size when household is selected
  const handleHouseholdChange = async (householdId) => {
    setSelectedHousehold(householdId);
    setReportData(null);
    setEstimatedSize(null);
    setError(null);

    if (!householdId) return;

    try {
      const token = getAuthToken();
      const response = await axios.get(
        `${API_URL}/api/solar/estimate-size/${householdId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setEstimatedSize(response.data.data.estimation);
        // Set default system size to max recommended
        if (response.data.data.estimation.maxSystemSize > 0) {
          setSystemSize(response.data.data.estimation.maxSystemSize.toFixed(1));
        }
      }
    } catch (err) {
      console.error('Error estimating system size:', err);
      setError(err.response?.data?.message || 'Failed to estimate system size');
    }
  };

  const calculateSolarProduction = async (e) => {
    e.preventDefault();
    
    if (!selectedHousehold) {
      setError('Please select a household');
      return;
    }

    if (!systemSize || systemSize <= 0) {
      setError('Please enter a valid system size');
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const token = getAuthToken();
      
      const response = await axios.post(
        `${API_URL}/api/solar/calculate/${selectedHousehold}`,
        {
          systemSize: parseFloat(systemSize),
          electricityRate: parseFloat(electricityRate),
          tiltAngle: parseFloat(tiltAngle),
          azimuthAngle: parseFloat(azimuthAngle)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setReportData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to calculate solar production');
      }
    } catch (err) {
      console.error('Error calculating solar production:', err);
      setError(
        err.response?.data?.message || 
        'Failed to calculate solar production. Please check your inputs and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ☀️ Solar Production Calculator
          </h1>
          <p className="text-gray-600">
            Estimate your solar energy production, savings, and environmental impact
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* No Households Banner */}
          {households.length === 0 && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-yellow-800">
                    No Households Found
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    You need to add a household profile before calculating solar production estimates. 
                    A household profile includes your location, roof area, and other details needed for accurate calculations.
                  </p>
                  <div className="mt-3">
                    <a
                      href="#add-household"
                      className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Your First Household
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={calculateSolarProduction}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Household Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Household *
                </label>
                <select
                  value={selectedHousehold}
                  onChange={(e) => handleHouseholdChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                  disabled={households.length === 0}
                >
                  <option value="">
                    {households.length === 0 
                      ? "-- No households available. Please add one first --" 
                      : "-- Choose a household --"}
                  </option>
                  {households.map((household) => (
                    <option key={household._id} value={household._id}>
                      {household.houseName || 'Unnamed Household'} - {household.district} | Roof: {household.roofArea} m² | Members: {household.members}
                    </option>
                  ))}
                </select>
                {households.length === 0 && (
                  <div className="mt-2">
                    <a 
                      href="#add-household" 
                      className="text-sm text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                    >
                      <span>+ Add your first household to get started</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Estimated Size Info */}
              {estimatedSize && (
                <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Roof Analysis</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Total Roof Area</p>
                      <p className="font-semibold text-blue-900">{estimatedSize.totalRoofArea} m²</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Usable Area</p>
                      <p className="font-semibold text-blue-900">{estimatedSize.usableRoofArea} m²</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Max System Size</p>
                      <p className="font-semibold text-blue-900">{estimatedSize.maxSystemSize} kW</p>
                    </div>
                    <div>
                      <p className="text-blue-700">Recommendations</p>
                      <p className="font-semibold text-blue-900">{estimatedSize.recommendations?.length || 0} options</p>
                    </div>
                  </div>
                </div>
              )}

              {/* System Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Size (kW) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={systemSize}
                  onChange={(e) => setSystemSize(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 3.5"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Typical residential systems: 1-10 kW
                </p>
              </div>

              {/* Electricity Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Electricity Rate (LKR/kWh)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 25"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Sri Lanka average: Rs 20-30/kWh
                </p>
              </div>

              {/* Tilt Angle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tilt Angle (degrees)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="90"
                  value={tiltAngle}
                  onChange={(e) => setTiltAngle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 7"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended for Sri Lanka: 7-10°
                </p>
              </div>

              {/* Azimuth Angle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Azimuth Angle (degrees)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="360"
                  value={azimuthAngle}
                  onChange={(e) => setAzimuthAngle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 180"
                />
                <p className="text-xs text-gray-500 mt-1">
                  180° = North (for Sri Lanka), 0° = South
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || !selectedHousehold}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  '⚡ Calculate Solar Production'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Report Display */}
        <SolarProductionReport 
          reportData={reportData} 
          loading={loading} 
          error={error}
        />

        {/* How to Get NREL API Key */}
        {!loading && !reportData && !error && (
          <div className="bg-gray-100 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              📝 Setup Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Get a free NREL API key from <a href="https://developer.nrel.gov/signup/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://developer.nrel.gov/signup/</a></li>
              <li>Add the API key to your server's .env file: <code className="bg-gray-200 px-2 py-1 rounded">NREL_API_KEY=your_key_here</code></li>
              <li>Restart your server</li>
              <li>Select a household and calculate solar production estimates!</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolarCalculator;
