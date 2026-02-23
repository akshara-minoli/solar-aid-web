import React, { useState } from 'react';
import api from '../api';

const ServiceRequestsList = ({ requests, onUpdate }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Assigned':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-white/5 text-slate-400 border-white/5';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'High':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-white/5 text-slate-400 border-white/5';
    }
  };

  const handleDelete = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setLoading(true);
      setError(null);
      try {
        await api.delete(`/api/assistances/${requestId}`);
        onUpdate();
      } catch (err) {
        setError('Failed to delete request');
        console.error('Error deleting request:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (requests.length === 0) {
    return (
      <div className="bg-white/5 border border-white/5 rounded-3xl p-16 text-center shadow-xl">
        <span className="text-5xl mb-6 block grayscale opacity-50">🆘</span>
        <p className="text-white font-black uppercase tracking-widest text-xs mb-2 italic">Null Request Terminal</p>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Broadcast a signal to initiate technical assistance.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4">
          Terminal Error: {error}
        </div>
      )}

      {requests.map(request => (
        <div
          key={request._id}
          className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 group"
        >
          {/* Request Header */}
          <div
            onClick={() => setExpandedId(expandedId === request._id ? null : request._id)}
            className="p-6 cursor-pointer relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{request.assistanceType}</h3>
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-medium mb-4 italic truncate max-w-2xl">"{request.problemDescription}"</p>
                <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">📞</span> {request.phoneNumber}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">📍</span> {request.village}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">📅</span> {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button className="text-slate-500 group-hover:text-white transition-colors">
                <span className={`inline-block transition-transform duration-300 ${expandedId === request._id ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === request._id && (
            <div className="border-t border-white/5 bg-white/5 p-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Subject Authorization</p>
                  <p className="text-white font-bold text-xs">{request.fullName}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Comm Signal</p>
                  <p className="text-white font-bold text-xs">{request.phoneNumber}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Deployment Sector</p>
                  <p className="text-white font-bold text-xs">{request.village}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Operation Classification</p>
                  <p className="text-white font-bold text-xs uppercase">{request.assistanceType}</p>
                </div>
              </div>

              <div>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Intel Briefing</p>
                <div className="text-slate-300 text-xs italic bg-white/5 p-5 rounded-2xl border border-white/5 leading-relaxed">
                  "{request.problemDescription}"
                </div>
              </div>

              {request.image && (
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Visual Evidence</p>
                  <div className="relative group/img max-w-sm">
                    <img
                      src={request.image}
                      alt="Problem"
                      className="rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 group-hover/img:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl"></div>
                  </div>
                </div>
              )}

              {request.scheduledDate && (
                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Confirmed Execution Window</p>
                  <p className="text-white font-bold text-xs flex items-center gap-2">
                    <span>📅</span> {new Date(request.scheduledDate).toLocaleDateString()}
                    <span className="text-blue-500">at</span>
                    {new Date(request.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              {request.assignedTechnician && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">👤</div>
                  <div>
                    <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Specialist Assigned</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Active mission tracking enabled</p>
                  </div>
                </div>
              )}

              {request.resolutionNotes && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Resolution Debrief
                  </p>
                  <p className="text-xs text-slate-300 italic">"{request.resolutionNotes}"</p>
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-[8px] font-black uppercase tracking-widest text-slate-600 border-t border-white/5 pt-6">
                <p>Broadcast Time: {new Date(request.createdAt).toLocaleString()}</p>
                <p>Telemetry Update: {new Date(request.updatedAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-4 pt-2">
                {request.status !== 'Resolved' && request.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleDelete(request._id)}
                    disabled={loading}
                    className="flex-1 py-3.5 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {loading ? 'Disabling Signal...' : 'Purge Request'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceRequestsList;
