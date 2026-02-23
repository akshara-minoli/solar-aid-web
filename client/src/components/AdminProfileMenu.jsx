import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminProfileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/users/profile');
            if (res.data && res.data.success) {
                setProfile(res.data.data);
                setFormData({
                    fullName: res.data.data.fullName || '',
                    email: res.data.data.email || '',
                    phone: res.data.data.phone || '',
                    password: ''
                });
            }
        } catch (err) {
            console.error('Failed to load admin profile', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password; // Don't send empty password

            const res = await api.put('/api/users/profile', payload);

            if (res.data && res.data.success) {
                setProfile(res.data.data);
                setSuccess('Profile updated successfully!');
                setIsEditing(false);
                setFormData(prev => ({ ...prev, password: '' })); // clear password input
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('WARNING: Are you sure you want to delete your administrator account? This action cannot be undone.')) {
            try {
                await api.delete('/api/users/profile');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } catch (err) {
                setError(err.response?.data?.message || 'Error deleting account');
            }
        }
    };

    const openModal = () => {
        setIsOpen(false);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setError('');
        setSuccess('');
        // reset form to current profile
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                password: ''
            });
        }
    };

    const inputClass = "w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors text-sm";

    return (
        <div className="absolute top-6 right-8 z-50">

            {/* Profile Icon Action */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                >
                    <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold shadow-inner">
                        {profile ? profile.fullName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-semibold text-white leading-tight">
                            {profile ? profile.fullName : 'Admin'}
                        </p>
                        <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Admin</p>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-[#0B1120] border border-white/10 rounded-xl shadow-2xl py-2 backdrop-blur-xl">
                        <button
                            onClick={openModal}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-3 font-medium"
                        >
                            <span>👤</span> My Profile
                        </button>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                navigate('/login');
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-3 font-medium"
                        >
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                )}
            </div>

            {/* CRUD Profile Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#0B1120] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                            <span className="text-blue-400">👤</span> Admin Profile
                        </h2>

                        {error && <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg text-sm">{error}</div>}
                        {success && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-sm">{success}</div>}

                        {!isEditing ? (
                            <div className="space-y-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                                    <p className="text-white font-medium">{profile?.fullName}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Email <span className="text-[10px] text-blue-400 lowercase ml-2 font-normal">(Login ID)</span></p>
                                    <p className="text-white font-medium">{profile?.email}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                                    <p className="text-white font-medium">{profile?.phone || 'Not provided'}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Role</p>
                                    <p className="text-blue-400 font-bold uppercase text-sm tracking-wide">{profile?.role}</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 rounded-lg font-medium transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 ml-1">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5 ml-1">New Password <span className="text-[10px] lowercase text-slate-500 font-normal italic">(leave blank to keep current)</span></label>
                                    <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className={inputClass} placeholder="••••••••" minLength="6" />
                                </div>

                                <div className="flex gap-3 pt-4 mt-2 border-t border-white/10">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                fullName: profile?.fullName || '',
                                                email: profile?.email || '',
                                                phone: profile?.phone || '',
                                                password: ''
                                            });
                                        }}
                                        className="flex-1 bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/30 py-2.5 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
