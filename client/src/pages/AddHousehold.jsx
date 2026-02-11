import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

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

    useEffect(() => {
        // Check if we're in edit mode by looking for ID in URL
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.split('?')[1]);
        const id = urlParams.get('id');
        
        if (id) {
            setIsEditMode(true);
            setHouseholdId(id);
            fetchHouseholdData(id);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchHouseholdData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/households/${id}`, {
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
                ? `http://localhost:5000/api/households/${householdId}`
                : 'http://localhost:5000/api/households';
            
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
            
            const data = await response.json();
            
            if (data.success) {
                alert(isEditMode 
                    ? 'Household profile updated successfully!' 
                    : 'Household profile saved successfully!');
                window.location.hash = 'view-household';
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
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-3xl space-y-10">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="text-8xl mb-6">🏠</div>
                        <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-3">
                            {isEditMode ? 'Edit Household Profile' : 'Your Household Profile'}
                        </h2>
                        <p className="text-slate-500 text-xl">
                            {isEditMode ? 'Update your home details' : 'Configure your home details for solar mapping'}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                        {/* Info Banner */}
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-10 py-8 text-white">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl flex-shrink-0">ℹ️</span>
                                <div>
                                    <p className="font-bold mb-2 text-lg">Important Information</p>
                                    <p className="text-base text-emerald-50">
                                        This information helps us calculate your home's solar potential, 
                                        estimated costs, and energy savings. All fields are required.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            {/* Structural Type */}
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-3">
                                    Structural Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="houseType"
                                    value={formData.houseType}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 font-medium text-lg"
                                >
                                    <option value="">Select House Type</option>
                                    <option value="house">House</option>
                                    <option value="apartment">Apartment</option>
                                </select>
                            </div>

                            {/* Roof Surface */}
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-3">
                                    Roof Surface (sq ft) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="roofArea"
                                    value={formData.roofArea}
                                    onChange={handleChange}
                                    placeholder="Enter roof area in square feet"
                                    required
                                    min="1"
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                                />
                            </div>

                            {/* Occupancy Count */}
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-3">
                                    Occupancy Count <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="members"
                                    value={formData.members}
                                    onChange={handleChange}
                                    placeholder="Number of household members"
                                    required
                                    min="1"
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                                />
                            </div>

                            {/* Geographic District */}
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-3">
                                    Geographic District <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="Enter your district or region"
                                    required
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                                />
                            </div>

                            {/* House Address */}
                            <div>
                                <label className="block text-base font-bold text-slate-700 mb-3">
                                    House Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="houseAddress"
                                    value={formData.houseAddress}
                                    onChange={handleChange}
                                    placeholder="Enter your complete house address"
                                    required
                                    className="w-full bg-white border-2 border-slate-200 rounded-xl px-6 py-5 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 font-medium text-lg placeholder:text-slate-400"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                                >
                                    <span>{isEditMode ? 'Update Household Profile' : 'Save Household Profile'}</span>
                                    <span className="text-2xl">✓</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            )}
        </DashboardLayout>
    );
};

export default AddHousehold;
