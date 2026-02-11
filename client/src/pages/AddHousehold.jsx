import { useState } from 'react';
<<<<<<< Updated upstream
import DashboardLayout from '../components/DashboardLayout';
=======
>>>>>>> Stashed changes

const AddHousehold = () => {
    const [formData, setFormData] = useState({
        houseType: '',
        roofArea: '',
        district: '',
<<<<<<< Updated upstream
        members: '',
        houseAddress: ''
    });

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
            const response = await fetch('http://localhost:5000/api/users/household', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                alert('Household details saved successfully!');
                window.location.hash = 'view-household';
            } else {
                alert(data.message || 'Failed to save household details');
            }
        } catch (error) {
            console.error('Error saving household:', error);
            alert('Error connecting to server. Please try again.');
        }
    };

    return (
        <DashboardLayout title="Configure Profile">
            <div className="min-h-screen flex items-center justify-center py-12 px-4">
                <div className="w-full max-w-3xl space-y-10">
                    
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="text-8xl mb-6">🏠</div>
                        <h2 className="text-5xl font-black text-slate-800 tracking-tight mb-3">Your Home</h2>
                        <p className="text-slate-500 text-xl">Configure your structural details for mapping</p>
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
                                    <span>Save Household Profile</span>
                                    <span className="text-2xl">✓</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
=======
        members: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Household details saved successfully! (UI Demo)');
        console.log('Household Data:', formData);
        // Redirect to view household
        window.location.hash = 'view-household';
    };

    const navigateBack = () => {
        window.location.hash = 'dashboard';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-6 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={navigateBack}
                            className="bg-orange-600 hover:bg-orange-700 p-2 rounded-lg transition duration-200"
                        >
                            ← Back
                        </button>
                        <span className="text-3xl">🏠</span>
                        <h1 className="text-2xl font-bold">Add Household Details</h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold text-green-700 mb-2">Tell Us About Your Home</h2>
                        <p className="text-gray-600">We need this information to calculate your solar potential</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* House Type */}
                        <div>
                            <label className="block text-sm font-bold text-green-700 mb-2">
                                House Type *
                            </label>
                            <select
                                name="houseType"
                                value={formData.houseType}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200 bg-white"
                            >
                                <option value="">Select House Type</option>
                                <option value="pucca">Pucca House (Concrete)</option>
                                <option value="semi-pucca">Semi-Pucca (Mixed)</option>
                                <option value="kuccha">Kuccha House (Mud/Thatch)</option>
                                <option value="apartment">Apartment</option>
                            </select>
                        </div>

                        {/* Roof Area */}
                        <div>
                            <label className="block text-sm font-bold text-green-700 mb-2">
                                Roof Area (sq ft) *
                            </label>
                            <input
                                type="number"
                                name="roofArea"
                                value={formData.roofArea}
                                onChange={handleChange}
                                placeholder="Approximate roof area available for solar"
                                required
                                min="50"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                💡 Typically 100 sq ft is needed for 1kW solar panels
                            </p>
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-bold text-green-700 mb-2">
                                District / Location *
                            </label>
                            <input
                                type="text"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder="Enter your district name"
                                required
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200"
                            />
                        </div>

                        {/* Family Members */}
                        <div>
                            <label className="block text-sm font-bold text-green-700 mb-2">
                                Number of Family Members
                            </label>
                            <input
                                type="number"
                                name="members"
                                value={formData.members}
                                onChange={handleChange}
                                placeholder="How many people live here?"
                                min="1"
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition duration-200"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-lg transition duration-200 font-bold text-lg shadow-lg"
                            >
                                Save Household Details
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
>>>>>>> Stashed changes
    );
};

export default AddHousehold;
