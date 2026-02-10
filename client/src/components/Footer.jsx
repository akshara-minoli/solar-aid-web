import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>
              <span className="footer-logo">☀️</span> Solar Aid
            </h3>
            <p>Empowering rural communities with clean, affordable solar energy solutions.</p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#features">Learn Solar</a></li>
              <li><a href="#contact">Cost Estimation</a></li>
              <li><a href="#signin">Sign In</a></li>
              <li><a href="#login">Login</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📧 info@solaraid.com</p>
            <p>📱 +1 (555) 123-4567</p>
            <p>📍 University Campus</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Solar Aid. All rights reserved. | A University Project</p>
          <p className="footer-note">Made with 💚 for rural communities</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
