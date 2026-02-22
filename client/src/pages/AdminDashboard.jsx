import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    consultations: 0,
    products: 0,
    education: 0,
    notifications: 0,
    feedback: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // Existing stats
        try {
          const users = await api.get('/api/admin/users')
          setStats(s => ({ ...s, users: users.data.count || 0 }))
        } catch (e) {
          console.log('Users endpoint not available')
        }

        try {
          const consultations = await api.get('/api/admin/consultations')
          setStats(s => ({ ...s, consultations: consultations.data.count || 0 }))
        } catch (e) {
          console.log('Consultations endpoint not available')
        }

        try {
          const products = await api.get('/api/admin/products')
          setStats(s => ({ ...s, products: products.data.count || 0 }))
        } catch (e) {
          console.log('Products endpoint not available')
        }

        // Member 4: Education stats
        try {
          const res = await api.get('/api/education')
          const eduCount = res.data.data ? res.data.data.length : (Array.isArray(res.data) ? res.data.length : (res.data.count || 0))
          setStats(s => ({ ...s, education: eduCount }))
        } catch (e) {
          console.log('Education endpoint error:', e.message)
        }

        try {
          const res = await api.get('/api/notifications/all')
          const notifCount = res.data.data ? res.data.data.length : (Array.isArray(res.data) ? res.data.length : (res.data.count || 0))
          setStats(s => ({ ...s, notifications: notifCount }))
        } catch (e) {
          console.log('Notifications endpoint error:', e.message)
        }

        try {
          const res = await api.get('/api/feedback')
          const feedbackCount = res.data.data ? res.data.data.length : (Array.isArray(res.data) ? res.data.length : (res.data.count || 0))
          setStats(s => ({ ...s, feedback: feedbackCount }))
        } catch (e) {
          console.log('Feedback endpoint error:', e.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAllStats()
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 pl-64">
        <Navbar title="Admin Dashboard" />
        <main className="p-6 pt-36">
          {loading && (
            <div className="text-center py-8">
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          )}

          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded shadow">
                  <h4 className="font-bold text-sm text-gray-500">Total Users</h4>
                  <div className="text-3xl font-bold">{stats.users}</div>
                </div>
                <div className="p-6 bg-white rounded shadow">
                  <h4 className="font-bold text-sm text-gray-500">Total Consultations</h4>
                  <div className="text-3xl font-bold">{stats.consultations}</div>
                </div>
                <div className="p-6 bg-white rounded shadow">
                  <h4 className="font-bold text-sm text-gray-500">Total Products</h4>
                  <div className="text-3xl font-bold">{stats.products}</div>
                </div>
              </div>

              {/* Member 4 Stats */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-600">Education & Communication</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50 rounded shadow border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-sm text-blue-600">📚 Education Content</h4>
                    <div className="text-3xl font-bold text-blue-700 mt-2">{stats.education}</div>
                    <p className="text-xs text-blue-500 mt-2">items created</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded shadow border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-sm text-blue-600">🔔 Notifications</h4>
                    <div className="text-3xl font-bold text-blue-700 mt-2">{stats.notifications}</div>
                    <p className="text-xs text-blue-500 mt-2">sent</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded shadow border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-sm text-blue-600">💬 Feedback</h4>
                    <div className="text-3xl font-bold text-blue-700 mt-2">{stats.feedback}</div>
                    <p className="text-xs text-blue-500 mt-2">received</p>
                  </div>
                </div>
              </div>

              <section className="mt-8 bg-white p-6 rounded shadow">
                <h3 className="font-bold mb-2">Quick Links</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <a href="/admin/education" className="p-4 bg-blue-50 text-blue-600 rounded text-center font-bold hover:bg-blue-100 transition">📚 Education</a>
                  <a href="/admin/notifications" className="p-4 bg-blue-50 text-blue-600 rounded text-center font-bold hover:bg-blue-100 transition">🔔 Notifications</a>
                  <a href="/admin/feedback" className="p-4 bg-blue-50 text-blue-600 rounded text-center font-bold hover:bg-blue-100 transition">💬 Feedback</a>
                  <a href="/dashboard" className="p-4 bg-emerald-50 text-emerald-600 rounded text-center font-bold hover:bg-emerald-100 transition">👤 Dashboard</a>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
