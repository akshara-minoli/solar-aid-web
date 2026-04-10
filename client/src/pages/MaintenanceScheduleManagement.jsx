import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminProfileMenu from '../components/AdminProfileMenu';
import CompleteMaintenanceModal from '../components/CompleteMaintenanceModal';

const MaintenanceScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState(null); // For completion modal

  const [formData, setFormData] = useState({
    assistanceId: '',
    technicianId: '',
    userId: '',
    serviceType: 'Routine Maintenance',
    description: '',
    scheduledDate: '',
    estimatedDuration: 2,
    priority: 'Medium'
  });

  const [assistances, setAssistances] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'https://solar-aid-web.onrender.com/api';
  const token = localStorage.getItem('token');

  const serviceTypes = [
    'Routine Maintenance', 'Panel Cleaning', 'Battery Check', 'Inverter Inspection',
    'Wiring Check', 'Complete System Check', 'Repair Service', 'Other'
  ];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'];

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/maintenance-schedules`;
      if (filterStatus) url += `?status=${filterStatus}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setSchedules(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(`${API_URL}/technicians`, { headers: { Authorization: `Bearer ${token}` } });
      setTechnicians(response.data.data);
    } catch (err) { console.error('Error fetching technicians:', err); }
  };

  const fetchAssistances = async () => {
    try {
      const response = await axios.get(`${API_URL}/assistances/all`, { headers: { Authorization: `Bearer ${token}` } });
      setAssistances(response.data.data);
    } catch (err) { console.error('Error fetching assistances:', err); }
  };

  useEffect(() => {
    fetchSchedules();
    fetchTechnicians();
    fetchAssistances();
  }, [filterStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'estimatedDuration' ? parseFloat(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assistanceId) { setError('Please select a service request'); return; }
    if (!formData.technicianId) { setError('Please select a technician'); return; }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/maintenance-schedules/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        const selectedAssistance = assistances.find(a => a._id === formData.assistanceId);
        if (!selectedAssistance) { setError('Selected service request not found'); return; }

        // Pass userId from selected assistance
        const userId = selectedAssistance.userId._id || selectedAssistance.userId;
        await axios.post(`${API_URL}/maintenance-schedules`, { ...formData, userId }, { headers: { Authorization: `Bearer ${token}` } });
      }
      resetForm();
      fetchSchedules();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving schedule');
    }
  };

  const handleEdit = (schedule) => {
    setFormData({
      assistanceId: schedule.assistanceId ? (schedule.assistanceId._id || schedule.assistanceId) : '',
      technicianId: schedule.technicianId ? (schedule.technicianId._id || schedule.technicianId) : '',
      serviceType: schedule.serviceType,
      description: schedule.description,
      scheduledDate: schedule.scheduledDate ? schedule.scheduledDate.split('T')[0] : '',
      estimatedDuration: schedule.estimatedDuration,
      priority: schedule.priority
    });
    setEditingId(schedule._id);
    setShowForm(true);
  };

  const handleAction = async (id, actionStr, payloadData) => {
    try {
      await axios.put(`${API_URL}/maintenance-schedules/${id}/${actionStr}`, payloadData, { headers: { Authorization: `Bearer ${token}` } });
      fetchSchedules();
      setSelectedSchedule(null);
    } catch (err) {
      setError(err.response?.data?.message || `Error ${actionStr} schedule`);
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await axios.delete(`${API_URL}/maintenance-schedules/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchSchedules();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting schedule');
    }
  };

  const resetForm = () => {
    setFormData({ assistanceId: '', technicianId: '', userId: '', serviceType: 'Routine Maintenance', description: '', scheduledDate: '', estimatedDuration: 2, priority: 'Medium' });
    setEditingId(null);
    setShowForm(false);
  };

  const downloadPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    const tableColumn = ["Technician", "Service Type", "Description", "Date", "Duration", "Status", "Priority"];
    const filteredSchedules = schedules.filter(s =>
      (s.technicianId?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const tableRows = [];

    filteredSchedules.forEach(s => {
      const rowData = [
        s.technicianId?.fullName || 'N/A',
        s.serviceType,
        s.description,
        new Date(s.scheduledDate).toLocaleDateString(),
        `${s.estimatedDuration} hrs`,
        s.status,
        s.priority
      ];
      tableRows.push(rowData);
    });

    doc.setFontSize(18);
    doc.text("Solar Aid - Maintenance Schedules Report", 14, 15);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [51, 65, 85], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 245, 249] }
    });

    doc.save(`Maintenance_Schedules_Report_${new Date().getTime()}.pdf`);
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors"

  const filteredSchedules = schedules.filter(s =>
    (s.technicianId?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Maintenance Schedules</h1>
              <p className="text-slate-400 text-sm mt-1">Manage and assign service appointments</p>
            </div>
            <div className="flex gap-4">
              <button onClick={downloadPDF} className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 px-6 py-2.5 font-medium rounded-lg border border-white/10 transition-all flex items-center gap-2 text-sm">
                <span>📄</span> Export PDF
              </button>
              {!showForm && (
                <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
                  <span>➕</span> Schedule Maintenance
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-8 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-white pb-4 border-b border-white/10">
                {editingId ? 'Edit Schedule' : 'Create New Maintenance Schedule'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Service Request *</label>
                  <select name="assistanceId" value={formData.assistanceId} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-slate-800`}>
                    <option value="">Select Service Request</option>
                    {assistances.map(a => <option key={a._id} value={a._id}>{a.assistanceType} - {a.fullName} ({a.status})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Technician *</label>
                  <select name="technicianId" value={formData.technicianId} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-slate-800`}>
                    <option value="">Select Technician</option>
                    {technicians.map(t => <option key={t._id} value={t._id}>{t.fullName} - {t.location}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Service Type *</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} required className={`${inputClass} [&>option]:bg-slate-800`}>
                    {serviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className={`${inputClass} [&>option]:bg-slate-800`}>
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required minLength="10" rows="3" className={inputClass} placeholder="Describe the maintenance work..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Scheduled Date *</label>
                  <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleInputChange} required className={`${inputClass} [color-scheme:dark]`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estimated Duration (hours)</label>
                  <input type="number" name="estimatedDuration" value={formData.estimatedDuration} onChange={handleInputChange} min="0.5" step="0.5" className={inputClass} />
                </div>
                <div className="md:col-span-2 flex gap-4 mt-2">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    {editingId ? 'Update' : 'Schedule'}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/30 px-6 py-2.5 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8 shadow-xl flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Search Schedules</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Search by technician or service type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${inputClass} !pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Filter by Status</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`${inputClass} md:w-64 [&>option]:bg-slate-800`}>
                <option value="">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
              </div>
            ) : schedules.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No schedules found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Technician</th>
                      <th className="px-6 py-4 font-semibold">Service</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Priority</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSchedules.map(s => (
                      <tr key={s._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{s.technicianId?.fullName || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{s.serviceType}</td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{new Date(s.scheduledDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-wide ${s.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : s.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : s.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded uppercase tracking-wide bg-white/10 text-slate-300 border border-white/20">
                            {s.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2 min-w-[200px]">
                            <button onClick={() => handleEdit(s)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded border border-blue-500/30 text-xs font-medium transition-colors">Edit</button>
                            {s.status !== 'Completed' && (
                              <button onClick={() => setSelectedSchedule(s)} className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded border border-emerald-500/30 text-xs font-medium transition-colors">Done</button>
                            )}
                            {s.status !== 'Cancelled' && (
                              <button onClick={() => handleAction(s._id, 'cancel', { reason: 'Cancelled by admin' })} className="px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded border border-amber-500/30 text-xs font-medium transition-colors">Cancel</button>
                            )}
                            <button onClick={() => handleDelete(s._id)} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded border border-rose-500/30 text-xs font-medium transition-colors">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      {selectedSchedule && (
        <CompleteMaintenanceModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onSuccess={(id, data) => handleAction(id, 'complete', data)}
        />
      )}
    </div>
  );
};

export default MaintenanceScheduleManagement;
