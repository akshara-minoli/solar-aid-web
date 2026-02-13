import React, { useState } from 'react';
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className={`
        mx-auto my-4 max-w-6xl px-4 md:px-8
        ${isMenuOpen ? 'block' : 'flex justify-center'}
      `}>
        <div className="w-full bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-full px-6 py-3 flex justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-2 text-2xl font-bold cursor-pointer hover:scale-105 transition-transform duration-200">
            <span className="text-3xl animate-pulse-slow">☀️</span>
            <span className="text-xl bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Solar Aid
            </span>
          </div>

          <button
            className="md:hidden text-orange-500 text-3xl focus:outline-none hover:rotate-90 transition-transform duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <ul className={`
            flex list-none gap-2 items-center m-0 p-0
            md:flex
            ${isMenuOpen
              ? 'flex-col absolute top-20 left-4 right-4 bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 gap-4 animate-slide-up'
              : 'max-md:hidden'
            }
          `}>
            {['Home', 'About', 'Features', 'Contact'].map((item) => (
              <li key={item} className="max-md:w-full">
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 font-semibold transition-all duration-300 py-2 px-5 rounded-full hover:bg-orange-500 hover:text-white block text-center"
                >
                  {item}
                </a>
              </li>
            ))}
                        <li className="max-md:w-full md:ml-4">
                          <Link
                            to="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-700 font-bold transition-all duration-300 py-2 px-6 rounded-full hover:bg-gray-100 block text-center border-2 border-transparent hover:border-orange-100"
                          >
                            Login
                          </Link>
                        </li>
                        <li className="max-md:w-full md:ml-2">
                          <Link
                            to="/signin"
                            onClick={() => setIsMenuOpen(false)}
                            className="bg-orange-500 text-white py-2 px-6 rounded-full font-bold transition-all duration-300 hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 block text-center"
                          >
                            Get Started
                          </Link>
                        </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
