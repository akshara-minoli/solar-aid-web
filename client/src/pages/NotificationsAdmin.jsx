import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

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
        api.get('/api/admin/users') // Assuming this endpoint exists to list users
      ])

      if (notifRes.data && notifRes.data.success) {
        setNotifications(notifRes.data.data)
      }
      if (userRes.data && userRes.data.success) {
        setUsers(userRes.data.users.filter(u => u.role === 'user'))
      }
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Failed to load management data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleUserSelection = (userId) => {
    setFormData(prev => {
      const isSelected = prev.userIds.includes(userId)
      return {
        ...prev,
        userIds: isSelected
          ? prev.userIds.filter(id => id !== userId)
          : [...prev.userIds, userId]
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
        setFormData({
          title: '',
          message: '',
          notificationType: 'General',
          priority: 'Medium',
          sendToAll: true,
          userIds: [],
          expiresAt: ''
        })
        fetchData()
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
        alert('Failed to delete')
      }
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1 min-h-screen bg-slate-50">
        <Navbar title="Notification Commander" />

        <div className="p-4 md:p-8 pt-36 max-w-6xl mx-auto mt-20">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Create Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-32">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                  <span className="text-emerald-500 text-2xl">📢</span> Dispatch New
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Maintenance Reminder..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your solar inverter check is scheduled..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Category</label>
                      <select
                        name="notificationType"
                        value={formData.notificationType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option>General</option>
                        <option>Maintenance Reminder</option>
                        <option>New Subsidy</option>
                        <option>Education Alert</option>
                        <option>System Update</option>
                        <option>Service Notification</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-slate-700">Dispatch to All?</label>
                      <input
                        type="checkbox"
                        name="sendToAll"
                        checked={formData.sendToAll}
                        onChange={handleInputChange}
                        className="w-5 h-5 accent-emerald-500"
                      />
                    </div>

                    {!formData.sendToAll && (
                      <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Select Target Users</p>
                        {users.map(u => (
                          <div
                            key={u._id}
                            onClick={() => handleUserSelection(u._id)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${formData.userIds.includes(u._id) ? 'bg-emerald-100 border-emerald-200' : 'bg-white border-transparent'
                              } border`}
                          >
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-[10px] flex items-center justify-center font-bold">
                              {u.fullName.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-slate-600 truncate">{u.fullName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
                  {success && <p className="text-xs text-emerald-500 font-bold ml-1">{success}</p>}

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-emerald-100 active:scale-95 transition-all disabled:bg-slate-300"
                  >
                    {sending ? 'COMMUNICATING...' : 'DISPATCH NOTIFICATION'}
                  </button>
                </form>
              </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-800 tracking-tight underline decoration-emerald-500 decoration-4 underline-offset-4">Dispatch History</h2>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">
                    Total: {notifications.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Target / Date</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Message Content</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-bold">No dispatch history available</td></tr>
                      ) : (
                        notifications.map((n) => (
                          <tr key={n._id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-xs font-black text-slate-800">{n.userId?.fullName || 'Bulk Send'}</p>
                              <p className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <div className="flex gap-1 mb-1">
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${n.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                  }`}>{n.priority}</span>
                                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-black uppercase">{n.notificationType}</span>
                              </div>
                              <p className="text-xs font-bold text-slate-700 truncate">{n.title}</p>
                              <p className="text-[10px] text-slate-500 line-clamp-1 italic">"{n.message}"</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${n.status === 'Read' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                {n.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDelete(n._id)}
                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
