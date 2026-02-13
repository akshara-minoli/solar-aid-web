import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ViewHousehold = () => {
  const [householdData, setHouseholdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Try to fetch household data
    const fetchHouseholdData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/households', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success && data.households && data.households.length > 0) {
          // Get the most recent household
          setHouseholdData(data.households[0]);
        } else {
          console.log('No household data found or empty array', data);
        }
      } catch (error) {
        console.error('Error fetching household data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouseholdData();
  }, []);

  const navigate = useNavigate();

  const navigateBack = () => {
    navigate('/home');
  };

  const navigateToEdit = () => {
    if (householdData && householdData._id) {
      navigate(`/add-household?id=${householdData._id}`);
    }
  };

  const navigateToRegister = () => {
    navigate('/add-household');
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/households/${householdData._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
        if (data.success) {
          alert('Household profile deleted successfully!');
          navigate('/home');
        } else {
        alert(data.message || 'Failed to delete household profile');
      }
    } catch (error) {
      console.error('Error deleting household:', error);
      alert('Error deleting household profile. Please try again.');
    }
    setShowDeleteModal(false);
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
              This will help us provide personalized recommendations.
            </p>
            <button
              onClick={navigateToRegister}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-lg"
            >
              📝 Setup Your Household Profile
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
                  <h4 className="font-semibold text-slate-800 mb-1">Personalized Assessment</h4>
                  <p className="text-sm text-slate-600">Get accurate recommendations based on your household data</p>
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
                  <h4 className="font-semibold text-slate-800 mb-1">Energy Saving Tips</h4>
                  <p className="text-sm text-slate-600">Monitor your household profile&apos;s energy consumption and save money.</p>
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
                <h1 className="text-2xl font-bold text-slate-800">My Household Profile</h1>
                <p className="text-slate-500 text-sm">Your registered home details</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={navigateToEdit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                ✏️ Edit Details
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-5">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <h3 className="font-semibold text-slate-500 text-sm mb-2">House Type</h3>
              <p className="text-lg text-slate-800 bg-slate-50 p-3 rounded-lg capitalize">
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

            <div className="md:col-span-2">
              <h3 className="font-semibold text-slate-500 text-sm mb-2">House Address</h3>
              <p className="text-lg text-slate-800 bg-slate-50 p-3 rounded-lg">
                {householdData.houseAddress || 'Not specified'}
              </p>
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

          </div>
        </div>


        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Delete Household Profile?</h3>
                <p className="text-slate-600">
                  This action cannot be undone. All your household data will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewHousehold;