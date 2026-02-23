import React, { useState } from 'react';
import api from '../api';

const MaintenanceScheduleList = ({ schedules, onUpdate }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Progress':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Cancelled':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Rescheduled':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
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

  const handleConfirm = async (scheduleId) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/api/maintenance-schedules/${scheduleId}/confirm`);
      onUpdate();
    } catch (err) {
      setError('Failed to confirm schedule');
      console.error('Error confirming schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (scheduleId) => {
    if (window.confirm('Are you sure you want to cancel this schedule?')) {
      setLoading(true);
      setError(null);
      try {
        await api.put(`/api/maintenance-schedules/${scheduleId}/cancel`);
        onUpdate();
      } catch (err) {
        setError('Failed to cancel schedule');
        console.error('Error cancelling schedule:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (schedules.length === 0) {
    return (
      <div className="bg-white/5 border border-white/5 rounded-3xl p-16 text-center shadow-xl">
        <span className="text-5xl mb-6 block grayscale opacity-50">📅</span>
        <p className="text-white font-black uppercase tracking-widest text-xs mb-2 italic">Null Deployment Stream</p>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Initialize a service protocol to populate the registry.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4">
          Status: {error}
        </div>
      )}

      {schedules.map(schedule => (
        <div
          key={schedule._id}
          className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 group"
        >
          {/* Schedule Header */}
          <div
            onClick={() => setExpandedId(expandedId === schedule._id ? null : schedule._id)}
            className="p-6 cursor-pointer relative"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-lg font-black text-white uppercase tracking-tight">{schedule.serviceType}</h3>
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority}
                  </span>
                </div>
                <p className="text-slate-400 text-xs font-medium mb-4 italic">"{schedule.description}"</p>
                <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2">
                    <span className="text-blue-500">📅</span> {new Date(schedule.scheduledDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-blue-500">🕐</span> {new Date(schedule.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-blue-500">⏱️</span> {schedule.estimatedDuration}H Windows
                  </span>
                </div>
              </div>
              <button className="text-slate-500 group-hover:text-white transition-colors">
                <span className={`inline-block transition-transform duration-300 ${expandedId === schedule._id ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === schedule._id && (
            <div className="border-t border-white/5 bg-white/5 p-8 space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Target Infrastructure</p>
                  <p className="text-white font-bold text-xs">{schedule.householdId ? 'Verified Household Link' : 'No hardware association'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Operational Specialist</p>
                  <p className="text-white font-bold text-xs">{schedule.technicianId ? 'Specialist Dispatched' : 'Pending Allocation'}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">User Validation</p>
                  <p className="text-xs">
                    {schedule.userConfirmed ? (
                      <span className="text-emerald-400 font-black uppercase tracking-widest">✓ Synchronized</span>
                    ) : (
                      <span className="text-orange-400 font-black uppercase tracking-widest">✗ Pending Response</span>
                    )}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Technical Confirmation</p>
                  <p className="text-xs">
                    {schedule.technicianConfirmed ? (
                      <span className="text-emerald-400 font-black uppercase tracking-widest">✓ Operational Confirmed</span>
                    ) : (
                      <span className="text-orange-400 font-black uppercase tracking-widest">✗ Awaiting Specialist</span>
                    )}
                  </p>
                </div>
              </div>

              {schedule.notes && (
                <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Mission Notes</p>
                  <p className="text-slate-300 text-xs italic">"{schedule.notes}"</p>
                </div>
              )}

              {schedule.status === 'Completed' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                  <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Service Complete
                  </p>
                  {schedule.completionDate && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                      Archived: {new Date(schedule.completionDate).toLocaleDateString()}
                    </p>
                  )}
                  {schedule.completionNotes && (
                    <p className="text-xs text-slate-400 mt-2 italic">Response: {schedule.completionNotes}</p>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-4 border-t border-white/5">
                {schedule.status === 'Scheduled' && !schedule.userConfirmed && (
                  <button
                    onClick={() => handleConfirm(schedule._id)}
                    disabled={loading}
                    className="flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                  >
                    {loading ? 'Processing...' : 'Sync Schedule'}
                  </button>
                )}
                {schedule.status !== 'Completed' && schedule.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancel(schedule._id)}
                    disabled={loading}
                    className="flex-1 px-6 py-3.5 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50"
                  >
                    {loading ? 'Aborting...' : 'Abort Request'}
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

export default MaintenanceScheduleList;
