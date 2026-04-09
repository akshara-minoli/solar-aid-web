import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function EducationAdmin() {
  const [educationContent, setEducationContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    category: 'Solar Basics',
    description: '',
    content: 'Default content for preview',
    contentType: 'Article',
    difficulty: 'Beginner'
  })

  useEffect(() => {
    setTimeout(() => {
      fetchEducation()
    }, 500)
  }, [])

  const fetchEducation = async () => {
    try {
      setLoading(true)
      const res = await api.get('/api/education')
      const contentArray = res.data.data || (Array.isArray(res.data) ? res.data : [])
      setEducationContent(contentArray)
      setError('')
    } catch (error) {
      setError('Error: ' + error.message)
      setEducationContent([])
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (content) => {
    setFormData({
      title: content.title,
      category: content.category,
      description: content.description,
      content: content.content || '',
      contentType: content.contentType,
      difficulty: content.difficulty
    })
    setEditingId(content._id)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/education/${editingId}`, formData)
      } else {
        await api.post('/api/education', formData)
      }

      setFormData({
        title: '',
        category: 'Solar Basics',
        description: '',
        content: 'Default content for preview',
        contentType: 'Article',
        difficulty: 'Beginner'
      })
      setEditingId(null)
      setShowForm(false)
      await fetchEducation()
    } catch (error) {
      setError('Failed to process content: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.delete(`/api/education/${id}`)
        fetchEducation()
      } catch (error) {
        setError('Failed to delete')
      }
    }
  }

  // Component styles for inputs
  const inputClass = "w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors text-sm"

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Education Management</h1>
              <p className="text-slate-400 text-sm mt-1">Manage articles, videos, and guides</p>
            </div>
            {!showForm && (
              <button onClick={() => { setEditingId(null); setFormData({ title: '', category: 'Solar Basics', description: '', content: 'Default content for preview', contentType: 'Article', difficulty: 'Beginner' }); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 text-sm">
                <span>➕</span> Add Content
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          {showForm && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-8 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-white pb-4 border-b border-white/10">
                {editingId ? 'Edit Education Content' : 'Create New Education Content'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter descriptive title" className={inputClass} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description (Short Summary)</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Provide a brief summary of the content..." rows={3} className={`${inputClass} resize-y`} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Content / Details</label>
                  <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write the full article content or details here..." rows={6} className={`${inputClass} resize-y`} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className={`${inputClass} [&>option]:bg-slate-800`}>
                      <option>Solar Basics</option>
                      <option>Solar Installation</option>
                      <option>Maintenance Tips</option>
                      <option>Energy Efficiency</option>
                      <option>Troubleshooting</option>
                      <option>Government Incentives</option>
                      <option>Technology Updates</option>
                      <option>Safety Guidelines</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Content Type</label>
                    <select value={formData.contentType} onChange={(e) => setFormData({ ...formData, contentType: e.target.value })} className={`${inputClass} [&>option]:bg-slate-800`}>
                      <option>Article</option>
                      <option>Video</option>
                      <option>PDF</option>
                      <option>Infographic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty Level</label>
                    <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className={`${inputClass} [&>option]:bg-slate-800`}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-6 border-t border-white/10">
                  <button type="submit" className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-6 py-2.5 rounded-lg font-medium transition-colors">
                    {editingId ? 'Update Content' : 'Publish Content'}
                  </button>
                  <button type="button" onClick={() => { setEditingId(null); setShowForm(false); }} className="bg-slate-500/20 hover:bg-slate-500/30 text-slate-300 border border-slate-500/30 px-6 py-2.5 rounded-lg font-medium transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12 flex justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
              </div>
            ) : educationContent.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <span className="text-4xl block mb-3 opacity-50">📚</span>
                No education content found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Title</th>
                      <th className="px-6 py-4 font-semibold">Type</th>
                      <th className="px-6 py-4 font-semibold">Difficulty</th>
                      <th className="px-6 py-4 font-semibold">Views</th>
                      <th className="px-6 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {educationContent.map(content => (
                      <tr key={content._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white mb-1">{content.title}</div>
                          <div className="text-xs text-slate-400 mb-1">{content.category}</div>
                          <div className="text-[10px] text-slate-500 max-w-xs truncate">{content.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide border bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {content.contentType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wide border ${content.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : content.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                            {content.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          👁️ {content.views || 0}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(content)} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded border border-blue-500/30 text-xs font-medium transition-colors">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(content._id)} className="px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded border border-rose-500/30 text-xs font-medium transition-colors">
                              Delete
                            </button>
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
  )
}
