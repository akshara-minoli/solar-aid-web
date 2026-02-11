import React, { useState, useEffect } from 'react'
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import UserDashboard from './pages/UserDashboard'
import AddHousehold from './pages/AddHousehold'
import ViewHousehold from './pages/ViewHousehold'
import SolarReports from './pages/SolarReports'
import ViewConsultations from './pages/ViewConsultations'
import UserProfile from './pages/UserProfile'
import SolarCalculator from './pages/SolarCalculator'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple hash-based routing
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      // Split hash to handle query parameters
      const hashBase = hash.split('?')[0];
      
      if (hashBase === 'login') {
        setCurrentPage('login');
      } else if (hashBase === 'signin') {
        setCurrentPage('signin');
      } else if (hashBase === 'forgot') {
        setCurrentPage('forgot');
      } else if (hashBase === 'dashboard') {
        setCurrentPage('dashboard');
      } else if (hashBase === 'add-household') {
        setCurrentPage('add-household');
      } else if (hashBase === 'view-household') {
        setCurrentPage('view-household');
      } else if (hashBase === 'solar-reports') {
        setCurrentPage('solar-reports');
      } else if (hashBase === 'consultations') {
        setCurrentPage('consultations');
      } else if (hashBase === 'profile') {
        setCurrentPage('profile');
      } else if (hashBase === 'solar-calculator') {
        setCurrentPage('solar-calculator');
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
  } else if (currentPage === 'solar-reports') {
    return <SolarReports />;
  } else if (currentPage === 'consultations') {
    return <ViewConsultations />;
  } else if (currentPage === 'profile') {
    return <UserProfile />;
  } else if (currentPage === 'solar-calculator') {
    return <SolarCalculator />;
  } else {
    return <Welcome />;
  }
}

export default App
