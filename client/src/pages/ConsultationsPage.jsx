import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api'
import AdminProfileMenu from '../components/AdminProfileMenu'

export default function ConsultationsPage() {
  const [consults, setConsults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    api.get('/api/admin/consultations')
      .then(res => setConsults(res.data.consultations || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pl-64 relative bg-[#0B1120] text-slate-200 h-screen overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>
        <AdminProfileMenu />
        <main className="p-8 pt-24 max-w-7xl w-full mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-wide">Manage Consultations</h1>
              <p className="text-slate-400 text-sm mt-1">View user consultation requests</p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
            {loading ? (
              <div className="flex justify-center p-10">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 border-t-blue-500 animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 text-sm tracking-wider uppercase">
                      <th className="p-4 font-semibold">User</th>
                      <th className="p-4 font-semibold">Contact</th>
                      <th className="p-4 font-semibold">Message</th>
                      <th className="p-4 font-semibold">Date</th>
                      <th className="p-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consults.map((c, i) => (
                      <tr key={c.id || i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{c.userName}</td>
                        <td className="p-4 text-slate-300">{c.contactInfo}</td>
                        <td className="p-4 text-slate-300 max-w-xs truncate" title={c.message}>{c.message}</td>
                        <td className="p-4 text-slate-400 text-sm">{new Date(c.date).toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded uppercase tracking-wide
                            ${c.status === 'pending' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              c.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}
                          `}>
                            {c.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {consults.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">No consultations found.</td>
                      </tr>
                    )}
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
