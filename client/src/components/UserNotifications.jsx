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
    <div className="max-w-3xl mx-auto pb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-3xl">🔔</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Your Communications</h2>
            <p className="text-xs text-slate-500 font-medium">Stay updated with service alerts and news.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-all"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top duration-300">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-3">
            <div className="h-8 w-8 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100">
            <div className="text-5xl mb-4 grayscale opacity-30">✨</div>
            <h3 className="text-lg font-black text-slate-700">Clear Skies!</h3>
            <p className="text-sm text-slate-400 font-medium">You have no active notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              className={`relative overflow-hidden group bg-white rounded-2xl border transition-all duration-300 ${notif.status === 'Sent'
                ? 'border-emerald-200 shadow-md shadow-emerald-50'
                : 'border-slate-100 hover:border-slate-200 grayscale-[0.5] opacity-80'
                }`}
            >
              {notif.priority === 'High' && notif.status === 'Sent' && (
                <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden">
                  <div className="absolute top-2 -right-6 w-24 bg-red-500 text-white text-[9px] font-black py-1 text-center rotate-45 shadow-sm uppercase tracking-tighter">
                    URGENT
                  </div>
                </div>
              )}

              <div className="p-5 flex items-start gap-4">
                <div className={`mt-1 h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center text-xl shadow-sm ${notif.notificationType === 'Maintenance Reminder' ? 'bg-orange-50 text-orange-500' :
                  notif.notificationType === 'New Subsidy' ? 'bg-emerald-50 text-emerald-500' :
                    notif.notificationType === 'Education Alert' ? 'bg-blue-50 text-blue-500' :
                      'bg-slate-50 text-slate-500'
                  }`}>
                  {notif.notificationType === 'Maintenance Reminder' ? '🛠️' :
                    notif.notificationType === 'New Subsidy' ? '💰' :
                      notif.notificationType === 'Education Alert' ? '📚' :
                        notif.notificationType === 'System Update' ? '⚙️' : '✉️'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {notif.notificationType}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className={`font-black text-slate-800 leading-tight mb-1 ${notif.status === 'Sent' ? 'text-lg' : 'text-base'}`}>
                    {notif.title}
                  </h3>

                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    {notif.status === 'Sent' ? (
                      <button
                        onClick={() => handleMarkAsRead(notif._id)}
                        className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase">
                        Read
                      </span>
                    )}

                    <button
                      onClick={() => handleArchive(notif._id)}
                      className="px-3 py-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl text-[10px] font-bold uppercase transition-all"
                    >
                      Archive
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
