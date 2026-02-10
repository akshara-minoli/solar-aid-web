import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-br from-orange-400 to-orange-300 shadow-lg sticky top-0 z-50 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-8">
        <div className="flex items-center gap-2 text-2xl font-bold text-white">
          <span className="text-3xl">☀️</span>
          <span className="text-xl">Solar Aid</span>
        </div>
        
        <button 
          className="md:hidden text-white text-3xl focus:outline-none hover:text-orange-100 transition-colors duration-200"
          onClick={toggleMenu}
        >
          ☰
        </button>

        <ul className={`
          flex list-none gap-8 items-center m-0 p-0
          md:flex
          ${isMenuOpen 
            ? 'absolute top-full left-0 right-0 bg-gradient-to-br from-orange-400 to-orange-300 flex-col gap-0 py-4 max-h-96 overflow-hidden transition-all duration-300 ease-in-out' 
            : 'max-md:absolute max-md:top-full max-md:left-0 max-md:right-0 max-md:bg-gradient-to-br max-md:from-orange-400 max-md:to-orange-300 max-md:flex-col max-md:gap-0 max-md:py-4 max-md:max-h-0 max-md:overflow-hidden max-md:transition-all max-md:duration-300 max-md:ease-in-out'
          }
        `}>
          <li className="max-md:w-full max-md:text-center max-md:py-2">
            <a 
              href="#home" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white font-medium transition-all duration-300 ease-in-out py-2 px-4 rounded-md hover:bg-white/20 hover:-translate-y-0.5 block"
            >
              Home
            </a>
          </li>
          <li className="max-md:w-full max-md:text-center max-md:py-2">
            <a 
              href="#about" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white font-medium transition-all duration-300 ease-in-out py-2 px-4 rounded-md hover:bg-white/20 hover:-translate-y-0.5 block"
            >
              About Us
            </a>
          </li>
          <li className="max-md:w-full max-md:text-center max-md:py-2">
            <a 
              href="#contact" 
              onClick={() => setIsMenuOpen(false)}
              className="text-white font-medium transition-all duration-300 ease-in-out py-2 px-4 rounded-md hover:bg-white/20 hover:-translate-y-0.5 block"
            >
              Contact Us
            </a>
          </li>
          <li className="max-md:w-full max-md:text-center max-md:py-2">
            <a 
              href="#signin" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-white text-orange-400 py-3 px-6 rounded-full font-bold transition-all duration-300 ease-in-out hover:bg-gray-100 hover:-translate-y-1 hover:shadow-lg block"
            >
              Sign In
            </a>
          </li>
          <li className="max-md:w-full max-md:text-center max-md:py-2">
            <a 
              href="#login" 
              onClick={() => setIsMenuOpen(false)}
              className="bg-white text-orange-400 py-3 px-6 rounded-full font-bold transition-all duration-300 ease-in-out hover:bg-gray-100 hover:-translate-y-1 hover:shadow-lg block"
            >
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
