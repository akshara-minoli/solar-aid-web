import React, { useState } from 'react';
import api from '../api';

const RequestServiceModal = ({ onClose, onSuccess, selectedTechnician }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    village: '',
    phoneNumber: '',
    assistanceType: 'Technical Support',
    problemDescription: '',
    priority: 'Medium',
    preferredTechnician: selectedTechnician ? selectedTechnician._id : null
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
          priority: 'Medium',
          preferredTechnician: null
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
      <div className="bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
        {/* Header */}
        <div className="sticky top-0 bg-white/5 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Request Service</h2>
            {selectedTechnician && (
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">
                Preferred: {selectedTechnician.fullName} ({selectedTechnician.location})
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 animate-in slide-in-from-top-2 duration-300">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
              required
            />
          </div>

          {/* Village */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Village/Location *
            </label>
            <input
              type="text"
              name="village"
              value={formData.village}
              onChange={handleChange}
              placeholder="Enter your village or location"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
              required
            />
          </div>

          {/* Assistance Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Service Type *
            </label>
            <select
              name="assistanceType"
              value={formData.assistanceType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
              required
            >
              {assistanceTypes.map(type => (
                <option key={type} value={type} className="bg-[#111827] text-white">{type}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium appearance-none"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority} className="bg-[#111827] text-white">{priority}</option>
              ))}
            </select>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Problem Description *
            </label>
            <textarea
              name="problemDescription"
              value={formData.problemDescription}
              onChange={handleChange}
              placeholder="Describe the problem in detail (minimum 10 characters)"
              rows="5"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium resize-none text-sm"
              required
            />
            <p className="text-[10px] text-slate-500 mt-2 ml-1 font-bold">
              {formData.problemDescription.length}/10 characters minimum
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-all uppercase text-xs tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 tracking-wide uppercase text-xs"
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
