import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function ConsultationsPage() {
  const [consults, setConsults] = useState([])
  const [filteredConsults, setFilteredConsults] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingConsult, setEditingConsult] = useState(null)
  const [editFormData, setEditFormData] = useState({
    userName: '',
    contactInfo: '',
    message: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchConsultations = () => {
    setLoading(true)
    api.get('/api/admin/consultations')
      .then(res => {
        const consultations = res.data.consultations || []
        setConsults(consultations)
        setFilteredConsults(consultations)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchConsultations()
  }, [])

  // Filter consultations based on search and status
  useEffect(() => {
    let filtered = consults
    
    if (searchTerm) {
      filtered = filtered.filter(consult => 
        consult.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consult.contactInfo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consult.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter) {
      filtered = filtered.filter(consult => consult.status === statusFilter)
    }
    
    setFilteredConsults(filtered)
  }, [consults, searchTerm, statusFilter])

  const exportToPDF = () => {
    try {
      console.log('Starting PDF export for consultations...');
      console.log('Data to export:', filteredConsults);
      
      const doc = new jsPDF()
      
      // Title
      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      doc.text('Consultations Report', 20, 20)
      
      // Date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
      doc.text(`Total Records: ${filteredConsults.length}`, 20, 35)
      
      // Table data
      const tableData = filteredConsults.map(consult => [
        consult.userName || 'N/A',
        consult.contactInfo || 'N/A',
        (consult.message || '').substring(0, 50) + (consult.message?.length > 50 ? '...' : ''),
        consult.date ? new Date(consult.date).toLocaleDateString() : 'N/A',
        consult.status || 'Pending'
      ])
      
      console.log('Table data prepared:', tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable === 'function') {
        // Table
        doc.autoTable({
          startY: 45,
          head: [['User', 'Contact', 'Message', 'Date', 'Status']],
          body: tableData,
          theme: 'striped',
          styles: {
            fontSize: 8,
            cellPadding: 3
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            2: { cellWidth: 60 }, // Message column wider
          }
        })
      } else {
        // Fallback: just add text if autoTable fails
        let y = 50;
        doc.setFontSize(12);
        doc.text('User\t\tContact\t\tMessage\t\tDate\t\tStatus', 20, y);
        y += 10;
        
        tableData.forEach(row => {
          if (y > 280) { // New page if needed
            doc.addPage();
            y = 20;
          }
          doc.setFontSize(8);
          doc.text(row.join('\t'), 20, y);
          y += 8;
        });
      }
      
      console.log('PDF generated successfully, saving...');
      
      // Save the PDF
      doc.save('consultations-report.pdf')
      
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    }
  }
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/api/admin/consultations/${id}`, { status: newStatus })
      setConsults(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c))
    } catch (err) {
      console.error('Status update failed:', err)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultation?')) return
    try {
      await api.delete(`/api/admin/consultations/${id}`)
      setConsults(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Deletion failed:', err)
      alert('Failed to delete consultation')
    }
  }

  const openEditModal = (consult) => {
    setEditingConsult(consult)
    setEditFormData({
      userName: consult.userName,
      contactInfo: consult.contactInfo,
      message: consult.message
    })
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      await api.put(`/api/admin/consultations/${editingConsult.id}`, {
        userName: editFormData.userName,
        contactInfo: editFormData.contactInfo,
        description: editFormData.message
      })
      setConsults(prev => prev.map(c => c.id === editingConsult.id ? {
        ...c,
        userName: editFormData.userName,
        contactInfo: editFormData.contactInfo,
        message: editFormData.message
      } : c))
      setEditingConsult(null)
    } catch (err) {
      console.error('Update failed:', err)
      alert('Failed to update consultation')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Manage Consultations</h1>
              <p className="text-slate-400 text-sm mt-1">View user consultation requests</p>
            </div>
            <button
              onClick={exportToPDF}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <span>📄</span>
              Export PDF
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-6 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Search Consultations</label>
                <input
                  type="text"
                  placeholder="Search by user name, contact, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="" className="bg-slate-800 text-white">All Statuses</option>
                  <option value="Pending" className="bg-slate-800 text-white">Pending</option>
                  <option value="Accepted" className="bg-slate-800 text-white">Accepted</option>
                  <option value="Rejected" className="bg-slate-800 text-white">Rejected</option>
                  <option value="In Progress" className="bg-slate-800 text-white">In Progress</option>
                  <option value="Completed" className="bg-slate-800 text-white">Completed</option>
                  <option value="Cancelled" className="bg-slate-800 text-white">Cancelled</option>
                </select>
              </div>
              {(searchTerm || statusFilter) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('')
                    }}
                    className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30 px-4 py-2.5 rounded-lg font-medium transition-all"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            {(searchTerm || statusFilter) && (
              <div className="mt-3 text-sm text-slate-400">
                Showing {filteredConsults.length} of {consults.length} consultations
              </div>
            )}
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
            {loading ? (
              <div className="flex justify-center p-10">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm tracking-wider uppercase">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Contact</th>
                      <th className="p-4 font-semibold">Message</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Status Control</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsults.map((c, i) => (
                      <tr key={c.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{c.userName}</td>
                        <td className="p-4 text-slate-300">{c.contactInfo}</td>
                        <td className="p-4 text-slate-300 max-w-xs truncate" title={c.message}>{c.message}</td>
                        <td className="p-4 text-slate-400 text-sm">{new Date(c.date).toLocaleString()}</td>
                        <td className="p-4 text-sm">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className="bg-slate-800 border border-white/10 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            <option value="Pending" className="bg-slate-800 text-white">PENDING</option>
                            <option value="Accepted" className="bg-slate-800 text-white">ACCEPTED</option>
                            <option value="Rejected" className="bg-slate-800 text-white">REJECTED</option>
                            <option value="In Progress" className="bg-slate-800 text-white">IN PROGRESS</option>
                            <option value="Completed" className="bg-slate-800 text-white">COMPLETED</option>
                            <option value="Cancelled" className="bg-slate-800 text-white">CANCELLED</option>
                          </select>
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <button
                            onClick={() => openEditModal(c)}
                            className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-xs hover:bg-blue-600 hover:text-white transition-all font-semibold uppercase tracking-wider"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded text-xs hover:bg-rose-600 hover:text-white transition-all font-semibold uppercase tracking-wider"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredConsults.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">
                          {searchTerm || statusFilter ? 'No consultations match your search criteria.' : 'No consultations found.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {editingConsult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Edit Consultation</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">User Name</label>
                <input
                  type="text"
                  value={editFormData.userName}
                  onChange={(e) => setEditFormData({ ...editFormData, userName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Contact Info</label>
                <input
                  type="text"
                  value={editFormData.contactInfo}
                  onChange={(e) => setEditFormData({ ...editFormData, contactInfo: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Message</label>
                <textarea
                  value={editFormData.message}
                  onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                  rows="4"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingConsult(null)}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
