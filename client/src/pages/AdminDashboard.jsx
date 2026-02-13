import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, consultations: 0, products: 0 })

  useEffect(() => {
    api.get('/api/admin/users')
      .then(res => setStats(s => ({ ...s, users: res.data.count })))
      .catch(() => {})

    api.get('/api/admin/consultations')
      .then(res => setStats(s => ({ ...s, consultations: res.data.count })))
      .catch(() => {})

    api.get('/api/admin/products')
      .then(res => setStats(s => ({ ...s, products: res.data.count })))
      .catch(() => {})
  }, [])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 pl-64">
        <Navbar title="Admin Dashboard" />
        <main className="p-6 pt-28">
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

          <section className="mt-8 bg-white p-6 rounded shadow">
            <h3 className="font-bold mb-2">Recent Activity</h3>
            <p className="text-sm text-gray-600">Basic audit and recent changes will appear here.</p>
          </section>
        </main>
      </div>
    </div>
  )
}
