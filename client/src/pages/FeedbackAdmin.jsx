import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({
    status: '',
    feedbackType: ''
  })
  const [adminNotes, setAdminNotes] = useState({})

  useEffect(() => {
    fetchData()
  }, [filter])

  const fetchData = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filter.status) queryParams.append('status', filter.status)
      if (filter.feedbackType) queryParams.append('feedbackType', filter.feedbackType)

      const [fbRes, statsRes] = await Promise.all([
        api.get(`/api/feedback?${queryParams.toString()}`),
        api.get('/api/feedback/stats')
      ])

      if (fbRes.data && fbRes.data.success) {
        setFeedbacks(fbRes.data.data)
      }
      if (statsRes.data && statsRes.data.success) {
        setStats(statsRes.data.stats)
      }
      setError('')
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Failed to load feedback data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, action) => {
    try {
      const notes = adminNotes[id] || ''
      await api.put(`/api/feedback/${id}/${action}`, { adminNotes: notes })
      alert(`Feedback ${action}ed successfully`)
      fetchData()
    } catch (error) {
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/api/feedback/${id}`)
        fetchData()
      } catch (error) {
        alert('Failed to delete feedback')
      }
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar />
      <div className="md:ml-64 flex-1 min-h-screen bg-slate-50 mt-20">
        <Navbar title="Feedback Control Center" />

        <div className="p-4 md:p-8 pt-36">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total</p>
              <h3 className="text-2xl font-black text-slate-800">{stats?.totalFeedback || 0}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-emerald-500 text-sm font-bold uppercase tracking-wider mb-1">Approved</p>
              <h3 className="text-2xl font-black text-slate-800">{stats?.approvedFeedback || 0}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-orange-500 text-sm font-bold uppercase tracking-wider mb-1">Pending</p>
              <h3 className="text-2xl font-black text-slate-800">{stats?.pendingFeedback || 0}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-blue-500 text-sm font-bold uppercase tracking-wider mb-1">Avg Rating</p>
              <h3 className="text-2xl font-black text-slate-800">⭐ {stats?.averageRating || 0}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-purple-500 text-sm font-bold uppercase tracking-wider mb-1">Satisfaction</p>
              <h3 className="text-2xl font-black text-slate-800">
                {stats?.averageRating ? Math.round((stats.averageRating / 5) * 100) : 0}%
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-800">Incoming Feedback</h2>

              <div className="flex flex-wrap gap-2">
                <select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select
                  value={filter.feedbackType}
                  onChange={(e) => setFilter({ ...filter, feedbackType: e.target.value })}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Types</option>
                  <option value="General Feedback">General</option>
                  <option value="Service Review">Service</option>
                  <option value="Content Review">Education</option>
                  <option value="Bug Report">Bug</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">User / Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Feedback Details</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Rating</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading resources...</td></tr>
                  ) : feedbacks.length === 0 ? (
                    <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400">No feedback entries found matching your criteria.</td></tr>
                  ) : (
                    feedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{fb.isAnonymous ? '👤 Anonymous' : fb.userId?.fullName || 'User'}</p>
                          <p className="text-[10px] font-medium text-slate-400 mt-0.5">{new Date(fb.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 max-w-xs sm:max-w-md lg:max-w-lg">
                          <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-black uppercase mb-1">{fb.feedbackType}</span>
                          <p className="font-bold text-slate-700 text-sm truncate">{fb.title}</p>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2 italic">"{fb.message}"</p>

                          {fb.adminNotes && (
                            <div className="mt-2 p-2 bg-emerald-50 border border-emerald-100 rounded text-[10px] text-emerald-800 italic">
                              <strong>Admin Note:</strong> {fb.adminNotes}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black text-slate-700">{fb.rating}</span>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`text-[8px] ${s <= fb.rating ? 'grayscale-0' : 'grayscale opacity-30'}`}>⭐</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${fb.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                            fb.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                            {fb.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-1">
                              {fb.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(fb._id, 'approve')}
                                    className="p-1 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(fb._id, 'reject')}
                                    className="p-1 px-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded text-[10px] font-bold"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDelete(fb._id)}
                                className="p-1 px-2 border border-red-200 text-red-400 hover:bg-red-50 rounded text-[10px] font-bold"
                              >
                                Delete
                              </button>
                            </div>
                            {fb.status === 'Pending' && (
                              <textarea
                                placeholder="Add admin notes..."
                                value={adminNotes[fb._id] || ''}
                                onChange={(e) => setAdminNotes({ ...adminNotes, [fb._id]: e.target.value })}
                                className="w-40 p-1 text-[10px] border border-slate-200 rounded outline-none focus:ring-1 focus:ring-emerald-500"
                                rows={2}
                              />
                            )}
                          </div>
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
  )
}

