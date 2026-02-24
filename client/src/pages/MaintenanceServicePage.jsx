import React, { useState, useEffect, useRef } from 'react';
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
  const [technicians, setTechnicians] = useState([]);
  const [leafletReady, setLeafletReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
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
    }
  };

  // Fetch service requests
  const fetchServiceRequests = async () => {
    try {
      const response = await api.get('/api/assistances');
      setServiceRequests(response.data.data || []);
    } catch (err) {
      console.error('Error fetching service requests:', err);
    }
  };

  // Fetch available technicians for map
  const fetchTechnicians = async () => {
    try {
      const response = await api.get('/api/technicians?availability=Available');
      setTechnicians((response.data.data || []).filter(t => t.latitude && t.longitude && t.isActive));
    } catch (err) {
      console.error('Error fetching technicians:', err);
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSchedules(), fetchServiceRequests(), fetchTechnicians()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Load Leaflet CSS + JS
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (window.L) { setLeafletReady(true); return; }
    if (document.getElementById('leaflet-js')) return;
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map when technicians tab is active
  useEffect(() => {
    if (activeTab !== 'technicians' || !leafletReady || !mapRef.current) return;
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }

    const L = window.L;
    const map = L.map(mapRef.current, { center: [7.8731, 80.7718], zoom: 7 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', maxZoom: 18
    }).addTo(map);
    mapInstanceRef.current = map;

    technicians.forEach(tech => {
      const marker = L.circleMarker([tech.latitude, tech.longitude], {
        radius: 12, fillColor: '#10b981', fillOpacity: 0.9, color: '#ffffff', weight: 2
      }).addTo(map);
      marker.bindPopup(`
        <div style="min-width:200px;font-family:system-ui,sans-serif">
          <div style="font-weight:700;font-size:14px;color:#065f46;margin-bottom:4px">🔧 ${tech.fullName}</div>
          <div style="font-size:12px;color:#374151;margin-bottom:4px">📍 ${tech.location}</div>
          <div style="font-size:12px;color:#374151;margin-bottom:6px">⭐ ${tech.rating?.toFixed(1) || '0.0'} • ${tech.experience} yrs experience</div>
          <div style="font-size:11px;color:#6b7280;margin-bottom:4px">${Array.isArray(tech.specialization) ? tech.specialization.join(', ') : tech.specialization}</div>
          <div style="background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;display:inline-block">✅ Available</div>
        </div>
      `, { maxWidth: 240 });
    });

    setTimeout(() => map.invalidateSize(), 100);
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, [activeTab, leafletReady, technicians]);

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
        <div className="bg-white/5 backdrop-blur-md border border-white/5 p-1.5 rounded-2xl inline-flex max-sm:flex overflow-x-auto no-scrollbar">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'technicians', label: 'Find Technicians', icon: '🗺️' },
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
                {tab.id === 'technicians' && technicians.length > 0 && (
                  <span className="bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">{technicians.length}</span>
                )}
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

          {activeTab === 'technicians' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    Geospatial Synchronization
                  </h2>
                  <p className="text-slate-400 text-xs mt-2 italic">🟢 Green nodes represent active field units ready for deployment</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl px-4 py-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  {technicians.length} Nodes Online
                </div>
              </div>

              {/* Map */}
              <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative group" style={{ height: '500px' }}>
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none group-hover:bg-transparent transition-colors duration-700"></div>
                {!leafletReady ? (
                  <div className="h-full flex items-center justify-center bg-transparent">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-2xl border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Booting Map Subsystems...</p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} className="w-full h-full grayscale-[0.5] contrast-[1.2] invert-[0.05] brightness-[0.9]"></div>
                )}
              </div>

              {/* Technician Cards below map */}
              {technicians.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {technicians.map(tech => (
                    <div key={tech._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-1 h-full bg-blue-600/30"></div>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-black text-white uppercase tracking-tight text-base mb-1">{tech.fullName}</h3>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">📍 {tech.location}</p>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] px-2 py-1 rounded-lg font-black uppercase tracking-widest">Active</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                        <span>⭐ {tech.rating?.toFixed(1) || '0.0'} Node Metric</span>
                        <span>{tech.experience} Cycles Exp</span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mb-6">
                        {Array.isArray(tech.specialization) ? tech.specialization.slice(0, 2).join(' • ') : tech.specialization}
                      </div>
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="w-full bg-blue-600/10 border border-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Deploy Unit
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/5 border border-white/5 rounded-3xl p-16 text-center italic">
                  <span className="text-4xl block mb-4 opacity-20 text-blue-500">📡</span>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Awaiting Unit Synchronization</p>
                  <p className="text-slate-600 text-[10px] mt-2 font-bold uppercase tracking-widest">No field assets detected in the current sector</p>
                </div>
              )}
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
