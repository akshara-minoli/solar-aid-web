import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Users', path: '/admin/users', icon: '👥' },
    { name: 'Households', path: '/admin/households', icon: '🏠' },
    { name: 'Consultations', path: '/admin/consultations', icon: '🩺' },
    { name: 'Products', path: '/admin/products', icon: '☀️' },
    { name: 'Service Requests', path: '/admin/requests', icon: '🛠️' },
    { name: 'Technicians', path: '/admin/technicians', icon: '🔧' },
    { name: 'Maintenance', path: '/admin/maintenance-schedules', icon: '📅' },
    { name: 'Education', path: '/admin/education', icon: '📚' },
    { name: 'Notifications', path: '/admin/notifications', icon: '🔔' },
    { name: 'Feedback', path: '/admin/feedback', icon: '💬' },
  ]

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-[#060B14] border-r border-white/5 flex flex-col shadow-2xl z-50 overflow-hidden">

      {/* ── Brand Header ─────────────────────────────────────── */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="text-white font-bold text-sm">SA</span>
        </div>
        <h2 className="font-bold text-sm text-white tracking-wide leading-tight">Solar Aid<br />Admin Panel</h2>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 px-3">
          Administration
        </div>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${isActive
                    ? 'bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {item.icon}
                  </span>
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Footer Action ────────────────────────────────────── */}
      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 group"
        >
          <span className="text-base group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100">🚪</span>
          Sign Out
        </button>
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
    </aside>
  )
}
