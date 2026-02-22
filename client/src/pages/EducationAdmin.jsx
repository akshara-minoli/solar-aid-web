import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

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
      console.log('Fetching education...')
      const res = await api.get('/api/education')
      console.log('Got response:', res.data)
      const contentArray = res.data.data || (Array.isArray(res.data) ? res.data : [])
      setEducationContent(contentArray)
      setError('')
    } catch (error) {
      console.error('Fetch error:', error.message)
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/api/education/${editingId}`, formData)
        alert('Content updated successfully!')
      } else {
        await api.post('/api/education', formData)
        alert('Education content created successfully!')
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
      alert('Failed to process content: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/api/education/${id}`)
        fetchEducation()
        alert('Content deleted!')
      } catch (error) {
        alert('Failed to delete')
      }
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '256px', flex: 1, minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Navbar title="Education Content" />
        <div style={{ padding: '24px', paddingTop: '160px', width: '100%' }}>
          <h1 style={{ color: 'black', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            Education Management
          </h1>

          <button
            onClick={() => {
              if (showForm) {
                setEditingId(null)
                setFormData({
                  title: '',
                  category: 'Solar Basics',
                  description: '',
                  content: 'Default content for preview',
                  contentType: 'Article',
                  difficulty: 'Beginner'
                })
              }
              setShowForm(!showForm)
            }}
            style={{
              padding: '10px 16px',
              backgroundColor: showForm ? '#6b7280' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '16px',
              fontWeight: 'bold'
            }}
          >
            {showForm ? 'Cancel' : 'Add Content'}
          </button>

          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {showForm && (
            <div style={{ backgroundColor: '#f0f9ff', border: '2px solid #3b82f6', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
              <h2 style={{ color: 'black', fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px solid #bfdbfe', paddingBottom: '10px' }}>
                {editingId ? 'Edit Education Content' : 'Create New Education Content'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: 'black', fontWeight: 'bold', marginBottom: '6px' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter descriptive title"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: 'black', fontWeight: 'bold', marginBottom: '6px' }}>
                    Description (Short Summary)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a brief summary of the content..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: 'black', fontWeight: 'bold', marginBottom: '6px' }}>
                    Full Content / Details
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write the full article content or details here..."
                    rows={10}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', color: 'black', fontWeight: 'bold', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
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
                    <label style={{ display: 'block', color: 'black', fontWeight: 'bold', marginBottom: '6px' }}>
                      Content Type
                    </label>
                    <select
                      value={formData.contentType}
                      onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option>Article</option>
                      <option>Video</option>
                      <option>PDF</option>
                      <option>Infographic</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'black', fontWeight: 'bold', marginBottom: '6px' }}>
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    {editingId ? 'Update Content' : 'Publish Content'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setFormData({
                          title: '',
                          category: 'Solar Basics',
                          description: '',
                          content: 'Default content for preview',
                          contentType: 'Article',
                          difficulty: 'Beginner'
                        })
                        setShowForm(false)
                      }}
                      style={{ padding: '12px 24px', backgroundColor: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '16px', border: '1px solid #e5e7eb' }}>
            {loading && <p style={{ color: 'black' }}>Loading...</p>}

            {!loading && educationContent.length === 0 && (
              <p style={{ color: '#666' }}>No education content. Click "Add Content" to create.</p>
            )}

            {!loading && educationContent.length > 0 && (
              <div>
                <p style={{ color: 'black', marginBottom: '16px' }}>
                  Total: {educationContent.length} items
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Type</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Difficulty</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Views</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '14px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {educationContent.map((content, idx) => (
                      <tr key={content._id || idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px', color: 'black' }}>{content.title}</td>
                        <td style={{ padding: '12px', color: 'black' }}>{content.category}</td>
                        <td style={{ padding: '12px', color: 'black' }}>
                          <span style={{ padding: '2px 8px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '10px', fontWeight: 'bold' }}>
                            {content.contentType}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'black' }}>{content.difficulty}</td>
                        <td style={{ padding: '12px', color: 'black', maxWidth: '200px', fontSize: '11px' }}>{content.description}</td>
                        <td style={{ padding: '12px', color: 'black' }}>{content.views || 0}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(content)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(content._id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: 'bold'
                              }}
                            >
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
        </div>
      </div>
    </div>
  )
}
