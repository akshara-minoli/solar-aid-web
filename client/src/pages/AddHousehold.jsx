import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const AddHousehold = () => {
    const [formData, setFormData] = useState({
        houseType: '',
        roofArea: '',
        district: '',
        members: '',
        houseAddress: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [householdId, setHouseholdId] = useState(null);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we're in edit mode by looking for ID in query string
        const searchPart = location.search || '';
        const urlParams = new URLSearchParams(searchPart);
        const id = urlParams.get('id');

        console.log('ID from search:', id);

        if (id) {
            setIsEditMode(true);
            setHouseholdId(id);
            fetchHouseholdData(id);
        } else {
            setLoading(false);
        }
    }, [location.search]);

    const fetchHouseholdData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/households/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success && data.household) {
                setFormData({
                    houseType: data.household.houseType || '',
                    roofArea: data.household.roofArea || '',
                    district: data.household.district || '',
                    members: data.household.members || '',
                    houseAddress: data.household.houseAddress || ''
                });
            }
        } catch (error) {
            console.error('Error fetching household data:', error);
            alert('Error loading household data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.houseType || !formData.roofArea || !formData.district || !formData.members || !formData.houseAddress) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const url = isEditMode
                ? `/api/households/${householdId}`
                : '/api/households';

            const method = isEditMode ? 'PUT' : 'POST';

            // Convert numeric fields to numbers
            const submitData = {
                ...formData,
                roofArea: Number(formData.roofArea),
                members: Number(formData.members)
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(submitData)
            });

            console.log('Submission info:', { url, method, submitData });

            const data = await response.json();

            if (data.success) {
                alert(isEditMode
                    ? 'Household profile updated successfully!'
                    : 'Household profile saved successfully!');
                navigate('/view-household');
            } else {
                alert(data.message || 'Failed to save household profile');
            }
        } catch (error) {
            console.error('Error saving household profile:', error);
            alert('Error connecting to server. Please try again.');
        }
    };

    return (
        <DashboardLayout title={isEditMode ? "Edit Household Profile" : "Household Profile Setup"}>
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-slate-600">Loading household data...</p>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
                    {/* Header Section */}
                    <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-2xl group text-center">
                        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                <span className="text-5xl">🏠</span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight mb-3 uppercase">
                                {isEditMode ? 'Edit Household Profile' : 'Household Profile Setup'}
                            </h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto italic">
                                {isEditMode ? 'Update your home details' : 'Configure your home details for intelligent solar mapping and efficiency calculation'}
                            </p>
                        </div>
                    </div>

                    {/* Form Card */}
                    {/* Main Configuration Card */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
                        {/* Info Banner */}
                        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-b border-white/10 px-10 py-8 backdrop-blur-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/20">
                                    <span className="text-xl">ℹ️</span>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold mb-1 text-white text-lg">Detailed Analytics Data</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        This data powers our AI engine to calculate your home's exact solar potential,
                                        long-term ROI, and personalized energy optimization strategies.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="p-10 space-y-8 relative z-10">
                            {/* Structural Type */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Structural Type <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <select
                                            name="houseType"
                                            value={formData.houseType}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium appearance-none"
                                        >
                                            <option value="" className="bg-[#0B1120] text-white">Select House Type</option>
                                            <option value="house" className="bg-[#0B1120] text-white">House (Independent)</option>
                                            <option value="apartment" className="bg-[#0B1120] text-white">Apartment / Condo</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Roof Surface */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Roof Surface (sq ft) <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="roofArea"
                                            value={formData.roofArea}
                                            onChange={handleChange}
                                            placeholder="e.g. 1500"
                                            required
                                            min="1"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium placeholder:text-slate-600"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs uppercase tracking-widest">SQ FT</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Occupancy Count */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Occupancy Count <span className="text-blue-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="members"
                                        value={formData.members}
                                        onChange={handleChange}
                                        placeholder="Number of members"
                                        required
                                        min="1"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium placeholder:text-slate-600"
                                    />
                                </div>

                                {/* Geographic District */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Geographic District <span className="text-blue-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium appearance-none"
                                        >
                                            <option value="" className="bg-[#0B1120] text-white">Select District</option>
                                            {districts.map((district) => (
                                                <option key={district} value={district} className="bg-[#0B1120] text-white">
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* House Address */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                    House Address <span className="text-blue-500">*</span>
                                </label>
                                <textarea
                                    name="houseAddress"
                                    value={formData.houseAddress}
                                    onChange={handleChange}
                                    placeholder="Enter your complete house address"
                                    required
                                    rows="3"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 transition-all text-white font-medium placeholder:text-slate-600 resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6 border-t border-white/5">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-6 rounded-xl shadow-xl shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-4 group uppercase tracking-[0.2em]"
                                >
                                    <span>{isEditMode ? 'Update Global Profile' : 'Initialize Household Profile'}</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AddHousehold;
