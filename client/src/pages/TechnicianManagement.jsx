import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminProfileMenu from '../components/AdminProfileMenu';

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterAvailability, setFilterAvailability] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [leafletReady, setLeafletReady] = useState(false);

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '',
    specialization: ['General Maintenance'],
    experience: 0, certification: '', location: '',
    latitude: null, longitude: null
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('token');

  // ── Load Leaflet CSS + JS from CDN (OpenStreetMap - 100% free, no billing) ──
  useEffect(() => {
    // Add Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Add Leaflet JS
    if (window.L) { setLeafletReady(true); return; }
    if (document.getElementById('leaflet-js')) return;

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  // ── Initialize Leaflet Map ──
  useEffect(() => {
    if (activeTab !== 'map' || !leafletReady || !mapRef.current) return;

    // Destroy existing map instance before re-creating
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [7.8731, 80.7718], // Sri Lanka center
      zoom: 7,
      zoomControl: true,
    });

    // OpenStreetMap tile layer (free, no API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add markers for all technicians with coordinates
    markersRef.current = [];
    technicians.forEach(tech => {
      if (!tech.latitude || !tech.longitude) return;

      const availColor = tech.isActive
        ? (tech.availability === 'Available' ? '#10b981' : tech.availability === 'Busy' ? '#f59e0b' : '#f43f5e')
        : '#64748b';

      const availLabel = !tech.isActive ? 'Disabled' : tech.availability;

      // Custom colored circle marker
      const marker = L.circleMarker([tech.latitude, tech.longitude], {
        radius: 12,
        fillColor: availColor,
        fillOpacity: 0.9,
        color: '#ffffff',
        weight: 2,
      }).addTo(map);

      // Popup with technician info
      marker.bindPopup(`
        <div style="min-width:180px;font-family:system-ui,sans-serif">
          <div style="font-weight:700;font-size:14px;margin-bottom:3px;color:#1e293b">${tech.fullName}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:6px">📍 ${tech.location}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:5px">
            <span style="background:${availColor}22;color:${availColor};padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;border:1px solid ${availColor}44">${availLabel}</span>
          </div>
          <div style="font-size:11px;color:#475569">⭐ ${tech.rating?.toFixed(1) || '0.0'} • ${tech.experience} yrs exp</div>
          <div style="font-size:11px;color:#64748b;margin-top:3px">📞 ${tech.phone}</div>
        </div>
      `, { maxWidth: 220 });

      markersRef.current.push(marker);
    });

    // Fix map size on tab switch
    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeTab, leafletReady, technicians]);

  const fetchTechnicians = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/technicians`;
      const params = new URLSearchParams();
      if (filterAvailability) params.append('availability', filterAvailability);
      if (filterSpecialization) params.append('specialization', filterSpecialization);
      if (params.toString()) url += `?${params.toString()}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setTechnicians(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTechnicians(); }, [filterAvailability, filterSpecialization]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        await axios.put(`${API_URL}/technicians/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/technicians`, formData, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetForm();
      fetchTechnicians();
      setError('');
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
      location: technician.location,
      latitude: technician.latitude || null,
      longitude: technician.longitude || null
    });
    setEditingId(technician._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technician?')) return;
    try {
      await axios.delete(`${API_URL}/technicians/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchTechnicians();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting technician');
    }
  };

  const handleToggleActivation = async (tech) => {
    try {
      await axios.put(`${API_URL}/technicians/${tech._id}/toggle-activation`, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchTechnicians();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || `Error ${tech.isActive ? 'deactivating' : 'activating'} technician`);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', phone: '', specialization: ['General Maintenance'], experience: 0, certification: '', location: '', latitude: null, longitude: null });
    setEditingId(null);
    setShowForm(false);
  };

  const specializations = [
    'Solar Panel Installation', 'Battery Replacement', 'Inverter Repair',
    'Wiring & Maintenance', 'Panel Cleaning', 'General Maintenance'
  ];

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors";
  const techsWithCoords = technicians.filter(t => t.latitude && t.longitude).length;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Technician Management</h1>
              <p className="text-slate-400 text-sm mt-1">Manage field engineers and track their locations on map</p>
            </div>
            {!showForm && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
                <span>➕</span> Add Technician
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-8 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-white pb-4 border-b border-white/10">
                {editingId ? 'Edit Technician' : 'Add New Technician'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className={inputClass} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClass} placeholder="john@solaraid.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className={inputClass} placeholder="0771234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Experience (years)</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} min="0" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Certification</label>
                  <input type="text" name="certification" value={formData.certification} onChange={handleInputChange} placeholder="e.g., Solar PV Certification" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Service Area / District
                    <span className="ml-2 text-xs text-blue-400">📍 Auto-pinned on map</span>
                  </label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className={inputClass} placeholder="e.g., Colombo, Kandy, Galle, Matara" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-3">Specialization</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {specializations.map(spec => (
                      <label key={spec} className="flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                        <input type="checkbox" value={spec} checked={formData.specialization.includes(spec)} onChange={handleSpecializationChange} className="h-4 w-4 rounded border-slate-600 bg-white/10 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0" />
                        <span className="text-sm text-slate-300">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4 mt-4 pt-6 border-t border-white/10">
                  <button type="submit" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-6 py-2.5 rounded-lg font-medium transition-colors">
                    {editingId ? 'Update Technician' : 'Confirm Creation'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/30 px-6 py-2.5 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-6 flex flex-col md:flex-row gap-6 shadow-xl">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Availability Filter</label>
              <select value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)} className={`${inputClass} [&>option]:bg-slate-800`}>
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Specialization Filter</label>
              <select value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)} className={`${inputClass} [&>option]:bg-slate-800`}>
                <option value="">All Specialties</option>
                {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
              </select>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setActiveTab('list')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border ${activeTab === 'list' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'text-slate-400 border-white/10 hover:bg-white/5'}`}>
              📋 List View
            </button>
            <button onClick={() => setActiveTab('map')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${activeTab === 'map' ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'text-slate-400 border-white/10 hover:bg-white/5'}`}>
              🗺️ Map View
              {techsWithCoords > 0 && (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-1.5 py-0.5 rounded-full border border-emerald-500/30">{techsWithCoords}</span>
              )}
            </button>
          </div>

          {/* LIST VIEW */}
          {activeTab === 'list' && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden">
              {loading ? (
                <div className="text-center py-12 flex justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
                </div>
              ) : technicians.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <span className="text-4xl block mb-3 opacity-50">🔧</span>
                  No technicians found matching criteria.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Name / Contact</th>
                        <th className="px-6 py-4 font-semibold">Location</th>
                        <th className="px-6 py-4 font-semibold">Experience</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Rating</th>
                        <th className="px-6 py-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {technicians.map(tech => (
                        <tr key={tech._id} className={`hover:bg-white/5 transition-colors ${!tech.isActive ? 'opacity-60' : ''}`}>
                          <td className="px-6 py-4">
                            <div className="font-medium text-white">{tech.fullName}</div>
                            <div className="text-sm text-slate-400">{tech.email}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{tech.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-slate-300">📍 {tech.location}</div>
                            {tech.latitude && tech.longitude
                              ? <div className="text-xs text-emerald-400 mt-1">✅ On map</div>
                              : <div className="text-xs text-amber-400 mt-1">⚠️ No coordinates (edit to fix)</div>
                            }
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">{tech.experience} yrs</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide border ${!tech.isActive ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                                tech.availability === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                  tech.availability === 'Busy' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                              {!tech.isActive ? 'Disabled' : tech.availability}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-amber-400 font-medium">⭐ {tech.rating?.toFixed(1) || '0.0'}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => handleEdit(tech)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded border border-blue-500/30 text-xs font-medium transition-colors">Edit</button>
                              <button onClick={() => handleToggleActivation(tech)} className={`px-3 py-1.5 rounded border text-xs font-medium transition-colors ${tech.isActive ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30'}`}>
                                {tech.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button onClick={() => handleDelete(tech._id)} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded border border-rose-500/30 text-xs font-medium transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* MAP VIEW — Leaflet + OpenStreetMap (free, no billing) */}
          {activeTab === 'map' && (
            <div className="space-y-4">
              {/* Legend */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-wrap gap-4 items-center">
                <span className="text-slate-400 text-sm font-medium">📌 Legend:</span>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400"><span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>Available</div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>Busy</div>
                <div className="flex items-center gap-1.5 text-xs text-rose-400"><span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>On Leave</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block"></span>Disabled</div>
                <span className="ml-auto text-xs text-slate-500">{techsWithCoords} of {technicians.length} technicians mapped • Click pin for details</span>
              </div>

              {/* Leaflet Map */}
              <div className="border border-white/10 rounded-xl overflow-hidden shadow-xl" style={{ height: '500px' }}>
                {!leafletReady ? (
                  <div className="h-full flex items-center justify-center bg-[#0d1929] text-slate-400">
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin mx-auto mb-3"></div>
                      <p>Loading Map...</p>
                    </div>
                  </div>
                ) : (
                  <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
                )}
              </div>

              {/* Warning for techs without coords */}
              {technicians.filter(t => !t.latitude || !t.longitude).length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-amber-300 text-sm flex items-start gap-3">
                  <span>⚠️</span>
                  <div>
                    <strong>{technicians.filter(t => !t.latitude || !t.longitude).length} technician(s)</strong> are missing coordinates.
                    To pin them: click <strong>Edit</strong> → click <strong>Update Technician</strong> → coordinates will be auto-fetched.
                    <div className="mt-1 text-xs text-amber-400">Missing: {technicians.filter(t => !t.latitude || !t.longitude).map(t => t.fullName).join(', ')}</div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default TechnicianManagement;
