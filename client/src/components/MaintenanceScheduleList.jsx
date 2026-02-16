import React, { useState } from 'react';
import api from '../api';

const MaintenanceScheduleList = ({ schedules, onUpdate }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Rescheduled':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-700';
      case 'High':
        return 'bg-orange-100 text-orange-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
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
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
        <span className="text-5xl mb-4 block">📅</span>
        <p className="text-slate-600 text-lg">No maintenance schedules yet</p>
        <p className="text-slate-500 text-sm mt-2">Request a service to create a maintenance schedule</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {schedules.map(schedule => (
        <div
          key={schedule._id}
          className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Schedule Header */}
          <div
            onClick={() => setExpandedId(expandedId === schedule._id ? null : schedule._id)}
            className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{schedule.serviceType}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(schedule.status)}`}>
                    {schedule.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(schedule.priority)}`}>
                    {schedule.priority}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3">{schedule.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>📅 {new Date(schedule.scheduledDate).toLocaleDateString()}</span>
                  <span>🕐 {new Date(schedule.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>⏱️ {schedule.estimatedDuration}h</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                {expandedId === schedule._id ? '▼' : '▶'}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === schedule._id && (
            <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Household</p>
                  <p className="text-slate-800">{schedule.householdId ? 'Linked Household' : 'No household linked'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Technician</p>
                  <p className="text-slate-800">{schedule.technicianId ? 'Assigned' : 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">User Confirmed</p>
                  <p className="text-slate-800">
                    {schedule.userConfirmed ? (
                      <span className="text-green-600">✓ Yes</span>
                    ) : (
                      <span className="text-orange-600">✗ No</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Technician Confirmed</p>
                  <p className="text-slate-800">
                    {schedule.technicianConfirmed ? (
                      <span className="text-green-600">✓ Yes</span>
                    ) : (
                      <span className="text-orange-600">✗ No</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {schedule.notes && (
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Notes</p>
                  <p className="text-slate-800 bg-white p-3 rounded border border-slate-200">{schedule.notes}</p>
                </div>
              )}

              {/* Completion Details */}
              {schedule.status === 'Completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-semibold mb-2">✓ Service Completed</p>
                  {schedule.completionDate && (
                    <p className="text-sm text-green-600">
                      Completed on: {new Date(schedule.completionDate).toLocaleDateString()}
                    </p>
                  )}
                  {schedule.completionNotes && (
                    <p className="text-sm text-green-600 mt-2">Notes: {schedule.completionNotes}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {schedule.status === 'Scheduled' && !schedule.userConfirmed && (
                  <button
                    onClick={() => handleConfirm(schedule._id)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Confirming...' : 'Confirm Schedule'}
                  </button>
                )}
                {schedule.status !== 'Completed' && schedule.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancel(schedule._id)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Cancelling...' : 'Cancel Schedule'}
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
