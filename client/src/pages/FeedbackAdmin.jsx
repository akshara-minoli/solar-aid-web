import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState({ status: '', feedbackType: '' })
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
      setError('Failed to load feedback data')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, action) => {
    try {
      const notes = adminNotes[id] || ''
      await api.put(`/api/feedback/${id}/${action}`, { adminNotes: notes })
      fetchData()
    } catch (error) {
      setError('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await api.delete(`/api/feedback/${id}`)
        fetchData()
      } catch (error) {
        setError('Failed to delete feedback')
      }
    }
  }

  const selectClass = "px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors [&>option]:bg-slate-800"

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Feedback Center</h1>
              <p className="text-slate-400 text-sm mt-1">Review and manage user feedback & ratings</p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 shadow-xl">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total</p>
              <h3 className="text-3xl font-black text-white">{stats?.totalFeedback || 0}</h3>
            </div>
            <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/20 blur-xl rounded-full"></div>
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">Approved</p>
              <h3 className="text-3xl font-black text-emerald-300">{stats?.approvedFeedback || 0}</h3>
            </div>
            <div className="bg-amber-500/10 backdrop-blur-md border border-amber-500/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/20 blur-xl rounded-full"></div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">Pending</p>
              <h3 className="text-3xl font-black text-amber-300">{stats?.pendingFeedback || 0}</h3>
            </div>
            <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 blur-xl rounded-full"></div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Avg Rating</p>
              <h3 className="text-3xl font-black text-blue-300 flex items-center gap-1">
                <span>{stats && stats.averageRating ? Number(stats.averageRating).toFixed(1) : 0}</span>
                <span className="text-xl">⭐</span>
              </h3>
            </div>
            <div className="bg-purple-500/10 backdrop-blur-md border border-purple-500/20 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 blur-xl rounded-full"></div>
              <p className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-2">Satisfaction</p>
              <h3 className="text-3xl font-black text-purple-300">
                {stats && stats.averageRating ? Math.round((Number(stats.averageRating) / 5) * 100) : 0}%
              </h3>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
              <h2 className="text-lg font-semibold text-white">Incoming Feedback</h2>

              <div className="flex flex-wrap gap-3">
                <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className={selectClass}>
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <select value={filter.feedbackType} onChange={(e) => setFilter({ ...filter, feedbackType: e.target.value })} className={selectClass}>
                  <option value="">All Types</option>
                  <option value="General Feedback">General</option>
                  <option value="Service Review">Service</option>
                  <option value="Content Review">Education</option>
                  <option value="Bug Report">Bug</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
              </div>
            ) : !Array.isArray(feedbacks) || feedbacks.length === 0 ? (
              <div className="text-center py-16 text-slate-400 border-t border-white/5">
                <span className="text-4xl block mb-3 opacity-50">✨</span>
                No feedback entries found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">User details</th>
                      <th className="px-6 py-4 font-semibold">Feedback Content</th>
                      <th className="px-6 py-4 font-semibold text-center">Rating</th>
                      <th className="px-6 py-4 font-semibold text-center">Status</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {feedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-5 align-top">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">
                              {fb.isAnonymous ? '?' : fb.userId?.fullName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{fb.isAnonymous ? 'Anonymous User' : fb.userId?.fullName || 'Unknown'}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{new Date(fb.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 max-w-xs xl:max-w-md">
                          <div className="mb-2 inline-flex">
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                              {fb.feedbackType}
                            </span>
                          </div>
                          <p className="font-semibold text-slate-200 text-sm mb-1">{fb.title}</p>
                          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">"{fb.message}"</p>

                          {fb.adminNotes && (
                            <div className="mt-3 p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-start gap-2">
                              <span className="text-xs">💬</span>
                              <p className="text-[11px] text-purple-300 italic"><strong className="font-semibold text-purple-400 not-italic mr-1">Admin Note:</strong> {fb.adminNotes}</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-5 text-center align-top">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-black text-amber-400 mb-1">{fb.rating}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={`text-[10px] ${s <= fb.rating ? 'opacity-100' : 'opacity-20 grayscale'}`}>⭐</span>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center align-top">
                          <span className={`px-2.5 py-1 inline-flex items-center gap-1.5 rounded text-[10px] font-bold uppercase tracking-wide border ${fb.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            fb.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${fb.status === 'Approved' ? 'bg-emerald-400' :
                              fb.status === 'Rejected' ? 'bg-rose-400' : 'bg-amber-400'
                              }`}></span>
                            {fb.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-col gap-2 items-end">
                            <div className="flex gap-2">
                              {fb.status === 'Pending' && (
                                <>
                                  <button onClick={() => handleStatusUpdate(fb._id, 'approve')} className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded text-xs font-medium transition-colors">
                                    ✓ Approve
                                  </button>
                                  <button onClick={() => handleStatusUpdate(fb._id, 'reject')} className="px-2.5 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600 rounded text-xs font-medium transition-colors">
                                    ✕ Reject
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleDelete(fb._id)} className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors ml-1" title="Delete">
                                🗑️
                              </button>
                            </div>
                            {fb.status === 'Pending' && (
                              <textarea
                                placeholder="Add admin notes (optional)..."
                                value={adminNotes[fb._id] || ''}
                                onChange={(e) => setAdminNotes({ ...adminNotes, [fb._id]: e.target.value })}
                                className="w-full sm:w-48 mt-2 p-2 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-colors resize-y custom-scrollbar"
                                rows={2}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
