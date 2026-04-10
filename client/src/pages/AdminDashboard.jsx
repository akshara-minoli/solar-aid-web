import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    households: 0,
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
        setLoading(true);
        // Use the new consolidated stats endpoint
        const response = await api.get('/api/admin/stats');
        if (response.data.success) {
          const { stats: s } = response.data;
          setStats(prev => ({
            ...prev,
            users: s.users,
            households: s.households,
            consultations: s.consultations,
            products: s.products,
            technicians: s.technicians,
            requests: s.requests,
            schedules: s.schedules
          }));
        }

        // Still fetch Member 4 stats individually as they are in separate modules
        try {
          const res = await api.get('/api/education');
          const eduCount = res.data.data ? res.data.data.length : (Array.isArray(res.data) ? res.data.length : (res.data.count || 0));
          setStats(s => ({ ...s, education: eduCount }));
        } catch (e) { console.log('Education endpoint error') }

        try {
          const res = await api.get('/api/notifications/all');
          const notifCount = res.data.data ? res.data.data.length : (Array.isArray(res.data) ? res.data.length : (res.data.count || 0));
          setStats(s => ({ ...s, notifications: notifCount }));
        } catch (e) { console.log('Notifications endpoint error') }

        try {
          const res = await api.get('/api/feedback');
          const feedbackCount = res.data.data ? res.data.data.length : (Array.isArray(res.data) ? res.data.length : (res.data.count || 0));
          setStats(s => ({ ...s, feedback: feedbackCount }));
        } catch (e) { console.log('Feedback endpoint error') }

      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  const statItems = [
    { label: 'Users', value: stats.users, icon: '👥', color: 'text-blue-400' },
    { label: 'Households', value: stats.households, icon: '🏠', color: 'text-orange-400' },
    { label: 'Service Reqs', value: stats.requests, icon: '🔧', color: 'text-rose-400' },
    { label: 'Technicians', value: stats.technicians, icon: '🛠️', color: 'text-emerald-400' },
    { label: 'Education', value: stats.education, icon: '📚', color: 'text-teal-400' },
    { label: 'Feedback', value: stats.feedback, icon: '💬', color: 'text-blue-300' },
    { label: 'Notices', value: stats.notifications, icon: '🔔', color: 'text-sky-400' },
  ]

  const quickLinks = [
    { href: '/admin/households', label: 'Manage Households', icon: '🏠' },
    { href: '/admin/education', label: 'Manage Education', icon: '📚' },
    { href: '/admin/notifications', label: 'Send Notifications', icon: '🔔' },
    { href: '/admin/feedback', label: 'View Feedback', icon: '💬' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-6 pt-24 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">

              {/* Header Title Layer */}
              <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-5 shadow-lg">
                <div>
                  <h1 className="text-2xl font-semibold text-white tracking-wide">System Overview</h1>
                  <p className="text-slate-400 text-sm mt-1">Live metrics and administrative controls</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                  System Online
                </div>
              </div>

              {/* Stats Grid - Compact Space */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {statItems.map((item, idx) => (
                  <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 flex flex-col justify-between hover:bg-white/10 transition duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${item.color}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lower Section Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Activity / System Log Concept (Glassmorphism List) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
                  <h2 className="text-base font-medium text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                    <span className="text-blue-400">⚡</span> Activity Summary
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="flex gap-3 items-center">
                        <span className="bg-blue-500/20 text-blue-400 p-2 rounded-md">👥</span>
                        <span className="text-slate-300">Total active users</span>
                      </div>
                      <span className="font-semibold text-white">{stats.users}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="flex gap-3 items-center">
                        <span className="bg-orange-500/20 text-orange-400 p-2 rounded-md">🏠</span>
                        <span className="text-slate-300">Household profiles</span>
                      </div>
                      <span className="font-semibold text-white">{stats.households}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="flex gap-3 items-center">
                        <span className="bg-cyan-500/20 text-cyan-400 p-2 rounded-md">🩺</span>
                        <span className="text-slate-300">Consultations booked</span>
                      </div>
                      <span className="font-semibold text-white">{stats.consultations}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                      <div className="flex gap-3 items-center">
                        <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-md">☀️</span>
                        <span className="text-slate-300">Products deployed</span>
                      </div>
                      <span className="font-semibold text-white">{stats.products}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions (Transparent Glass buttons) */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
                  <h2 className="text-base font-medium text-white mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                    <span className="text-teal-400">🚀</span> Quick Actions
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {quickLinks.map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.href}
                        className="flex flex-col items-center justify-center p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-blue-500/20 hover:border-blue-500/30 transition-all text-center group"
                      >
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</span>
                        <span className="text-xs font-medium text-slate-300 group-hover:text-blue-200">{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  )
}
