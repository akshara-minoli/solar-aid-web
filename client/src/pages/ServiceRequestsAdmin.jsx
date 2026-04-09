import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AdminProfileMenu from '../components/AdminProfileMenu';

const ServiceRequestsAdmin = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = localStorage.getItem('token');

    const statuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

    const fetchRequests = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/assistances/all`;
            if (filterStatus) url += `?status=${filterStatus}`;
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            setRequests(response.data.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching service requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filterStatus]);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(
                `${API_URL}/assistances/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service request?')) return;
        try {
            await axios.delete(`${API_URL}/assistances/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting request');
        }
    };

    const downloadPDF = async () => {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');

        const doc = new jsPDF();
        const tableColumn = ["User Name", "Phone", "Village", "Type", "Problem", "Status", "Priority", "Date"];
        const filteredRequests = requests.filter(r =>
            r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const tableRows = [];

        filteredRequests.forEach(r => {
            const rowData = [
                r.fullName,
                r.phoneNumber,
                r.village,
                r.assistanceType,
                r.problemDescription,
                r.status,
                r.priority,
                new Date(r.createdAt).toLocaleDateString()
            ];
            tableRows.push(rowData);
        });

        doc.setFontSize(18);
        doc.text("Solar Aid - Service Requests Report", 14, 15);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 22);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [241, 245, 249] }
        });

        doc.save(`Service_Requests_Report_${new Date().getTime()}.pdf`);
    };

    const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors [&>option]:bg-slate-800";

    const filteredRequests = requests.filter(r =>
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden bg-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
                <AdminProfileMenu />
                <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-wide">Service Requests</h1>
                            <p className="text-slate-400 text-sm mt-1">Manage, update progress, and close user requests</p>
                        </div>
                        <button onClick={downloadPDF} className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 px-6 py-2.5 font-medium rounded-lg border border-white/10 transition-all flex items-center gap-2 text-sm">
                            <span>📄</span> Export PDF
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8 shadow-xl flex flex-col md:flex-row gap-6 ">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Search Requests</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500 text-sm">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search by name, village, phone or problem..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`${inputClass} !pl-10`}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">Filter by Status</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={`md:w-64 ${inputClass}`}>
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
                        ) : requests.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">No service requests found</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">User Details</th>
                                            <th className="px-6 py-4 font-semibold">Problem</th>
                                            <th className="px-6 py-4 font-semibold">Status / Priority</th>
                                            <th className="px-6 py-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredRequests.map(r => (
                                            <tr key={r._id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">{r.fullName}</div>
                                                    <div className="text-xs text-slate-400">{r.phoneNumber}</div>
                                                    <div className="text-xs text-slate-500">{r.village}</div>
                                                </td>
                                                <td className="px-6 py-4 max-w-xs">
                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase mb-1 inline-block">
                                                        {r.assistanceType}
                                                    </span>
                                                    <p className="text-sm text-slate-300 line-clamp-2">{r.problemDescription}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 items-start">
                                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded uppercase tracking-wide border ${r.status === 'Closed' || r.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            r.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                r.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                                    'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                            }`}>
                                                            {r.status}
                                                        </span>
                                                        <span className="text-[10px] uppercase font-bold text-slate-500">{r.priority} Priority</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2 min-w-[140px]">
                                                        <select
                                                            value={r.status}
                                                            onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                                                            className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-slate-300 focus:outline-none focus:border-blue-500/50 [&>option]:bg-slate-800"
                                                        >
                                                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                                        </select>

                                                        <div className="flex gap-2">
                                                            {r.status !== 'Closed' && (
                                                                <button onClick={() => handleStatusUpdate(r._id, 'Closed')} className="flex-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded border border-emerald-500/30 text-[10px] font-medium transition-colors">
                                                                    Close Req
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDelete(r._id)} className="px-2 py-1 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded border border-rose-500/30 text-[10px] font-medium transition-colors">
                                                                Delete
                                                            </button>
                                                        </div>
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
        </div>
    );
};

export default ServiceRequestsAdmin;
