import React, { useState, useEffect } from 'react'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import UserDashboard from './pages/UserDashboard'
import AddHousehold from './pages/AddHousehold'
import ViewHousehold from './pages/ViewHousehold'

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
      } else if (hash === 'forgot') {
        setCurrentPage('forgot');
      } else if (hash === 'dashboard') {
        setCurrentPage('dashboard');
      } else if (hash === 'add-household') {
        setCurrentPage('add-household');
      } else if (hash === 'view-household') {
        setCurrentPage('view-household');
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
  } else if (currentPage === 'forgot') {
    return <ForgotPassword />;
  } else if (currentPage === 'dashboard') {
    return <UserDashboard />;
  } else if (currentPage === 'add-household') {
    return <AddHousehold />;
  } else if (currentPage === 'view-household') {
    return <ViewHousehold />;
  } else {
    return <Welcome />;
  }
}

export default App
