import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ViewHousehold = () => {
  const [householdData, setHouseholdData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch household data
    const fetchHouseholdData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/household', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.household) {
          setHouseholdData(data.household);
        }
      } catch (error) {
        console.log('No household data found');
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholdData();
  }, []);

  const navigateBack = () => {
    window.location.hash = 'dashboard';
  };

  const navigateToEdit = () => {
    window.location.hash = 'add-household';
  };

  const navigateToRegister = () => {
    window.location.hash = 'add-household';
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout title="Household Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-slate-600">Loading household data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // No household data - show registration prompt
  if (!householdData) {
    return (
      <DashboardLayout title="Household Profile">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
            <div className="text-7xl mb-6">🏠</div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome to Your Household Profile</h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              To get started with your solar energy journey, we need some basic information about your home. 
              This will help us provide accurate solar potential calculations and personalized recommendations.
            </p>
            <button
              onClick={navigateToRegister}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-lg"
            >
              📝 Register Your Household
            </button>
          </div>

          {/* Benefits Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border border-emerald-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">What You&apos;ll Get:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Personalized Solar Assessment</h4>
                  <p className="text-sm text-slate-600">Get accurate calculations based on your roof area and location</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Cost & Savings Estimates</h4>
                  <p className="text-sm text-slate-600">See potential savings and installation costs for your home</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Energy Tracking</h4>
                  <p className="text-sm text-slate-600">Monitor your household&apos;s energy consumption and solar potential</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Environmental Impact</h4>
                  <p className="text-sm text-slate-600">Track your carbon footprint reduction and contribution to clean energy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Household data exists - show full profile
  return (
    <DashboardLayout title="Household Profile">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🏠</div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">My Household Information</h1>
                <p className="text-slate-500 text-sm">Your registered home details and solar assessment</p>
              </div>
            </div>
            <button
              onClick={navigateToEdit}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              ✏️ Edit Details
            </button>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <h3 className="font-semibold text-slate-500 text-sm mb-2">House Type</h3>
              <p className="text-lg text-slate-800 bg-slate-50 p-3 rounded-lg">
                {householdData.houseType || 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-500 text-sm mb-2">Roof Area</h3>
              <p className="text-lg text-slate-800 bg-slate-50 p-3 rounded-lg">
                {householdData.roofArea} sq ft
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-500 text-sm mb-2">District</h3>
              <p className="text-lg text-slate-800 bg-slate-50 p-3 rounded-lg">
                {householdData.district || 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-500 text-sm mb-2">Household Members</h3>
              <p className="text-lg text-slate-800 bg-slate-50 p-3 rounded-lg">
                {householdData.members || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Solar Calculations Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Solar Energy Assessment</h2>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-5 rounded-xl text-center border border-yellow-200">
              <div className="text-4xl mb-3">☀️</div>
              <h3 className="font-bold text-yellow-800 mb-2 text-sm">Recommended Solar Capacity</h3>
              <p className="text-3xl font-bold text-yellow-700">{(householdData.roofArea * 0.004).toFixed(1)} kW</p>
              <p className="text-xs text-yellow-600 mt-2">Based on your roof area</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl text-center border border-orange-200">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-orange-800 mb-2 text-sm">Estimated Cost</h3>
              <p className="text-3xl font-bold text-orange-700">₹{((householdData.roofArea * 0.004) * 50000).toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-2">Including installation</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl text-center border border-emerald-200">
              <div className="text-4xl mb-3">📉</div>
              <h3 className="font-bold text-emerald-800 mb-2 text-sm">Monthly Savings</h3>
              <p className="text-3xl font-bold text-emerald-700">₹{((householdData.roofArea * 0.004) * 400).toFixed(0)}</p>
              <p className="text-xs text-emerald-600 mt-2">On electricity bills</p>
            </div>
          </div>
        </div>

        {/* Benefits & Features Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Benefits for Your Home</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span>What you&apos;ll get:</span>
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Clean, renewable energy
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Reduced electricity bills
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  Government subsidies available
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                  25-year warranty on panels
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <span className="text-lg">📊</span>
                <span>Environmental Impact:</span>
              </h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {((householdData.roofArea * 0.004) * 1.2).toFixed(1)} tons CO₂ saved annually
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Equivalent to planting {Math.floor((householdData.roofArea * 0.004) * 3)} trees
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Support clean energy transition
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Energy independence for your home
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm border border-emerald-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-3">Ready for Solar?</h2>
          <p className="text-slate-600 mb-5">
            Based on your household information, you&apos;re a great candidate for solar energy!
            Take the next step to get a detailed quote and installation timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold">
              📞 Request Site Visit
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition duration-300 font-semibold">
              📋 Get Detailed Quote
            </button>
            <button className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg transition duration-300 font-semibold">
              💬 Talk to Expert
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewHousehold;