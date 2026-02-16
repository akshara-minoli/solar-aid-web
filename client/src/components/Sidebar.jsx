import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <h2 className="font-bold text-xl">Solar Aid Admin</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li><Link to="/admin/dashboard" className="block p-2 rounded hover:bg-gray-100">Dashboard</Link></li>
          <li><Link to="/admin/users" className="block p-2 rounded hover:bg-gray-100">Users</Link></li>
          <li><Link to="/admin/consultations" className="block p-2 rounded hover:bg-gray-100">Consultations</Link></li>
          <li><Link to="/admin/products" className="block p-2 rounded hover:bg-gray-100">Products</Link></li>
          <li><Link to="/admin/technicians" className="block p-2 rounded hover:bg-gray-100">Technicians</Link></li>
          <li><Link to="/admin/maintenance-schedules" className="block p-2 rounded hover:bg-gray-100">Maintenance Schedules</Link></li>
        </ul>
      </nav>
      <div className="absolute bottom-6 left-6">
        <button onClick={logout} className="text-red-500 font-bold">Logout</button>
      </div>
    </aside>
  )
}
