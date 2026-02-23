import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function UsersPage() {
  const [users, setUsers] = useState([])
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
      .then(res => setUsers(res.data.users || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

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
                    {users.map((u, i) => (
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
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest italic">No users found in registry.</td>
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
                  <option value="user" className="bg-[#111827]">USER (Standard Access)</option>
                  <option value="admin" className="bg-[#111827]">ADMIN (Restricted Authority)</option>
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
