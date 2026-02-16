import React, { useState } from 'react';
import api from '../api';

const RequestServiceModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    village: '',
    phoneNumber: '',
    assistanceType: 'Technical Support',
    problemDescription: '',
    priority: 'Medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const assistanceTypes = [
    'Technical Support',
    'Repair Service',
    'Battery Replacement',
    'Panel Cleaning',
    'Emergency Service',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.fullName || !formData.village || !formData.phoneNumber || !formData.problemDescription) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.problemDescription.length < 10) {
        setError('Problem description must be at least 10 characters');
        setLoading(false);
        return;
      }

      const response = await api.post('/api/assistances', formData);
      
      if (response.data.success) {
        setFormData({
          fullName: '',
          village: '',
          phoneNumber: '',
          assistanceType: 'Technical Support',
          problemDescription: '',
          priority: 'Medium'
        });
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service request');
      console.error('Error submitting service request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Request Service</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              required
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Village/Location *
            </label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="Enter your village or location"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              required
            />
          </div>

          {/* Assistance Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Service Type *
            </label>
            <select
              name="assistanceType"
              value={formData.assistanceType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              required
            >
              {assistanceTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Problem Description *
            </label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              placeholder="Describe the problem in detail (minimum 10 characters)"
              rows="5"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              {formData.problemDescription.length}/10 characters minimum
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestServiceModal;
