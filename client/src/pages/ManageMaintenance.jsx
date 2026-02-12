import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ManageMaintenance = () => {
    const [schedules, setSchedules] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState(null);
    const [validatingAddress, setValidatingAddress] = useState(false);
    const [addressValidated, setAddressValidated] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        serviceAddress: '',
        technicianId: '',
        scheduledDate: '',
        scheduledTime: '',
        serviceType: '',
        priority: 'Medium',
        estimatedDuration: '60',
        notes: ''
    });

    const serviceTypes = [
        'Panel Cleaning',
        'System Inspection',
        'Battery Check',
        'Wiring Repair',
        'Full Maintenance',
        'Emergency Repair',
        'Installation Support'
    ];

    const priorities = ['Low', 'Medium', 'High', 'Urgent'];
    const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'];

    useEffect(() => {
        fetchSchedules();
        fetchTechnicians();
        fetchStats();
    }, []);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/maintenance', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setSchedules(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch maintenance schedules');
        } finally {
            setLoading(false);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/technicians/available', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setTechnicians(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch technicians:', err);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/maintenance/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        }
    };

    // OpenCage API - Validate Address
    const validateAddress = async () => {
        if (!formData.serviceAddress) {
            setError('Please enter an address first');
            return;
        }

        setValidatingAddress(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/maintenance/validate-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address: formData.serviceAddress })
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({
                    ...prev,
                    serviceAddress: data.data.formatted || prev.serviceAddress
                }));
                setAddressValidated(true);
                alert(`✅ Address validated!\n\nFormatted: ${data.data.formatted}\nCoordinates: ${data.data.latitude}, ${data.data.longitude}`);
            } else {
                throw new Error(data.message || 'Address validation failed');
            }
        } catch (err) {
            setError(err.message || 'Failed to validate address');
            setAddressValidated(false);
        } finally {
            setValidatingAddress(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        if (name === 'serviceAddress') {
            setAddressValidated(false);
        }
    };

    const resetForm = () => {
        setFormData({
            customerName: '',
            customerPhone: '',
            serviceAddress: '',
            technicianId: '',
            scheduledDate: '',
            scheduledTime: '',
            serviceType: '',
            priority: 'Medium',
            estimatedDuration: '60',
            notes: ''
        });
        setEditingId(null);
        setShowForm(false);
        setAddressValidated(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = editingId ? `/api/maintenance/${editingId}` : '/api/maintenance';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    estimatedDuration: Number(formData.estimatedDuration)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save maintenance schedule');
            }

            if (editingId) {
                setSchedules(schedules.map(s => 
                    s._id === editingId ? data.data : s
                ));
            } else {
                setSchedules([data.data, ...schedules]);
            }

            resetForm();
            fetchStats();
            fetchTechnicians();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (schedule) => {
        setFormData({
            customerName: schedule.customerName,
            customerPhone: schedule.customerPhone,
            serviceAddress: schedule.serviceAddress,
            technicianId: schedule.technicianId?._id || '',
            scheduledDate: schedule.scheduledDate?.split('T')[0] || '',
            scheduledTime: schedule.scheduledTime,
            serviceType: schedule.serviceType,
            priority: schedule.priority,
            estimatedDuration: schedule.estimatedDuration || '60',
            notes: schedule.notes || ''
        });
        setEditingId(schedule._id);
        setShowForm(true);
        setAddressValidated(true); // Assume previously validated
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/maintenance/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completionStatus: newStatus })
            });

            const data = await response.json();
            if (data.success) {
                setSchedules(schedules.map(s => 
                    s._id === id ? data.data : s
                ));
                fetchStats();
                fetchTechnicians();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/maintenance/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setSchedules(schedules.filter(s => s._id !== id));
            setDeleteConfirm(null);
            fetchStats();
            fetchTechnicians();
        } catch (err) {
            setError(err.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
            'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Completed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Cancelled': 'bg-red-100 text-red-800 border-red-200',
            'Rescheduled': 'bg-purple-100 text-purple-800 border-purple-200'
        };
        return colors[status] || 'bg-slate-100 text-slate-800';
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
            <DashboardLayout title="Maintenance Scheduling">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Maintenance Scheduling">
            <div className="space-y-6">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                            <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                            <div className="text-sm text-slate-500">Total</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="text-2xl font-bold text-blue-700">{stats.scheduled}</div>
                            <div className="text-sm text-blue-600">Scheduled</div>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                            <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
                            <div className="text-sm text-yellow-600">In Progress</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                            <div className="text-2xl font-bold text-emerald-700">{stats.completed}</div>
                            <div className="text-sm text-emerald-600">Completed</div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div className="text-2xl font-bold text-orange-700">{stats.upcoming}</div>
                            <div className="text-sm text-orange-600">Upcoming (7 days)</div>
                        </div>
                    </div>
                )}

                {/* Header with Add Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Maintenance Schedules</h2>
                        <p className="text-slate-500 text-sm">Schedule and track maintenance work</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Schedule Maintenance
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editingId ? 'Edit Maintenance Schedule' : 'Schedule New Maintenance'}
                                </h3>
                                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Customer Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Enter customer name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Customer Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="+94 XX XXX XXXX"
                                        />
                                    </div>
                                </div>

                                {/* Service Address with OpenCage Validation */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Service Address <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="serviceAddress"
                                            value={formData.serviceAddress}
                                            onChange={handleChange}
                                            required
                                            className={`flex-1 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                                                addressValidated ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'
                                            }`}
                                            placeholder="Enter full service address"
                                        />
                                        <button
                                            type="button"
                                            onClick={validateAddress}
                                            disabled={validatingAddress || !formData.serviceAddress}
                                            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {validatingAddress ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Validating...
                                                </>
                                            ) : (
                                                <>
                                                    📍 Validate
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {addressValidated && (
                                        <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                                            ✓ Address validated via OpenCage Geocoding API
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-500 mt-1">
                                        Click "Validate" to verify the address using OpenCage Geocoding API
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Assign Technician
                                        </label>
                                        <select
                                            name="technicianId"
                                            value={formData.technicianId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        >
                                            <option value="">Select technician (optional)</option>
                                            {technicians.map(tech => (
                                                <option key={tech._id} value={tech._id}>
                                                    {tech.name} - {tech.specialization}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Service Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        >
                                            <option value="">Select service type</option>
                                            {serviceTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Scheduled Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="scheduledDate"
                                            value={formData.scheduledDate}
                                            onChange={handleChange}
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Scheduled Time <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="time"
                                            name="scheduledTime"
                                            value={formData.scheduledTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        >
                                            {priorities.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Est. Duration (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            name="estimatedDuration"
                                            value={formData.estimatedDuration}
                                            onChange={handleChange}
                                            min="15"
                                            step="15"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        placeholder="Additional notes or instructions..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : (editingId ? 'Update Schedule' : 'Create Schedule')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Schedules List */}
                {schedules.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Maintenance Scheduled</h3>
                        <p className="text-slate-500 mb-6">Schedule your first maintenance to get started.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700"
                        >
                            Schedule First Maintenance
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div key={schedule._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-slate-800">{schedule.serviceType}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(schedule.completionStatus)}`}>
                                                {schedule.completionStatus}
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(schedule.priority)}`}>
                                                {schedule.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500">
                                            {new Date(schedule.scheduledDate).toLocaleDateString()} at {schedule.scheduledTime} • Est. {schedule.estimatedDuration} mins
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={schedule.completionStatus}
                                            onChange={(e) => handleStatusChange(schedule._id, e.target.value)}
                                            className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            {statuses.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => handleEdit(schedule)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(schedule._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Customer</p>
                                        <p className="text-sm text-slate-800">{schedule.customerName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Phone</p>
                                        <p className="text-sm text-slate-800">{schedule.customerPhone}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Address</p>
                                        <p className="text-sm text-slate-800">{schedule.serviceAddress}</p>
                                        {schedule.addressCoordinates?.latitude && (
                                            <span className="text-xs text-blue-600">
                                                📍 {schedule.addressCoordinates.latitude.toFixed(4)}, {schedule.addressCoordinates.longitude.toFixed(4)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {schedule.technicianId && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-3">
                                        <p className="text-xs font-semibold text-emerald-700 mb-1">Assigned Technician</p>
                                        <p className="text-sm text-emerald-800">
                                            {schedule.technicianId.name} • {schedule.technicianId.phone} • {schedule.technicianId.specialization}
                                        </p>
                                    </div>
                                )}

                                {schedule.notes && (
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <p className="text-xs font-semibold text-slate-500 mb-1">Notes</p>
                                        <p className="text-sm text-slate-600">{schedule.notes}</p>
                                    </div>
                                )}

                                {/* Delete Confirmation */}
                                {deleteConfirm === schedule._id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                                            <div className="text-center mb-4">
                                                <div className="text-5xl mb-3">⚠️</div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Schedule?</h3>
                                                <p className="text-slate-600 text-sm">
                                                    This will permanently delete this maintenance schedule.
                                                </p>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(schedule._id)}
                                                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
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

export default ManageMaintenance;
