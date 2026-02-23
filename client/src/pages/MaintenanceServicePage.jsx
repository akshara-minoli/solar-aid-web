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
      <div className="space-y-10 animate-in fade-in duration-700">

        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-2xl group">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-4">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-4xl">🔧</div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">Service Control Center</h1>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Infrastructure Maintenance & Deployment</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-2xl italic font-medium">
              Monitor and manage your solar array's operational integrity. Initiate service protocols, track technician synchronization, and review historical performance data.
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-3xl shadow-xl">
          <MaintenanceStats stats={stats} />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-5">
          <button
            onClick={() => setShowRequestModal(true)}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black transition-all shadow-2xl shadow-blue-600/20 uppercase text-xs tracking-[0.2em] group"
          >
            <span className="text-lg group-hover:rotate-90 transition-transform">+</span>
            Service Request
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-black transition-all shadow-xl uppercase text-xs tracking-[0.2em]"
          >
            <span>📅</span>
            Maintenance Schedule
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-1.5 rounded-2xl inline-flex max-sm:flex">
          <div className="flex overflow-x-auto no-scrollbar gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'schedules', label: 'Maintenance Schedule', icon: '📅' },
              { id: 'requests', label: 'Service Requests', icon: '📩' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-black transition-all flex items-center gap-3 text-[10px] uppercase tracking-widest whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
              {/* Upcoming Services */}
              <div className="space-y-6">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  Scheduled Interventions
                </h2>
                {schedules.filter(s => s.status === 'Scheduled' && new Date(s.scheduledDate) > new Date()).length > 0 ? (
                  <div className="grid gap-4">
                    {schedules
                      .filter(s => s.status === 'Scheduled' && new Date(s.scheduledDate) > new Date())
                      .slice(0, 3)
                      .map(schedule => (
                        <div key={schedule._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-1 h-full bg-blue-600/30"></div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-black text-white uppercase tracking-tight text-base mb-1">{schedule.serviceType}</h3>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{schedule.description}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${schedule.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              schedule.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                              {schedule.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2">
                              <span className="text-blue-500">📅</span> {new Date(schedule.scheduledDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <span className="text-blue-500">⏱️</span> {schedule.estimatedDuration}H Windows
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center italic">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No Active Schedules Detected</p>
                  </div>
                )}
              </div>

              {/* Recent Service Requests */}
              <div className="space-y-6">
                <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Active Requests Stream
                </h2>
                {serviceRequests.length > 0 ? (
                  <div className="grid gap-4">
                    {serviceRequests.slice(0, 3).map(request => (
                      <div key={request._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-600/30"></div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black text-white uppercase tracking-tight text-base mb-1">{request.assistanceType}</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed line-clamp-1">{request.problemDescription}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${request.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            request.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              request.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                'bg-white/5 text-slate-500 border-white/10'
                            }`}>
                            {request.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span className="flex items-center gap-2">
                            <span className="text-emerald-500">📞</span> {request.phoneNumber}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="text-emerald-500">📍</span> {request.village}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center italic">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Signal Terminal: No Pending Data</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="animate-in fade-in duration-500">
              <MaintenanceScheduleList
                schedules={schedules}
                onUpdate={handleScheduleUpdated}
              />
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="animate-in fade-in duration-500">
              <ServiceRequestsList
                requests={serviceRequests}
                onUpdate={handleServiceRequestCreated}
              />
            </div>
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
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 text-rose-400 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
            Sync Error: {error}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceServicePage;
