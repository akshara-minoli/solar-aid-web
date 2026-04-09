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
        mx-auto my-6 max-w-6xl px-4 md:px-8
        ${isMenuOpen ? 'block' : 'flex justify-center'}
      `}>
        <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl px-6 py-3 flex justify-between items-center transition-all duration-300 relative overflow-hidden">
          {/* Subtle Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="flex items-center gap-3 text-2xl font-black cursor-pointer group relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-black text-lg">SA</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black text-white tracking-tighter">SOLAR AID</span>
              <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-0.5">Sustainability</span>
            </div>
          </div>

          <button
            className="md:hidden text-blue-400 text-3xl focus:outline-none transition-transform duration-300 relative z-10"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          <ul className={`
            flex list-none gap-2 items-center m-0 p-0 relative z-10
            md:flex
            ${isMenuOpen
              ? 'flex-col absolute top-20 left-0 right-0 bg-slate-900/95 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 gap-4 animate-fade-in-up md:static md:bg-transparent md:border-none md:p-0 md:flex-row'
              : 'max-md:hidden'
            }
          `}>
            {['Home', 'About', 'Features', 'Contact'].map((item) => (
              <li key={item} className="max-md:w-full">
                <a
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 font-black uppercase tracking-widest text-[10px] transition-all duration-300 py-2.5 px-5 rounded-xl hover:text-white hover:bg-white/5 block text-center"
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="max-md:w-full md:ml-4">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-slate-300 font-black uppercase tracking-widest text-[10px] transition-all duration-300 py-2.5 px-6 rounded-xl hover:text-white hover:bg-white/10 block text-center border border-white/5"
              >
                Login
              </Link>
            </li>
            <li className="max-md:w-full md:ml-2">
              <Link
                to="/signin"
                onClick={() => setIsMenuOpen(false)}
                className="bg-blue-600 text-white py-2.5 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 block text-center"
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
