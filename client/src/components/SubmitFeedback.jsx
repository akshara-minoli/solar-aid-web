import React, { useState } from 'react'
import api from '../api'

const SubmitFeedback = () => {
  const [formData, setFormData] = useState({
    feedbackType: 'General Feedback',
    title: '',
    message: '',
    rating: 5,
    isAnonymous: false
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const feedbackTypes = [
    { value: 'General Feedback', label: '💬 General' },
    { value: 'Service Review', label: '🛠️ Service' },
    { value: 'Content Review', label: '📚 Education' },
    { value: 'Bug Report', label: '🐛 Bug' },
    { value: 'Feature Request', label: '✨ Feature' },
    { value: 'System Improvement', label: '⚙️ Improvement' }
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.message.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError('')
      const res = await api.post('/api/feedback', formData)

      if (res.data && res.data.success) {
        setSubmitted(true)
        setFormData({
          feedbackType: 'General Feedback',
          title: '',
          message: '',
          rating: 5,
          isAnonymous: false
        })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting feedback')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Share Your Experience</h2>
          <p className="text-slate-500 text-sm mt-1">Your feedback helps us provide better solar solutions for everyone.</p>
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-500 text-white p-1 rounded-full text-xs">✓</div>
          <span className="font-medium">Thank you! Your feedback has been submitted successfully.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <div className="bg-red-500 text-white p-1 rounded-full text-xs">!</div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">

        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">What is this about?</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {feedbackTypes.map((fb) => (
              <button
                key={fb.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, feedbackType: fb.value }))}
                className={`px-4 py-3 rounded-xl transition-all text-sm font-semibold border-2 ${formData.feedbackType === fb.value
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-100'
                  : 'bg-white text-slate-600 border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {fb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1 uppercase tracking-wider">Overall Rating</label>
            <p className="text-xs text-slate-500">How would you rate your experience?</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => { }} // Could add hover effect
                  onClick={() => handleRatingChange(star)}
                  className="group"
                >
                  <span className={`text-3xl transition-all duration-200 ${star <= formData.rating ? 'grayscale-0 scale-110 drop-shadow-sm' : 'grayscale opacity-30 hover:opacity-50'
                    }`}>
                    ⭐
                  </span>
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-emerald-600">
              {formData.rating === 1 && 'Poor'}
              {formData.rating === 2 && 'Fair'}
              {formData.rating === 3 && 'Good'}
              {formData.rating === 4 && 'Very Good'}
              {formData.rating === 5 && 'Excellent'}
            </span>
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Feedback Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Great service, Issues with the app..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Detailed Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Please describe your experience in detail..."
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
              maxLength={1000}
            />
            <div className="flex justify-end mt-2">
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${formData.message.length > 900 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                }`}>
                {formData.message.length} / 1000
              </span>
            </div>
          </div>
        </div>

        {/* Anonymity & Privacy */}
        <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
          <input
            type="checkbox"
            id="isAnonymous"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
          />
          <label htmlFor="isAnonymous" className="text-sm text-slate-700 cursor-pointer select-none">
            <span className="font-bold">Submit anonymously?</span> Your name will not be shown to administrators.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200 flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <span className="animate-spin text-xl">⏳</span>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span className="text-xl transition-transform group-hover:-translate-y-1">✉️</span>
              <span>Send Feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default SubmitFeedback;
