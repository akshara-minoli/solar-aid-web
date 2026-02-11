import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch user data');
            }

            setUserData(data.data);
            setFormData({
                fullName: data.data.fullName || '',
                email: data.data.email || '',
                phone: data.data.phone || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // Update local storage
            localStorage.setItem('user', JSON.stringify(data.data));
            
            setUserData(data.data);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            
            // Refresh page to update sidebar
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/users/profile', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete account');
            }

            // Clear local storage and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Account deleted successfully!');
            window.location.hash = 'home';
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="My Profile">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Profile">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-4xl shadow-lg">
                            {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-800">{userData?.fullName}</h1>
                            <p className="text-slate-500 mt-1">{userData?.email}</p>
                            <div className="flex gap-3 mt-4">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
                                        >
                                            ✏️ Edit Profile
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                                        >
                                            🗑️ Delete Account
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                fullName: userData.fullName || '',
                                                email: userData.email || '',
                                                phone: userData.phone || ''
                                            });
                                            setError('');
                                            setSuccess('');
                                        }}
                                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <p className="text-emerald-800 text-sm">{success}</p>
                    </div>
                )}

                {/* Profile Details Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Account Information</h2>

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone || ''}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="+94 XX XXX XXXX"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updateLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Full Name</p>
                                <p className="text-base text-slate-800">{userData?.fullName || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Email Address</p>
                                <p className="text-base text-slate-800">{userData?.email || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Phone Number</p>
                                <p className="text-base text-slate-800">{userData?.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-1">Member Since</p>
                                <p className="text-base text-slate-800">
                                    {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                        <div className="text-3xl mb-2">🏠</div>
                        <p className="text-2xl font-bold text-slate-800">1</p>
                        <p className="text-sm text-slate-500">Household</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                        <div className="text-3xl mb-2">💬</div>
                        <p className="text-2xl font-bold text-slate-800">Active</p>
                        <p className="text-sm text-slate-500">Account Status</p>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
                        <div className="text-3xl mb-2">🔒</div>
                        <p className="text-2xl font-bold text-slate-800">Secure</p>
                        <p className="text-sm text-slate-500">Data Protected</p>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
                            <div className="text-center mb-6">
                                <div className="text-5xl mb-4">⚠️</div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Delete Account?</h3>
                                <p className="text-slate-600">
                                    This action cannot be undone. All your data, including household information and consultation requests, will be permanently deleted.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Yes, Delete My Account
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserProfile;
