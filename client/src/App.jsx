import React, { useState, useEffect } from 'react'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash === 'login') {
        setCurrentPage('login');
      } else if (hash === 'signin') {
        setCurrentPage('signin');
      } else if (hash === 'admin') {
        setCurrentPage('admin');
      } else if (hash === 'admin-dashboard') {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Render the appropriate page based on currentPage
  if (currentPage === 'login') {
    return <Login />;
  } else if (currentPage === 'signin') {
    return <SignIn />;
  } else if (currentPage === 'admin') {
    return <AdminLogin />;
  } else if (currentPage === 'admin-dashboard') {
    return <AdminDashboard />;
  } else {
    return <Welcome />;
  }
}

export default App
