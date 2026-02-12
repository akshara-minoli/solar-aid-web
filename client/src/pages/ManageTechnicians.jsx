import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const ManageTechnicians = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        skillLevel: 'Junior',
        availability: 'Available',
        assignedArea: '',
        experienceYears: ''
    });

    const specializations = [
        'Panel Installation',
        'Battery Maintenance',
        'Electrical Wiring',
        'System Inspection',
        'General Maintenance'
    ];

    const skillLevels = ['Junior', 'Mid-Level', 'Senior', 'Expert'];
    const availabilityOptions = ['Available', 'Busy', 'On Leave'];

    useEffect(() => {
        fetchTechnicians();
        fetchStats();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/technicians', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setTechnicians(data.data);
            } else {
                throw new Error(data.message);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch technicians');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/technicians/stats', {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            specialization: '',
            skillLevel: 'Junior',
            availability: 'Available',
            assignedArea: '',
            experienceYears: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const url = editingId ? `/api/technicians/${editingId}` : '/api/technicians';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    experienceYears: formData.experienceYears ? Number(formData.experienceYears) : 0
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save technician');
            }

            if (editingId) {
                setTechnicians(technicians.map(t => 
                    t._id === editingId ? data.data : t
                ));
            } else {
                setTechnicians([data.data, ...technicians]);
            }

            resetForm();
            fetchStats();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (technician) => {
        setFormData({
            name: technician.name,
            email: technician.email,
            phone: technician.phone,
            specialization: technician.specialization,
            skillLevel: technician.skillLevel,
            availability: technician.availability,
            assignedArea: technician.assignedArea || '',
            experienceYears: technician.experienceYears || ''
        });
        setEditingId(technician._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/technicians/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }

            setTechnicians(technicians.filter(t => t._id !== id));
            setDeleteConfirm(null);
            fetchStats();
        } catch (err) {
            setError(err.message);
        }
    };

    const getAvailabilityColor = (availability) => {
        const colors = {
            'Available': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Busy': 'bg-orange-100 text-orange-800 border-orange-200',
            'On Leave': 'bg-slate-100 text-slate-800 border-slate-200'
        };
        return colors[availability] || 'bg-slate-100 text-slate-800';
    };

    const getSkillColor = (skill) => {
        const colors = {
            'Junior': 'bg-blue-100 text-blue-700',
            'Mid-Level': 'bg-indigo-100 text-indigo-700',
            'Senior': 'bg-purple-100 text-purple-700',
            'Expert': 'bg-amber-100 text-amber-700'
        };
        return colors[skill] || 'bg-slate-100 text-slate-700';
    };

    if (loading) {
        return (
            <DashboardLayout title="Technician Management">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Technician Management">
            <div className="space-y-6">
                {/* Statistics Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">👷</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                                    <div className="text-sm text-slate-500">Total Technicians</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">✅</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-emerald-700">{stats.available}</div>
                                    <div className="text-sm text-emerald-600">Available</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🔧</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-orange-700">{stats.busy}</div>
                                    <div className="text-sm text-orange-600">Busy</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                                    <span className="text-xl">🏖️</span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-slate-700">{stats.onLeave}</div>
                                    <div className="text-sm text-slate-500">On Leave</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header with Add Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Technicians</h2>
                        <p className="text-slate-500 text-sm">Manage your service technicians</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <span>+</span> Add Technician
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
                        <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editingId ? 'Edit Technician' : 'Add New Technician'}
                                </h3>
                                <button
                                    onClick={resetForm}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Enter technician name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="technician@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="+94 XX XXX XXXX"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Specialization <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="specialization"
                                            value={formData.specialization}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        >
                                            <option value="">Select specialization</option>
                                            {specializations.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Skill Level
                                        </label>
                                        <select
                                            name="skillLevel"
                                            value={formData.skillLevel}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        >
                                            {skillLevels.map(level => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Availability
                                        </label>
                                        <select
                                            name="availability"
                                            value={formData.availability}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                        >
                                            {availabilityOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Assigned Area
                                        </label>
                                        <input
                                            type="text"
                                            name="assignedArea"
                                            value={formData.assignedArea}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="e.g. Colombo District"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Experience (Years)
                                        </label>
                                        <input
                                            type="number"
                                            name="experienceYears"
                                            value={formData.experienceYears}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : (editingId ? 'Update Technician' : 'Add Technician')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Technicians List */}
                {technicians.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                        <div className="text-6xl mb-4">👷</div>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">No Technicians Yet</h3>
                        <p className="text-slate-500 mb-6">Add your first technician to get started.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Add First Technician
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {technicians.map((tech) => (
                            <div key={tech._id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-lg">
                                            {tech.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{tech.name}</h4>
                                            <p className="text-xs text-slate-500">{tech.specialization}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(tech.availability)}`}>
                                        {tech.availability}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span>📧</span> {tech.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span>📱</span> {tech.phone}
                                    </div>
                                    {tech.assignedArea && (
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span>📍</span> {tech.assignedArea}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSkillColor(tech.skillLevel)}`}>
                                        {tech.skillLevel}
                                    </span>
                                    {tech.experienceYears > 0 && (
                                        <span className="text-xs text-slate-500">
                                            {tech.experienceYears} yrs exp
                                        </span>
                                    )}
                                    {tech.completedJobs > 0 && (
                                        <span className="text-xs text-slate-500">
                                            {tech.completedJobs} jobs
                                        </span>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => handleEdit(tech)}
                                        className="flex-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(tech._id)}
                                        className="flex-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>

                                {/* Delete Confirmation */}
                                {deleteConfirm === tech._id && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                                            <div className="text-center mb-4">
                                                <div className="text-5xl mb-3">⚠️</div>
                                                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Technician?</h3>
                                                <p className="text-slate-600 text-sm">
                                                    Are you sure you want to delete <strong>{tech.name}</strong>? This cannot be undone.
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
                                                    onClick={() => handleDelete(tech._id)}
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

export default ManageTechnicians;
