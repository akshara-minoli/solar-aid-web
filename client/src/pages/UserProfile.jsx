import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();

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
            setSuccess('Profile synchronized successfully');
            setIsEditing(false);

            // Refresh timeout to allow user to see success
            setTimeout(() => {
                window.location.reload();
            }, 1000);
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

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        } catch (err) {
            setError(err.message);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Accessing Registry">
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] animate-pulse">Initializing Identity Protocol</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Profile">
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">

                {/* Profile Header Card */}
                <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/5 p-10 md:p-12 rounded-[2.5rem] shadow-2xl group">
                    <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-1000"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-5xl shadow-2xl border-4 border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                {userData?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-[#0F172A] animate-pulse"></div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Subject Classification: Active User</p>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
                                {userData?.fullName}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center text-slate-400 font-bold text-sm">
                                <span className="bg-white/5 px-4 py-1.5 rounded-xl border border-white/5 text-xs text-slate-300 break-all">
                                    {userData?.email}
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                                        >
                                            <span>✏️</span> Edit Profile
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="px-8 py-3 bg-rose-600/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                        >
                                            <span>🗑️</span> Delete Profile
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
                                        className="px-8 py-3 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all fle items-center gap-2"
                                    >
                                        Abort Operations
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 animate-in slide-in-from-top-2">
                        <p className="text-rose-400 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                            <span className="text-lg">⚠️</span> System Fault: {error}
                        </p>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 animate-in slide-in-from-top-2">
                        <p className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                            <span className="text-lg">✓</span> Protocol Synchronized: {success}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Account Information Section */}
                    <div className="lg:col-span-8">
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-10 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/5 rounded-br-[4rem]"></div>
                            <h2 className="relative z-10 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                                <span className="text-blue-500 font-normal">📋</span> Registry Data Access
                            </h2>

                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                                Full Subject Name
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                                Digital Contact Path (Email)
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                                Telemetry Signal (Phone)
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone || ''}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                                placeholder="+XX XXX XXX XXXX"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={updateLoading}
                                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-blue-600/20"
                                        >
                                            {updateLoading ? 'Synchronizing...' : 'Update Profile'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-10 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-500">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Legal Identity
                                            </p>
                                            <p className="text-xl font-black text-white tracking-tight uppercase">{userData?.fullName || 'Undefined'}</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-500">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Comm Signal
                                            </p>
                                            <p className="text-xl font-black text-white tracking-tight break-all">{userData?.email || 'Undefined'}</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-500">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Cellular Telemetry
                                            </p>
                                            <p className="text-xl font-black text-white tracking-tight">{userData?.phone || 'Secure / Unlisted'}</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:bg-white/10 transition-all duration-500">
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Commission Date
                                            </p>
                                            <p className="text-xl font-black text-white tracking-tight uppercase">
                                                {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] shadow-xl space-y-4">
                            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6 px-2">System Telemetry</h3>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center group hover:bg-white/10 transition-all">
                                <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">🏠</div>
                                <p className="text-3xl font-black text-white tracking-tighter">1</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Managed Infrastructure</p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center group hover:bg-white/10 transition-all">
                                <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">⚡</div>
                                <p className="text-3xl font-black text-emerald-400 tracking-tighter uppercase">Active</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Neural Sync Status</p>
                            </div>

                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center group hover:bg-white/10 transition-all">
                                <div className="text-4xl mb-3 grayscale group-hover:grayscale-0 transition-all">🛡️</div>
                                <p className="text-3xl font-black text-blue-400 tracking-tighter uppercase">Secure</p>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Data Encapsulation</p>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[2.5rem]">
                            <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-4">Security Advisory</p>
                            <p className="text-slate-400 text-xs italic leading-relaxed">
                                "Identity data is encrypted and distributed across the secure registry node. Regular maintenance ensures operational integrity."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                        <div className="bg-[#1E293B] border border-white/10 rounded-[3rem] p-10 md:p-14 max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden text-center">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600"></div>

                            <div className="text-6xl mb-8 scale-110">⚠️</div>
                            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Delete Profile Confirmation</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-10 italic">
                                Critical Warning: This protocol will permanently dissolve your digital identity. All household logs, service history, and telemetry will be erased from the registry. This action is irreversible.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleDelete}
                                    className="px-6 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-rose-600/20"
                                >
                                    Confirm Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-6 py-4 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                            </div>

                            <p className="mt-8 text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Security Protocol: 99-IDENTITY-PURGE</p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default UserProfile;
