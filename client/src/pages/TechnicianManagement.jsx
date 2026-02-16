import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: ['General Maintenance'],
    experience: 0,
    certification: '',
    location: ''
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // Fetch technicians
  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/technicians`;
      const params = new URLSearchParams();

      if (filterAvailability) params.append('availability', filterAvailability);
      if (filterSpecialization) params.append('specialization', filterSpecialization);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTechnicians(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();
  }, [filterAvailability, filterSpecialization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSpecializationChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      specialization: checked
        ? [...prev.specialization, value]
        : prev.specialization.filter(s => s !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update technician
        await axios.put(
          `${API_URL}/technicians/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setError('');
      } else {
        // Create technician
        await axios.post(
          `${API_URL}/technicians`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      resetForm();
      fetchTechnicians();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving technician');
    }
  };

  const handleEdit = (technician) => {
    setFormData({
      fullName: technician.fullName,
      email: technician.email,
      phone: technician.phone,
      specialization: technician.specialization,
      experience: technician.experience,
      certification: technician.certification,
      location: technician.location
    });
    setEditingId(technician._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technician?')) return;

    try {
      await axios.delete(
        `${API_URL}/technicians/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTechnicians();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting technician');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.put(
        `${API_URL}/technicians/${id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTechnicians();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deactivating technician');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      specialization: ['General Maintenance'],
      experience: 0,
      certification: '',
      location: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const specializations = [
    'Solar Panel Installation',
    'Battery Replacement',
    'Inverter Repair',
    'Wiring & Maintenance',
    'Panel Cleaning',
    'General Maintenance'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Technician Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Add Technician
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
              {editingId ? 'Edit Technician' : 'Add New Technician'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification
                </label>
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleInputChange}
                  placeholder="e.g., Solar PV Certification"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Area / District
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specialization
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {specializations.map(spec => (
                    <div key={spec} className="flex items-center">
                      <input
                        type="checkbox"
                        id={spec}
                        value={spec}
                        checked={formData.specialization.includes(spec)}
                        onChange={handleSpecializationChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor={spec} className="ml-2 text-sm text-gray-700">
                        {spec}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                >
                  {editingId ? 'Update' : 'Create'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                value={filterAvailability}
                onChange={(e) => setFilterAvailability(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">All</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Technicians List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading technicians...</p>
          </div>
        ) : technicians.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">No technicians found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {technicians.map(technician => (
                  <tr key={technician._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {technician.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {technician.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {technician.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {technician.experience} years
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        technician.availability === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : technician.availability === 'Busy'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {technician.availability}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ⭐ {technician.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(technician)}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeactivate(technician._id)}
                        disabled={!technician.isActive}
                        className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded disabled:opacity-50"
                      >
                        {technician.isActive ? 'Deactivate' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDelete(technician._id)}
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

export default TechnicianManagement;
