import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ViewConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your consultations');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/consultations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch consultations');
            }

            setConsultations(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (consultation) => {
        setEditingId(consultation._id);
        setEditForm({
            fullName: consultation.fullName,
            village: consultation.village,
            phoneNumber: consultation.phoneNumber,
            consultationType: consultation.consultationType,
            description: consultation.description
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/consultations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update consultation');
            }

            setConsultations(consultations.map(c =>
                c._id === id ? data.data : c
            ));
            setEditingId(null);
            setEditForm({});
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/consultations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete consultation');
            }

            setConsultations(consultations.filter(c => c._id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            'Accepted': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'Rejected': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
            'In Progress': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
            'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'Cancelled': 'bg-white/5 text-slate-500 border-white/10'
        };
        return colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    };

    if (loading) {
        return (
            <DashboardLayout title="My Consultations">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Consultations">
            <div className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {consultations.length === 0 ? (
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-16 text-center animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-slate-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">No Consultations Found</h3>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">Your consultation history is currently empty. Start your journey by requesting expert advice today.</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 uppercase text-xs tracking-widest"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {consultations.map((consultation) => (
                            <div key={consultation._id} className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl group transition-all duration-500 hover:bg-white/10 hover:border-white/10">
                                <div className="p-8">
                                    {editingId === consultation._id ? (
                                        // Edit Mode
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">Edit Consultation Request</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                        Full Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        value={editForm.fullName}
                                                        onChange={handleUpdateChange}
                                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                        Village
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="village"
                                                        value={editForm.village}
                                                        onChange={handleUpdateChange}
                                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="phoneNumber"
                                                        value={editForm.phoneNumber}
                                                        onChange={handleUpdateChange}
                                                        className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                        Consultation Type
                                                    </label>
                                                    <div className="relative">
                                                        <select
                                                            name="consultationType"
                                                            value={editForm.consultationType}
                                                            onChange={handleUpdateChange}
                                                            className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
                                                        >
                                                            <option value="Solar Installation" className="bg-[#0B1120] text-white">Solar Installation</option>
                                                            <option value="System Maintenance" className="bg-[#0B1120] text-white">System Maintenance</option>
                                                            <option value="Energy Efficiency" className="bg-[#0B1120] text-white">Energy Efficiency</option>
                                                            <option value="Financial Planning" className="bg-[#0B1120] text-white">Financial Planning</option>
                                                            <option value="Other" className="bg-[#0B1120] text-white">Other</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                    Requirement Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={editForm.description}
                                                    onChange={handleUpdateChange}
                                                    rows="4"
                                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium resize-none shadow-inner"
                                                />
                                            </div>
                                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                                <button
                                                    onClick={() => handleUpdate(consultation._id)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 uppercase text-xs tracking-widest"
                                                >
                                                    Update Request
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-8 py-3.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all uppercase text-xs tracking-wide"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <div className="flex items-start justify-between mb-8 pb-6 border-b border-white/5">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <h3 className="text-2xl font-black text-white tracking-tight">
                                                            {consultation.consultationType}
                                                        </h3>
                                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getStatusColor(consultation.status)}`}>
                                                            {consultation.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-400 transition-colors">
                                                        <span className="text-blue-500/50">🗓️</span>
                                                        <p className="text-xs font-bold uppercase tracking-wider">
                                                            Submitted {new Date(consultation.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(consultation)}
                                                        className="w-10 h-10 flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 rounded-xl transition-all shadow-lg shadow-blue-500/10"
                                                        title="Edit Request"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(consultation._id)}
                                                        className="w-10 h-10 flex items-center justify-center bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all shadow-lg shadow-rose-500/10"
                                                        title="Remove Request"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Requester Name</p>
                                                    <p className="text-sm text-white font-medium">{consultation.fullName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Village/Sector</p>
                                                    <p className="text-sm text-white font-medium">{consultation.village}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Identity</p>
                                                    <p className="text-sm text-white font-medium">{consultation.phoneNumber}</p>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 border border-white/5 rounded-xl p-6">
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <span className="text-blue-500">📝</span> Requirement Analysis
                                                </p>
                                                <p className="text-sm text-slate-300 leading-relaxed italic">
                                                    "{consultation.description}"
                                                </p>
                                            </div>

                                            {/* Delete Confirmation */}
                                            {deleteConfirm === consultation._id && (
                                                <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                                                    <div className="flex items-center gap-4 mb-4">
                                                        <div className="w-10 h-10 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400">
                                                            <span>⚠️</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold">Confirm Removal</p>
                                                            <p className="text-xs text-rose-400 font-medium font-bold uppercase tracking-widest">This action cannot be undone</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleDelete(consultation._id)}
                                                            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all text-xs uppercase tracking-widest shadow-lg shadow-rose-500/20"
                                                        >
                                                            Confirm Delete
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-6 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                                                        >
                                                            Keep Request
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout >
    );
};

export default ViewConsultations;
