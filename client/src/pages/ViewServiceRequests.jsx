import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ViewServiceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to view your service requests');
                setLoading(false);
                return;
            }

            const response = await fetch('/api/assistances', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch service requests');
            }

            setRequests(data.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (request) => {
        setEditingId(request._id);
        setEditForm({
            fullName: request.fullName,
            village: request.village,
            phoneNumber: request.phoneNumber,
            assistanceType: request.assistanceType,
            problemDescription: request.problemDescription
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
            const response = await fetch(`/api/assistances/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update service request');
            }

            setRequests(requests.map(r => 
                r._id === id ? data.data : r
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
            const response = await fetch(`/api/assistances/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete service request');
            }

            setRequests(requests.filter(r => r._id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Assigned': 'bg-blue-100 text-blue-800 border-blue-200',
            'In Progress': 'bg-indigo-100 text-indigo-800 border-indigo-200',
            'Resolved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200'
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'Low': 'bg-slate-100 text-slate-700',
            'Medium': 'bg-blue-100 text-blue-700',
            'High': 'bg-orange-100 text-orange-700',
            'Urgent': 'bg-red-100 text-red-700'
        };
        return colors[priority] || 'bg-slate-100 text-slate-700';
    };

    if (loading) {
        return (
            <DashboardLayout title="My Service Requests">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="My Service Requests">
            <div className="space-y-6">
                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                        <div className="text-2xl font-bold text-slate-800">{requests.length}</div>
                        <div className="text-sm text-slate-500">Total Requests</div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                        <div className="text-2xl font-bold text-yellow-700">
                            {requests.filter(r => r.status === 'Pending').length}
                        </div>
                        <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">
                            {requests.filter(r => r.status === 'In Progress').length}
                        </div>
                        <div className="text-sm text-blue-600">In Progress</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <div className="text-2xl font-bold text-emerald-700">
                            {requests.filter(r => r.status === 'Resolved').length}
                        </div>
                        <div className="text-sm text-emerald-600">Resolved</div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {requests.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Service Requests Yet</h3>
                        <p className="text-slate-500 mb-6">You haven't submitted any service requests yet.</p>
                        <button
                            onClick={() => window.location.hash = 'dashboard'}
                            className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((request) => (
                            <div key={request._id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                                {editingId === request._id ? (
                                    // Edit Mode
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Service Request</h3>
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
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Service Type
                                                </label>
                                                <select
                                                    name="assistanceType"
                                                    value={editForm.assistanceType}
                                                    onChange={handleUpdateChange}
                                                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                                                >
                                                    <option value="Technical Support">Technical Support</option>
                                                    <option value="Repair Service">Repair Service</option>
                                                    <option value="Battery Replacement">Battery Replacement</option>
                                                    <option value="Panel Cleaning">Panel Cleaning</option>
                                                    <option value="Emergency Service">Emergency Service</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Problem Description
                                            </label>
                                            <textarea
                                                name="problemDescription"
                                                value={editForm.problemDescription}
                                                onChange={handleUpdateChange}
                                                rows="4"
                                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            />
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => handleUpdate(request._id)}
                                                className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
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
                                                        {request.assistanceType}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                                                        {request.priority}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    Submitted on {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(request)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(request._id)}
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
                                                <p className="text-sm text-slate-800">{request.fullName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Village</p>
                                                <p className="text-sm text-slate-800">{request.village}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Phone</p>
                                                <p className="text-sm text-slate-800">{request.phoneNumber}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs font-semibold text-slate-500 mb-1">Problem Description</p>
                                            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{request.problemDescription}</p>
                                        </div>

                                        {request.assignedTo && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                                <p className="text-xs font-semibold text-blue-700 mb-1">Assigned Technician</p>
                                                <p className="text-sm text-blue-800">{request.assignedTo}</p>
                                            </div>
                                        )}

                                        {request.scheduledDate && (
                                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                                                <p className="text-xs font-semibold text-emerald-700 mb-1">Scheduled Date</p>
                                                <p className="text-sm text-emerald-800">{new Date(request.scheduledDate).toLocaleDateString()}</p>
                                            </div>
                                        )}

                                        {request.resolutionNotes && (
                                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                <p className="text-xs font-semibold text-slate-500 mb-1">Resolution Notes</p>
                                                <p className="text-sm text-slate-700">{request.resolutionNotes}</p>
                                            </div>
                                        )}

                                        {request.image && (
                                            <div className="mt-4">
                                                <p className="text-xs font-semibold text-slate-500 mb-2">Attached Image</p>
                                                <img 
                                                    src={request.image} 
                                                    alt="Service request" 
                                                    className="max-w-xs rounded-lg border border-slate-200"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Delete Confirmation Modal */}
                                {deleteConfirm === request._id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                                            <div className="text-center mb-4">
                                                <div className="text-5xl mb-3">⚠️</div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Service Request?</h3>
                                                <p className="text-slate-600 text-sm">
                                                    This action cannot be undone. The service request will be permanently deleted.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(request._id)}
                                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default ViewServiceRequests;
