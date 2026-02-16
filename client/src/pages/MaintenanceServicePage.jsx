import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import RequestServiceModal from '../components/RequestServiceModal';
import MaintenanceScheduleList from '../components/MaintenanceScheduleList';
import ServiceRequestsList from '../components/ServiceRequestsList';
import MaintenanceStats from '../components/MaintenanceStats';
import api from '../api';

const MaintenanceServicePage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSchedules: 0,
    completedServices: 0,
    upcomingServices: 0,
    pendingRequests: 0
  });

  // Fetch maintenance schedules
  const fetchSchedules = async () => {
    try {
      const response = await api.get('/api/maintenance-schedules');
      setSchedules(response.data.data || []);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load maintenance schedules');
    }
  };

  // Fetch service requests (assistance)
  const fetchServiceRequests = async () => {
    try {
      const response = await api.get('/api/assistances');
      setServiceRequests(response.data.data || []);
    } catch (err) {
      console.error('Error fetching service requests:', err);
      setError('Failed to load service requests');
    }
  };

  // Calculate statistics
  const calculateStats = (schedules, requests) => {
    const completed = schedules.filter(s => s.status === 'Completed').length;
    const upcoming = schedules.filter(s => 
      s.status === 'Scheduled' && new Date(s.scheduledDate) > new Date()
    ).length;
    const pending = requests.filter(r => r.status === 'Pending').length;

    setStats({
      totalSchedules: schedules.length,
      completedServices: completed,
      upcomingServices: upcoming,
      pendingRequests: pending
    });
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSchedules(), fetchServiceRequests()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Update stats when data changes
  useEffect(() => {
    calculateStats(schedules, serviceRequests);
  }, [schedules, serviceRequests]);

  // Handle new service request
  const handleServiceRequestCreated = async () => {
    setShowRequestModal(false);
    await fetchServiceRequests();
  };

  // Handle schedule update
  const handleScheduleUpdated = async () => {
    await fetchSchedules();
  };

  if (loading) {
    return (
      <DashboardLayout title="Maintenance & Service">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading maintenance data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Maintenance & Service">
      <div className="space-y-8 animate-in fade-in duration-700">
        
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 rounded-xl shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Maintenance & Service</h1>
            <p className="text-white/90 text-base leading-relaxed">
              Welcome to the Maintenance & Service section. Here you will be able to request service, view your maintenance schedule, and track technician visits.
            </p>
          </div>
          <div className="absolute top-0 right-0 opacity-10">
            <span className="text-8xl">🔧</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <MaintenanceStats stats={stats} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="text-xl">+</span>
            Request Service
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <span className="text-xl">📅</span>
            View Schedule
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'schedules'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Maintenance Schedule
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
              activeTab === 'requests'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Service Requests
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Upcoming Services */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Services</h2>
                {schedules.filter(s => s.status === 'Scheduled' && new Date(s.scheduledDate) > new Date()).length > 0 ? (
                  <div className="grid gap-4">
                    {schedules
                      .filter(s => s.status === 'Scheduled' && new Date(s.scheduledDate) > new Date())
                      .slice(0, 3)
                      .map(schedule => (
                        <div key={schedule._id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold text-slate-800">{schedule.serviceType}</h3>
                              <p className="text-sm text-slate-600">{schedule.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              schedule.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                              schedule.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                              schedule.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {schedule.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span>📅 {new Date(schedule.scheduledDate).toLocaleDateString()}</span>
                            <span>⏱️ {schedule.estimatedDuration}h</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-600">No upcoming services scheduled</p>
                  </div>
                )}
              </div>

              {/* Recent Service Requests */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Service Requests</h2>
                {serviceRequests.length > 0 ? (
                  <div className="grid gap-4">
                    {serviceRequests.slice(0, 3).map(request => (
                      <div key={request._id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800">{request.assistanceType}</h3>
                            <p className="text-sm text-slate-600">{request.problemDescription}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            request.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            request.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                            request.status === 'In Progress' ? 'bg-purple-100 text-purple-700' :
                            request.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>📞 {request.phoneNumber}</span>
                          <span>📍 {request.village}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-600">No service requests yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <MaintenanceScheduleList 
              schedules={schedules} 
              onUpdate={handleScheduleUpdated}
            />
          )}

          {activeTab === 'requests' && (
            <ServiceRequestsList 
              requests={serviceRequests}
              onUpdate={handleServiceRequestCreated}
            />
          )}
        </div>

        {/* Request Service Modal */}
        {showRequestModal && (
          <RequestServiceModal
            onClose={() => setShowRequestModal(false)}
            onSuccess={handleServiceRequestCreated}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceServicePage;
