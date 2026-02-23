import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] border-t border-white/5 text-slate-400 py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-black text-lg">SA</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-white tracking-tighter">SOLAR AID</span>
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-0.5">Sustainability</span>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed max-w-xs">
              A tactical initiative empowering rural communities with clean, affordable, and high-efficiency solar energy protocols.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Navigation Registry</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Features', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-tight flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-400 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Asset Resources</h4>
            <ul className="space-y-4">
              <li>
                <a href="#features" className="text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-tight flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-400 transition-colors"></span>
                  Protocol Training
                </a>
              </li>
              <li>
                <a href="/signin" className="text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-tight flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-400 transition-colors"></span>
                  Account Initialization
                </a>
              </li>
              <li>
                <a href="/login" className="text-sm font-bold hover:text-blue-400 transition-colors uppercase tracking-tight flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/20 group-hover:bg-blue-400 transition-colors"></span>
                  Terminal Access
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-8">Contact Vector</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-lg group-hover:border-blue-500/20 transition-colors">📧</div>
                <p className="text-sm font-black text-white uppercase tracking-tight">info@solaraid.com</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-lg group-hover:border-blue-500/20 transition-colors">📍</div>
                <p className="text-sm font-black text-white uppercase tracking-tight">University Campus, HQ</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            &copy; {currentYear} SOLAR AID PROTOCOL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">
              A University sustainability Project
            </p>
            <div className="h-4 w-px bg-white/5"></div>
            <p className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest leading-none">
              v2.0.4-TACTICAL
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
