import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MaintenanceScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    assistanceId: '',
    technicianId: '',
    userId: '',
    serviceType: 'Routine Maintenance',
    description: '',
    scheduledDate: '',
    estimatedDuration: 2,
    priority: 'Medium'
  });

  const [assistances, setAssistances] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  const serviceTypes = [
    'Routine Maintenance',
    'Panel Cleaning',
    'Battery Check',
    'Inverter Inspection',
    'Wiring Check',
    'Complete System Check',
    'Repair Service',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'];

  // Fetch schedules
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/maintenance-schedules`;
      const params = new URLSearchParams();

      if (filterStatus) params.append('status', filterStatus);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSchedules(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching schedules');
    } finally {
      setLoading(false);
    }
  };

  // Fetch technicians
  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(`${API_URL}/technicians`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTechnicians(response.data.data);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  // Fetch service requests (assistances)
  const fetchAssistances = async () => {
    try {
      const response = await axios.get(`${API_URL}/assistances/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssistances(response.data.data);
    } catch (err) {
      console.error('Error fetching assistances:', err);
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTechnicians();
    fetchAssistances();
  }, [filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedDuration' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.assistanceId) {
      setError('Please select a service request');
      return;
    }
    if (!formData.technicianId) {
      setError('Please select a technician');
      return;
    }
    
    try {
      if (editingId) {
        // Update schedule
        await axios.put(
          `${API_URL}/maintenance-schedules/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setError('');
      } else {
        // Create new schedule with real assistance ID
        const selectedAssistance = assistances.find(a => a._id === formData.assistanceId);
        if (!selectedAssistance) {
          setError('Selected service request not found');
          return;
        }

        await axios.post(
          `${API_URL}/maintenance-schedules`,
          {
            ...formData,
            userId: selectedAssistance.userId
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setError('');
      }
      resetForm();
      fetchSchedules();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving schedule');
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      technicianId: schedule.technicianId._id,
      serviceType: schedule.serviceType,
      description: schedule.description,
      scheduledDate: schedule.scheduledDate.split('T')[0],
      estimatedDuration: schedule.estimatedDuration,
      priority: schedule.priority
    });
    setEditingId(schedule._id);
    setShowForm(true);
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(
        `${API_URL}/maintenance-schedules/${id}/complete`,
        { completionNotes: 'Maintenance completed successfully' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSchedules();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error completing schedule');
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `${API_URL}/maintenance-schedules/${id}/cancel`,
        { reason: 'Cancelled by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSchedules();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error cancelling schedule');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      await axios.delete(
        `${API_URL}/maintenance-schedules/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSchedules();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting schedule');
    }
  };

  const resetForm = () => {
    setFormData({
      technicianId: '',
      serviceType: 'Routine Maintenance',
      description: '',
      scheduledDate: '',
      estimatedDuration: 2,
      priority: 'Medium'
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Maintenance Schedule Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Schedule Maintenance
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Schedule' : 'Create New Maintenance Schedule'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Request *
                </label>
                <select
                  name="assistanceId"
                  value={formData.assistanceId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Service Request</option>
                  {assistances.map(assistance => (
                    <option key={assistance._id} value={assistance._id}>
                      {assistance.assistanceType} - {assistance.fullName} ({assistance.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technician *
                </label>
                <select
                  name="technicianId"
                  value={formData.technicianId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech._id} value={tech._id}>
                      {tech.fullName} - {tech.location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {serviceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  minLength="10"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the maintenance work..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date *
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleInputChange}
                  min="0.5"
                  step="0.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  {editingId ? 'Update' : 'Schedule'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Schedules List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading schedules...</p>
          </div>
        ) : schedules.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No schedules found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.map(schedule => (
                  <tr key={schedule._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {schedule.technicianId?.fullName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {schedule.serviceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(schedule.scheduledDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        schedule.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : schedule.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : schedule.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded ${
                        schedule.priority === 'Urgent'
                          ? 'bg-red-100 text-red-700'
                          : schedule.priority === 'High'
                          ? 'bg-orange-100 text-orange-700'
                          : schedule.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {schedule.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded"
                      >
                        Edit
                      </button>
                      {schedule.status !== 'Completed' && (
                        <button
                          onClick={() => handleComplete(schedule._id)}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded"
                        >
                          Complete
                        </button>
                      )}
                      {schedule.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancel(schedule._id)}
                          className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(schedule._id)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceScheduleManagement;
