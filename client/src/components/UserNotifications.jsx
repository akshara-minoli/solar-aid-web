import React, { useState, useEffect } from 'react'
import api from '../api'

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchNotifications()
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/notifications')

      if (res.data && res.data.success) {
        setNotifications(res.data.data)
      } else {
        setNotifications([])
      }
      setError('')
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setError('Failed to sync. Please try later.')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`)
      // Optimistic update
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, status: 'Read' } : n))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await api.put('/api/notifications/mark-all/read')
      setNotifications(prev => prev.map(n => ({ ...n, status: 'Read' })))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleArchive = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/archive`)
      setNotifications(prev => prev.filter(n => n._id !== id))
    } catch (error) {
      console.error('Error archiving:', error)
    }
  }

  const unreadCount = notifications.filter(n => n.status === 'Sent').length
  const highPriority = notifications.some(n => n.priority === 'High' && n.status === 'Sent')

  return (
    <div className="max-w-3xl mx-auto pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-lg ring-2 ring-[#0B1120] animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Communications Hub</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time intelligence and system alerts.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20 transition-all hover:bg-blue-500"
          >
            Acknowledge All
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-top duration-300">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      <div className="vertical-timeline space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-px before:bg-white/5">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4">
            <div className="h-10 w-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Synchronizing Stream...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-16 text-center border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6 grayscale opacity-20">📡</div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Signal Perfect</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">System monitoring indicates zero pending notifications.</p>
            </div>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`relative overflow-hidden group bg-white/5 backdrop-blur-md border transition-all duration-500 rounded-2xl ${notif.status === 'Sent'
                ? 'border-blue-500/30 shadow-xl shadow-blue-500/10'
                : 'border-white/5 opacity-60 grayscale-[0.3] hover:opacity-100'
                }`}
            >
              {notif.priority === 'High' && notif.status === 'Sent' && (
                <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden pointer-events-none">
                  <div className="absolute top-2 -right-6 w-24 bg-rose-600 text-white text-[8px] font-black py-1.5 text-center rotate-45 shadow-lg uppercase tracking-widest">
                    PRIORITY
                  </div>
                </div>
              )}

              <div className="p-6 flex items-start gap-5">
                <div className={`mt-1 h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-2xl border transition-colors ${notif.notificationType === 'Maintenance Reminder' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 shadow-lg shadow-orange-500/10' :
                  notif.notificationType === 'New Subsidy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10' :
                    notif.notificationType === 'Education Alert' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/10' :
                      'bg-white/5 border-white/10 text-slate-400 shadow-lg shadow-white/5'
                  }`}>
                  {notif.notificationType === 'Maintenance Reminder' ? '🛠️' :
                    notif.notificationType === 'New Subsidy' ? '💰' :
                      notif.notificationType === 'Education Alert' ? '📚' :
                        notif.notificationType === 'System Update' ? '⚙️' : '✉️'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">
                      {notif.notificationType}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/10"></span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className={`font-black tracking-tight leading-tight mb-2 ${notif.status === 'Sent' ? 'text-white text-lg' : 'text-slate-300 text-base'}`}>
                    {notif.title}
                  </h3>

                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                    {notif.message}
                  </p>

                  <div className="mt-6 flex items-center gap-4">
                    {notif.status === 'Sent' ? (
                      <button
                        onClick={() => handleMarkAsRead(notif._id)}
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all active:scale-95 group"
                      >
                        <span className="flex items-center gap-2">
                          Acknowledge
                          <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </button>
                    ) : (
                      <div className="px-4 py-1.5 bg-white/5 border border-white/10 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500/30 rounded-full"></span>
                        Archived Profile
                      </div>
                    )}

                    <button
                      onClick={() => handleArchive(notif._id)}
                      className="text-slate-500 hover:text-rose-400 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Erase
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserNotifications
