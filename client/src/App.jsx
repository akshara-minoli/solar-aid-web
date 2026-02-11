import { useState, useEffect } from 'react'
<<<<<<< Updated upstream
=======
import TailwindTest from './components/TailwindTest'
>>>>>>> Stashed changes
import Welcome from './pages/Welcome'
import Login from './pages/Login'
import SignIn from './pages/SignIn'
import UserDashboard from './pages/UserDashboard'
import AddHousehold from './pages/AddHousehold'
import ViewHousehold from './pages/ViewHousehold'
import AddAppliance from './pages/AddAppliance'
import ViewAppliances from './pages/ViewAppliances'
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
      } else if (hash === 'dashboard') {
        setCurrentPage('dashboard');
      } else if (hash === 'add-household') {
        setCurrentPage('add-household');
      } else if (hash === 'view-household') {
        setCurrentPage('view-household');
      } else if (hash === 'add-appliance') {
        setCurrentPage('add-appliance');
      } else if (hash === 'view-appliances') {
        setCurrentPage('view-appliances');
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
    return (
      <>
        <TailwindTest />
        <Login />
      </>
    );
  } else if (currentPage === 'signin') {
<<<<<<< Updated upstream
    return <SignIn />;
  } else if (currentPage === 'dashboard') {
    return <UserDashboard />;
  } else if (currentPage === 'add-household') {
    return <AddHousehold />;
  } else if (currentPage === 'view-household') {
    return <ViewHousehold />;
  } else if (currentPage === 'add-appliance') {
    return <AddAppliance />;
  } else if (currentPage === 'view-appliances') {
    return <ViewAppliances />;
=======
    return (
      <>
        <TailwindTest />
        <SignIn />
      </>
    );
  } else if (currentPage === 'dashboard') {
    return (
      <>
        <TailwindTest />
        <UserDashboard />
      </>
    );
  } else if (currentPage === 'add-household') {
    return (
      <>
        <TailwindTest />
        <AddHousehold />
      </>
    );
  } else if (currentPage === 'view-household') {
    return (
      <>
        <TailwindTest />
        <ViewHousehold />
      </>
    );
  } else if (currentPage === 'add-appliance') {
    return (
      <>
        <TailwindTest />
        <AddAppliance />
      </>
    );
  } else if (currentPage === 'view-appliances') {
    return (
      <>
        <TailwindTest />
        <ViewAppliances />
      </>
    );
>>>>>>> Stashed changes
  } else {
    return (
      <>
        <TailwindTest />
        <Welcome />
      </>
    );
  }
}

export default App
