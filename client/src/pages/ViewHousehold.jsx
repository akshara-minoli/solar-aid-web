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
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
          {/* Welcome Card */}
          <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-12 rounded-3xl shadow-2xl group text-center">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                <span className="text-6xl">🏠</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-4 uppercase">
                Initialize Your Profile
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto italic">
                To unlock intelligent solar analytics and energy optimization for your home, we need a few basic details to configure your digital twin.
              </p>
              <button
                onClick={navigateToRegister}
                className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/20 uppercase text-xs tracking-[0.2em] group flex items-center gap-4 mx-auto"
              >
                <span>Setup Household Profile</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl overflow-hidden relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-3xl rounded-full"></div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
              <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">✨</span>
              Digital Twin Capabilities
            </h3>
            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0 border border-blue-500/10">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Precision Analytics</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Hyper-local solar potential based on roof dynamics</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 flex-shrink-0 border border-emerald-500/10">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">ROI Projections</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Real-time savings estimation and payback periods</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 flex-shrink-0 border border-orange-500/10">
                  <span className="text-xl">⚡</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Energy Optimization</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Intelligent consumption tracking and optimization</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 flex-shrink-0 border border-purple-500/10">
                  <span className="text-xl">🌱</span>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Carbon Tracking</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">Environmental impact metrics and green certification</p>
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
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Card */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl group">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span className="text-4xl text-blue-400">🏠</span>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-1">
                  My Global Household
                </h1>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  Identity Verified & Optimized
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={navigateToEdit}
                className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 hover:text-white transition-all uppercase text-xs tracking-widest flex items-center gap-2"
              >
                <span>Edit Profile</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all uppercase text-xs tracking-widest"
              >
                Delete Profile
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-b border-white/10 px-8 py-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3 font-bold uppercase text-xs tracking-[0.2em] text-blue-400">
              Structural Metadata Analysis
            </h2>
          </div>

          <div className="p-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Structural Type</h3>
                <p className="text-xl font-black text-white capitalize">
                  {householdData.houseType || 'Independent'}
                </p>
              </div>

              <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Roof Inventory</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-white">
                    {householdData.roofArea}
                  </p>
                  <span className="text-[10px] font-black text-blue-500 uppercase">SQ FT</span>
                </div>
              </div>

              <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Geographic Zone</h3>
                <p className="text-xl font-black text-white">
                  {householdData.district || 'Verified'}
                </p>
              </div>

              <div className="space-y-2 p-5 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Occupancy Density</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-black text-white">
                    {householdData.members}
                  </p>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Members</span>
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-4 space-y-2 p-6 bg-white/5 rounded-2xl border border-white/5">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Global Address</h3>
                <p className="text-lg font-bold text-slate-200 indent-2 leading-relaxed">
                  {householdData.houseAddress || 'Address registry available only to verified technicians'}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Status Metrics Card */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Strategic Benefits
            </h3>
            <div className="space-y-4">
              {[
                { icon: '☀️', text: 'Clean energy generation potential: High' },
                { icon: '📉', text: 'Estimated bill reduction: 65% - 80%' },
                { icon: '🏦', text: 'Applicable government subsidies: Eligible' },
                { icon: '🛡️', text: 'Long-term infrastructure warranty: 25 Years' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-slate-300 font-medium">
                  <span className="text-xl bg-white/5 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              Optimization Status
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  <span>Profile Integrity</span>
                  <span className="text-blue-400">100% Verified</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-blue-500 w-full"></div>
                </div>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <p className="text-xs text-blue-300 font-medium leading-relaxed italic text-center">
                  "Your profile is fully optimized for our solar mapping engine. Weather data and local irradiance metrics are being live-calculated."
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-[#0B1120] border border-white/10 rounded-3xl p-10 max-w-md w-full shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl"></div>
              <div className="text-center mb-8 relative z-10">
                <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-rose-500">⚠️</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase mb-3">Delete Profile?</h3>
                <p className="text-slate-400 font-medium italic">
                  Critical Warning: This action will permanently erase your household identity from the mapping engine. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-4 relative z-10">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all uppercase text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black transition-all shadow-xl shadow-rose-600/20 uppercase text-xs tracking-widest"
                >
                  Confirm Delete
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