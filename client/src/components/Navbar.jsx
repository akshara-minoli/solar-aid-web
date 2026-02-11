import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">☀️</span>
          <span className="logo-text">Solar Aid</span>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a></li>
          <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact Us</a></li>
          <li><a href="#signin" className="btn-signin" onClick={() => setIsMenuOpen(false)}>Sign In</a></li>
          <li><a href="#login" className="btn-login" onClick={() => setIsMenuOpen(false)}>Login</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
