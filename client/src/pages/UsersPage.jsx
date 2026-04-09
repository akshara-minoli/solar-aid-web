import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchUsers = () => {
    setLoading(true)
    api.get('/api/admin/users')
      .then(res => {
        const userList = res.data.users || []
        setUsers(userList)
        setFilteredUsers(userList)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter)
    }
    
    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  const exportToPDF = () => {
    try {
      console.log('Starting PDF export for users...');
      console.log('Data to export:', filteredUsers);
      
      const doc = new jsPDF()
      
      // Title
      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      doc.text('Users Report', 20, 20)
      
      // Date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)
      doc.text(`Total Records: ${filteredUsers.length}`, 20, 35)
      
      // Table data
      const tableData = filteredUsers.map(user => [
        user.fullName || 'N/A',
        user.email || 'N/A',
        user.phone || 'N/A',
        (user.role || 'user').toUpperCase()
      ])
      
      console.log('Table data prepared:', tableData);
      
      // Check if autoTable is available
      if (typeof doc.autoTable === 'function') {
        // Table
        doc.autoTable({
          startY: 45,
          head: [['Name', 'Email', 'Phone', 'Role']],
          body: tableData,
          theme: 'striped',
          styles: {
            fontSize: 9,
            cellPadding: 4
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold'
          },
          columnStyles: {
            1: { cellWidth: 60 }, // Email column wider
          }
        })
      } else {
        // Fallback: just add text if autoTable fails
        let y = 50;
        doc.setFontSize(12);
        doc.text('Name\t\tEmail\t\tPhone\t\tRole', 20, y);
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
      doc.save('users-report.pdf')
      
      console.log('PDF saved successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    }
  }
  const handleDelete = async (id) => {
    if (!window.confirm('Critical Protocol: Are you sure you want to purge this user from the registry? All associated data will be lost.')) return
    try {
      await api.delete(`/api/admin/users/${id}`)
      setUsers(prev => prev.filter(u => u._id !== id))
    } catch (err) {
      console.error('Deletion failed:', err)
      alert('Failed to delete user')
    }
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setEditFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user'
    })
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    try {
      await api.put(`/api/admin/users/${editingUser._id}`, editFormData)
      setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, ...editFormData } : u))
      setEditingUser(null)
    } catch (err) {
      console.error('Update failed:', err)
      alert('Failed to update user profile')
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
              <h1 className="text-3xl font-bold text-white tracking-wide">Manage Users</h1>
              <p className="text-slate-400 text-sm mt-1">View and manage all registered accounts</p>
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Search Users</label>
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Filter by Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="" className="bg-slate-800 text-white">All Roles</option>
                  <option value="user" className="bg-slate-800 text-white">User</option>
                  <option value="admin" className="bg-slate-800 text-white">Admin</option>
                </select>
              </div>
              {(searchTerm || roleFilter) && (
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setRoleFilter('')
                    }}
                    className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 border border-gray-500/30 px-4 py-2.5 rounded-lg font-medium transition-all"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
            {(searchTerm || roleFilter) && (
              <div className="mt-3 text-sm text-slate-400">
                Showing {filteredUsers.length} of {users.length} users
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
                      <th className="p-4 font-semibold">Name</th>
                      <th className="p-4 font-semibold">Email</th>
                      <th className="p-4 font-semibold">Phone</th>
                      <th className="p-4 font-semibold">Role</th>
                      <th className="p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{u.fullName}</td>
                        <td className="p-4 text-slate-300">{u.email}</td>
                        <td className="p-4 text-slate-300">{u.phone || 'N/A'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-[0.2em] border ${u.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <button
                            onClick={() => openEditModal(u)}
                            className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded text-[10px] hover:bg-blue-600 hover:text-white transition-all font-black uppercase tracking-widest"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded text-[10px] hover:bg-rose-600 hover:text-white transition-all font-black uppercase tracking-widest"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest italic">
                          {searchTerm || roleFilter ? 'No users match your search criteria.' : 'No users found in registry.'}
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600"></div>
            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-tight">Modify Identity Protocol</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  value={editFormData.fullName}
                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">System Role</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium appearance-none"
                >
                  <option value="user" className="bg-[#111827] text-white">USER (Standard Access)</option>
                  <option value="admin" className="bg-[#111827] text-white">ADMIN (Restricted Authority)</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
                >
                  {isUpdating ? 'Synchronizing...' : 'Update identity'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 border border-white/10 text-slate-400 hover:text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
