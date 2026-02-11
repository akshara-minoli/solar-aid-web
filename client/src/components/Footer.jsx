import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-800 to-gray-600 text-white py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl mb-4 flex items-center gap-2 justify-center md:justify-start">
              <span className="text-3xl">☀️</span> Solar Aid
            </h3>
            <p className="leading-relaxed text-gray-300 mb-2">Empowering rural communities with clean, affordable solar energy solutions.</p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl mb-4 text-yellow-200">Quick Links</h4>
            <ul className="list-none p-0">
              <li className="mb-3">
                <a href="#home" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  Home
                </a>
              </li>
              <li className="mb-3">
                <a href="#about" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  About Us
                </a>
              </li>
              <li className="mb-3">
                <a href="#features" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  Features
                </a>
              </li>
              <li className="mb-3">
                <a href="#contact" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl mb-4 text-yellow-200">Resources</h4>
            <ul className="list-none p-0">
              <li className="mb-3">
                <a href="#features" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  Learn Solar
                </a>
              </li>
              <li className="mb-3">
                <a href="#signin" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  Sign In
                </a>
              </li>
              <li className="mb-3">
                <a href="#login" className="text-gray-300 transition-all duration-300 ease-in-out hover:text-yellow-200 hover:translate-x-1 inline-block">
                  Login
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-lg md:text-xl mb-4 text-yellow-200">Contact Info</h4>
            <p className="text-gray-300 mb-2">📧 info@solaraid.com</p>
            <p className="text-gray-300 mb-2">📱 +1 (555) 123-4567</p>
            <p className="text-gray-300 mb-2">📍 University Campus</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-gray-300 mb-2">&copy; {currentYear} Solar Aid. All rights reserved. | A University Project</p>
          <p className="text-sm text-gray-400">Made with 💚 for rural communities</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
