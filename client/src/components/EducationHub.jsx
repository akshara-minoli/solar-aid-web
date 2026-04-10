import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import Testimonials from './Testimonials'

const EducationHub = () => {
  const navigate = useNavigate()
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [error, setError] = useState('')

  const categories = [
    'all',
    'Solar Basics',
    'Solar Installation',
    'Maintenance Tips',
    'Energy Efficiency',
    'Troubleshooting',
    'Government Incentives',
    'Technology Updates',
    'Safety Guidelines'
  ]

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching education from /api/education')
      const res = await api.get('/api/education')
      console.log('Education response:', res.data)

      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        setEducation(res.data.data)
      } else {
        setEducation([])
      }
    } catch (error) {
      console.error('Error fetching education:', error)
      setError('Failed to load educational content')
      setEducation([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (id) => {
    try {
      console.log('Liking content:', id)
      await api.put(`/api/education/${id}/like`, { action: 'like' })
      fetchEducation() // Refresh data
    } catch (error) {
      console.error('Error liking content:', error)
    }
  }

  const filteredEducation = selectedCategory === 'all'
    ? education
    : education.filter(e => e.category === selectedCategory)

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <span className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">📚</span>
            Education Repository
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{filteredEducation.length} Digital Assets available</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all text-xs font-black uppercase tracking-widest border ${selectedCategory === cat
              ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20'
              : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5">
          <div className="inline-block">
            <div className="w-10 h-10 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-6">Indexing Repository...</p>
          </div>
        </div>
      ) : filteredEducation.length === 0 ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <div className="text-6xl mb-6 grayscale opacity-20">📭</div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Repository Empty</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">No resources match the selected classification.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEducation.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/education/${item._id}`)}
              className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/10 shadow-2xl transition-all duration-500 group relative flex flex-col"
            >
              <div className="relative h-44 flex items-center justify-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                  {item.contentType === 'Video' && '🎥'}
                  {item.contentType === 'Article' && '📄'}
                  {item.contentType === 'PDF' && '📑'}
                  {item.contentType === 'Infographic' && '🖼️'}
                  {!['Video', 'Article', 'PDF', 'Infographic'].includes(item.contentType) && '📚'}
                </span>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-blue-600 text-white text-[8px] px-2 py-1 rounded font-black uppercase tracking-widest shadow-lg">
                    {item.contentType}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex gap-2 mb-4">
                  <span className="bg-white/5 text-blue-400 text-[8px] px-2 py-1 rounded border border-white/5 font-black uppercase tracking-widest">
                    {item.category}
                  </span>
                  <span className="bg-white/5 text-emerald-400 text-[8px] px-2 py-1 rounded border border-white/5 font-black uppercase tracking-widest">
                    {item.difficulty}
                  </span>
                </div>
                <h3 className="font-black text-white mb-3 line-clamp-2 text-base group-hover:text-blue-400 transition-colors tracking-tight leading-tight uppercase">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs mb-6 line-clamp-3 italic font-medium leading-relaxed">
                  {item.description || item.content}
                </p>
                <div className="mt-auto pt-5 border-t border-white/5 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5" title="Views">
                      <span className="text-blue-500/50 text-[10px]">👁️</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{item.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Likes">
                      <span className="text-rose-500/50 text-[10px]">❤️</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase">{item.likes || 0}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item._id);
                    }}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all font-bold"
                    title="Like Content"
                  >
                    ♡
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials Section */}
      <div className="mt-16 pt-16 border-t border-white/5">
        <Testimonials />
      </div>
    </div>
  )
}

export default EducationHub
