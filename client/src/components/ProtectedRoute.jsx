import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// allowedRoles: array of roles that can access the route
export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem('token')
  const userRaw = localStorage.getItem('user')
  let user = null
  try { user = userRaw ? JSON.parse(userRaw) : null } catch(e) { user = null }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // unauthorized for this role
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
