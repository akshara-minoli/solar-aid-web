import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import UserDashboard from './pages/UserDashboard'
import UserProfile from './pages/UserProfile'
import AddHousehold from './pages/AddHousehold'
import ViewHousehold from './pages/ViewHousehold'
import ViewConsultations from './pages/ViewConsultations'

// Admin pages
import AdminDashboard from './pages/AdminDashboard'
import UsersPage from './pages/UsersPage'
import ConsultationsPage from './pages/ConsultationsPage'
import ProductsPage from './pages/ProductsPage'

import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* User protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["user","admin"]} /> }>
          <Route path="/home" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/view-household" element={<ViewHousehold />} />
          <Route path="/add-household" element={<AddHousehold />} />
          <Route path="/consultations" element={<ViewConsultations />} />
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} /> }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/consultations" element={<ConsultationsPage />} />
          <Route path="/admin/products" element={<ProductsPage />} />
        </Route>

        {/* Legacy / convenience redirects */}
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
