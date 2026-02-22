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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">📚 Learning Resources</h2>
        <p className="text-slate-600 text-sm">{filteredEducation.length} resources available</p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${selectedCategory === cat
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin text-3xl">⏳</div>
            <p className="text-slate-600 mt-2">Loading resources...</p>
          </div>
        </div>
      ) : filteredEducation.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-lg">
          <p className="text-slate-600 text-lg">📭 No resources available yet</p>
          <p className="text-slate-500 text-sm mt-1">Admin will add content soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEducation.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/education/${item._id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-slate-200 cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-32 flex items-center justify-center group-hover:opacity-90 transition-opacity">
                <span className="text-4xl">
                  {item.contentType === 'Video' && '🎥'}
                  {item.contentType === 'Article' && '📄'}
                  {item.contentType === 'PDF' && '📑'}
                  {item.contentType === 'Infographic' && '🖼️'}
                  {!['Video', 'Article', 'PDF', 'Infographic'].includes(item.contentType) && '📚'}
                </span>
              </div>
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-medium">
                    {item.category}
                  </span>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-medium">
                    {item.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 text-sm group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                <p className="text-slate-600 text-xs mb-4 line-clamp-2">{item.description || item.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <div className="flex gap-3 text-xs text-slate-500">
                    <span title="Views">👁️ {item.views || 0}</span>
                    <span title="Likes">❤️ {item.likes || 0}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(item._id);
                    }}
                    className="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-full transition-colors text-xs font-medium"
                  >
                    ♡ Like
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Testimonials Section */}
      <div className="-mx-4 sm:-mx-8 lg:-mx-12 mt-12">
        <Testimonials />
      </div>
    </div>
  )
}

export default EducationHub
