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
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
            'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
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
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Consultations Yet</h3>
                        <p className="text-slate-500 mb-6">You haven't submitted any consultation requests yet.</p>
                        <button
                            onClick={() => navigate('/home')}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {consultations.map((consultation) => (
                            <div key={consultation._id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                {editingId === consultation._id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Consultation</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={editForm.fullName}
                                                    onChange={handleUpdateChange}
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Village
                                                </label>
                                                <input
                                                    type="text"
                                                    name="village"
                                                    value={editForm.village}
                                                    onChange={handleUpdateChange}
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    name="phoneNumber"
                                                    value={editForm.phoneNumber}
                                                    onChange={handleUpdateChange}
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Consultation Type
                                                </label>
                                                <select
                                                    name="consultationType"
                                                    value={editForm.consultationType}
                                                    onChange={handleUpdateChange}
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                >
                                                    <option value="Solar Installation">Solar Installation</option>
                                                    <option value="System Maintenance">System Maintenance</option>
                                                    <option value="Energy Efficiency">Energy Efficiency</option>
                                                    <option value="Financial Planning">Financial Planning</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Description <span className="text-slate-400 font-normal">(Optional)</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                value={editForm.description}
                                                onChange={handleUpdateChange}
                                                rows="4"
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => handleUpdate(consultation._id)}
                                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-bold text-slate-800">
                                                        {consultation.consultationType}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(consultation.status)}`}>
                                                        {consultation.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    Submitted on {new Date(consultation.createdAt).toLocaleDateString()} at {new Date(consultation.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(consultation)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(consultation._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Full Name</p>
                                                <p className="text-sm text-slate-800">{consultation.fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Village</p>
                                                <p className="text-sm text-slate-800">{consultation.village}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Phone Number</p>
                                                <p className="text-sm text-slate-800">{consultation.phoneNumber}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 mb-1">Description</p>
                                            <p className="text-sm text-slate-700 leading-relaxed">{consultation.description}</p>
                                        </div>

                                        {/* Delete Confirmation */}
                                        {deleteConfirm === consultation._id && (
                                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-800 font-semibold mb-3">Are you sure you want to delete this consultation request?</p>
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleDelete(consultation._id)}
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                                                    >
                                                        Yes, Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ViewConsultations;
