import React from 'react';

const IntroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-[#0B1120] pt-40 pb-20 px-4 md:px-8 min-h-screen flex items-center" id="home"
      style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #172554 0%, #0B1120 70%)' }}>

      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
        <div className="text-center lg:text-left space-y-10 animate-fade-in-left">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="animate-pulse">✨</span> Sustainability Protocol v2.0
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] italic">
            Welcome to <br />
            <span className="text-blue-500 border-b-8 border-blue-600/30">
              Solar Aid
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl font-medium leading-relaxed">
            Empowering rural households with clean, affordable, and easy-to-understand solar energy solutions through tactical data analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
            <a
              href="#features"
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-blue-600/20 hover:bg-blue-500 hover:-translate-y-1 hover:shadow-blue-500/40 flex items-center justify-center gap-3 group"
            >
              Initialize Tour <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#contact"
              className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 flex items-center justify-center backdrop-blur-md shadow-lg"
            >
              Contact Support
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center lg:justify-end animate-fade-in-right">
          <div className="relative group">
            {/* Massive Ambient Glow */}
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[120px] scale-150 animate-pulse-slow opacity-60 group-hover:bg-blue-400/30 transition-colors" />

            <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] rounded-[3.5rem] bg-slate-900 border border-white/10 p-1 flex justify-center items-center shadow-2xl overflow-hidden backdrop-blur-xl group-hover:border-white/20 transition-all duration-500">
              {/* Internal decorative elements */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />

              <div className="relative z-10 text-[140px] md:text-[240px] animate-spin-slow drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] cursor-default select-none transform group-hover:scale-110 transition-transform duration-700">
                ☀️
              </div>

              {/* Tactical Scanning Line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/30 shadow-[0_0_15px_rgba(96,165,250,0.5)] animate-scan pointer-events-none"></div>
            </div>

            {/* Floating Tactical Info Cards */}
            <div className="absolute -bottom-10 -left-10 bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl animate-float [animation-delay:-1.5s] border border-white/10 max-w-[240px] group-hover:border-blue-500/30 transition-colors">
              <div className="text-blue-400 text-3xl mb-4 bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center border border-blue-500/20">🌿</div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Efficiency Rating</p>
              <p className="text-xl font-black text-white italic tracking-tighter leading-none">100% CLEAN ENERGY</p>
              <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-400 animate-shimmer"></div>
              </div>
            </div>

            <div className="absolute -top-10 -right-10 bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2rem] shadow-2xl animate-float [animation-delay:-0.5s] border border-white/10 hidden md:block group-hover:border-indigo-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-2xl border border-indigo-500/20">📊</div>
                <div>
                  <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Status</p>
                  <p className="text-sm font-black text-white uppercase tracking-tighter">OPERATIONAL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroBanner;
