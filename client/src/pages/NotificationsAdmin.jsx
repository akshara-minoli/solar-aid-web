import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notificationType: 'General',
    priority: 'Medium',
    sendToAll: true,
    userIds: [],
    expiresAt: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [notifRes, userRes] = await Promise.all([
        api.get('/api/notifications/all'),
        api.get('/api/admin/users')
      ])

      if (notifRes.data && notifRes.data.success) {
        setNotifications(notifRes.data.data)
      }
      if (userRes.data && userRes.data.success) {
        setUsers(userRes.data.users.filter(u => u.role === 'user'))
      }
    } catch (error) {
      setError('Failed to load management data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleUserSelection = (userId) => {
    setFormData(prev => {
      const isSelected = prev.userIds.includes(userId)
      return {
        ...prev,
        userIds: isSelected ? prev.userIds.filter(id => id !== userId) : [...prev.userIds, userId]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.message) {
      setError('Please provide title and message')
      return
    }

    try {
      setSending(true)
      setError('')
      setSuccess('')

      const payload = {
        title: formData.title,
        message: formData.message,
        notificationType: formData.notificationType,
        priority: formData.priority,
        sendToAll: formData.sendToAll,
        userIds: formData.sendToAll ? [] : formData.userIds,
        expiresAt: formData.expiresAt || null
      }

      const res = await api.post('/api/notifications/bulk', payload)

      if (res.data && res.data.success) {
        setSuccess(`Notification sent to ${res.data.count} users!`)
        setFormData({ title: '', message: '', notificationType: 'General', priority: 'Medium', sendToAll: true, userIds: [], expiresAt: '' })
        fetchData()
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification record?')) {
      try {
        await api.delete(`/api/notifications/${id}`)
        fetchData()
      } catch (error) {
        setError('Failed to delete')
      }
    }
  }

  const inputClass = "w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors text-sm"

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Notification Center</h1>
              <p className="text-slate-400 text-sm mt-1">Dispatch alerts and updates to users</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 shadow-xl">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 shadow-xl">
              <span>✅</span> {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Create Section */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl sticky top-8">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                  <span className="text-blue-400">📢</span> Dispatch Notification
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wide">Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="E.g., System Update" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wide">Message</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Your solar details..." rows={4} className={`${inputClass} resize-y`} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wide">Category</label>
                      <select name="notificationType" value={formData.notificationType} onChange={handleInputChange} className={`${inputClass} [&>option]:bg-slate-800`}>
                        <option>General</option>
                        <option>Maintenance Reminder</option>
                        <option>New Subsidy</option>
                        <option>Education Alert</option>
                        <option>System Update</option>
                        <option>Service Notification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wide">Priority</label>
                      <select name="priority" value={formData.priority} onChange={handleInputChange} className={`${inputClass} [&>option]:bg-slate-800`}>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg mt-4">
                    <label className="flex items-center justify-between cursor-pointer mb-1 group">
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">Broadcast to Everyone</span>
                      <div className="relative">
                        <input type="checkbox" name="sendToAll" checked={formData.sendToAll} onChange={handleInputChange} className="sr-only" />
                        <div className={`w-10 h-6 bg-slate-700 rounded-full shadow-inner transition-colors ${formData.sendToAll ? 'bg-blue-500' : ''}`}></div>
                        <div className={`absolute w-4 h-4 bg-white rounded-full shadow inset-y-1 left-1 transition-transform ${formData.sendToAll ? 'transform translate-x-4' : ''}`}></div>
                      </div>
                    </label>

                    {!formData.sendToAll && (
                      <div className="mt-4 pt-4 border-t border-white/10 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-xs font-semibold text-slate-400 mb-3 tracking-wide uppercase">Select Target Users</p>
                        {users.map(u => (
                          <div
                            key={u._id}
                            onClick={() => handleUserSelection(u._id)}
                            className={`flex items-center gap-3 p-2.5 mb-2 rounded-lg cursor-pointer transition-all border ${formData.userIds.includes(u._id)
                              ? 'bg-blue-500/20 border-blue-500/30'
                              : 'bg-white/5 border-transparent hover:bg-white/10'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${formData.userIds.includes(u._id) ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                              {u.fullName.charAt(0)}
                            </div>
                            <span className={`text-sm font-medium truncate ${formData.userIds.includes(u._id) ? 'text-blue-100' : 'text-slate-300'}`}>
                              {u.fullName}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" disabled={sending} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 mt-6 mt-4">
                    {sending ? 'Dispatching...' : 'Send Notification'}
                  </button>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Dispatch History</h2>
                  <span className="px-3 py-1 bg-white/10 text-slate-300 rounded text-xs font-bold uppercase tracking-wide border border-white/10">
                    Total: {notifications.length}
                  </span>
                </div>

                {loading ? (
                  <div className="text-center py-12 flex justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <span className="text-4xl block mb-3 opacity-50">📫</span>
                    No dispatch history available
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                          <th className="px-6 py-4 font-semibold">Message Content</th>
                          <th className="px-6 py-4 font-semibold">Target / Date</th>
                          <th className="px-6 py-4 font-semibold text-center">Status</th>
                          <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {notifications.map((n) => (
                          <tr key={n._id} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 max-w-[250px]">
                              <div className="flex gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${n.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  : 'bg-white/10 text-slate-400 border-white/20'
                                  }`}>
                                  {n.priority}
                                </span>
                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase">
                                  {n.notificationType}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-white truncate mb-1">{n.title}</p>
                              <p className="text-xs text-slate-400 line-clamp-1 italic">"{n.message}"</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-medium text-slate-300 mb-1">{n.userId?.fullName || 'Bulk Send'}</p>
                              <p className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 inline-flex items-center gap-1 rounded text-[10px] font-bold uppercase border ${n.status === 'Read' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${n.status === 'Read' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                {n.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleDelete(n._id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}} />
        </main>
      </div>
    </div>
  )
}
