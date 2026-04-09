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
    <div className="max-w-2xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">Share Your Experience</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Your feedback fuels our solar innovation engine.</p>
        </div>
      </div>

      {submitted && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-in slide-in-from-top duration-300">
          <div className="bg-emerald-500 text-white p-1 rounded-full text-[10px]">✓</div>
          <span className="font-bold text-xs uppercase tracking-wider">Transmission Successful: Thank you for your architectural insights.</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3">
          <div className="bg-rose-500 text-white p-1 rounded-full text-[10px]">!</div>
          <span className="font-bold text-xs uppercase tracking-wider">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10 bg-white/5 backdrop-blur-md border border-white/5 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>

        {/* Feedback Type */}
        <div className="relative z-10">
          <label className="block text-[10px] font-black text-slate-500 mb-5 uppercase tracking-[0.2em] ml-1">Classification Area</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {feedbackTypes.map((fb) => (
              <button
                key={fb.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, feedbackType: fb.value }))}
                className={`px-4 py-3 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border ${formData.feedbackType === fb.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/20'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10 hover:bg-white/10'
                  }`}
              >
                {fb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
          <div>
            <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-[0.2em]">Overall Rating</label>
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Sentiment Analysis Metric</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="group"
                >
                  <span className={`text-3xl transition-all duration-200 ${star <= formData.rating ? 'grayscale-0 scale-110 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'grayscale opacity-20 hover:opacity-40'
                    }`}>
                    ⭐
                  </span>
                </button>
              ))}
            </div>
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
              {formData.rating === 1 && 'Critical'}
              {formData.rating === 2 && 'Suboptimal'}
              {formData.rating === 3 && 'Sufficient'}
              {formData.rating === 4 && 'Optimal'}
              {formData.rating === 5 && 'Exemplary'}
            </span>
          </div>
        </div>

        {/* Title & Message */}
        <div className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label htmlFor="title" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Brief Summary
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Primary objective of this report..."
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium placeholder-slate-600"
              maxLength={100}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="message" className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
              Detailed Intelligence
            </label>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your technical experience or observations in detail..."
                rows={5}
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium resize-none placeholder-slate-600 shadow-inner"
                maxLength={1000}
              />
              <div className="absolute bottom-4 right-4">
                <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${formData.message.length > 900 ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-slate-600'
                  }`}>
                  {formData.message.length} / 1000
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Anonymity & Privacy */}
        <div className="relative z-10 flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/10 rounded-2xl group/check transition-all hover:bg-blue-500/10">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="isAnonymous"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
              className="w-5 h-5 appearance-none border-2 border-white/20 rounded-md checked:bg-blue-500 checked:border-blue-500 transition-all cursor-pointer"
            />
            {formData.isAnonymous && (
              <svg className="w-3 h-3 text-white absolute left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <label htmlFor="isAnonymous" className="text-xs text-slate-300 cursor-pointer select-none font-medium">
            <span className="font-black text-white uppercase tracking-wider mr-2">Stealth Mode?</span>
            <span className="text-slate-500 italic">Identity parameters will be obfuscated from administration.</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative z-10 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-slate-600 text-white font-black py-5 rounded-xl transition-all shadow-2xl shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-4 group uppercase text-xs tracking-[0.2em]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Transmitting...</span>
            </>
          ) : (
            <>
              <span>Transmit Response</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default SubmitFeedback;
