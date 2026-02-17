import React, { useState } from 'react';
import api from '../api';

const ServiceRequestsList = ({ requests, onUpdate }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Assigned':
        return 'bg-blue-100 text-blue-700';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
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
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
        <span className="text-5xl mb-4 block">🆘</span>
        <p className="text-slate-600 text-lg">No service requests yet</p>
        <p className="text-slate-500 text-sm mt-2">Click "Request Service" to create a new service request</p>
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

      {requests.map(request => (
        <div
          key={request._id}
          className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Request Header */}
          <div
            onClick={() => setExpandedId(expandedId === request._id ? null : request._id)}
            className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-slate-800">{request.assistanceType}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{request.problemDescription}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>📞 {request.phoneNumber}</span>
                  <span>📍 {request.village}</span>
                  <span>📅 {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                {expandedId === request._id ? '▼' : '▶'}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === request._id && (
            <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
              {/* Full Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Full Name</p>
                  <p className="text-slate-800">{request.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Phone Number</p>
                  <p className="text-slate-800">{request.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Village</p>
                  <p className="text-slate-800">{request.village}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Assistance Type</p>
                  <p className="text-slate-800">{request.assistanceType}</p>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <p className="text-sm text-slate-600 font-semibold mb-1">Problem Description</p>
                <p className="text-slate-800 bg-white p-3 rounded border border-slate-200">
                  {request.problemDescription}
                </p>
              </div>

              {/* Image if available */}
              {request.image && (
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-2">Attached Image</p>
                  <img
                    src={request.image}
                    alt="Problem"
                    className="max-w-xs rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {/* Scheduled Date */}
              {request.scheduledDate && (
                <div>
                  <p className="text-sm text-slate-600 font-semibold mb-1">Scheduled Date</p>
                  <p className="text-slate-800">
                    {new Date(request.scheduledDate).toLocaleDateString()} at{' '}
                    {new Date(request.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              {/* Assigned Technician */}
              {request.assignedTechnician && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700 font-semibold mb-1">✓ Technician Assigned</p>
                  <p className="text-sm text-blue-600">A technician has been assigned to handle your request</p>
                </div>
              )}

              {/* Resolution Notes */}
              {request.resolutionNotes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 font-semibold mb-2">✓ Resolution Notes</p>
                  <p className="text-sm text-green-600">{request.resolutionNotes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-200">
                <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
                <p>Last Updated: {new Date(request.updatedAt).toLocaleString()}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {request.status !== 'Resolved' && request.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleDelete(request._id)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Deleting...' : 'Delete Request'}
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
