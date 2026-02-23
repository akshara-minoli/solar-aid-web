import React from 'react';

const About = () => {
  return (
    <section className="py-32 px-4 md:px-8 bg-[#0B1120] relative overflow-hidden" id="about">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[4rem] p-10 md:p-20 border border-white/10 shadow-2xl overflow-hidden relative group">
          {/* Card Accent Glow */}
          <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="relative order-2 lg:order-1 animate-fade-in-left">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px] scale-110 animate-pulse-slow" />
              <div className="relative w-full aspect-square rounded-[3.5rem] bg-slate-900 border border-white/10 flex justify-center items-center shadow-2xl group-hover:border-blue-500/30 transition-all duration-700 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
                <span className="text-[140px] md:text-[200px] drop-shadow-[0_0_50px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform duration-700 cursor-default">🌍</span>

                {/* Tactical Stats Overlay */}
                <div className="absolute -top-6 -right-6 bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 hidden md:block group-hover:border-blue-500/30 transition-colors">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Mission Directive</p>
                  <p className="text-sm font-black text-white italic tracking-tighter uppercase">100% EDUCATIONAL</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-10 animate-fade-in-right">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  Internal Protocol
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                  About <span className="text-blue-500 underline decoration-blue-600/30">Solar Aid</span>
                </h2>
                <p className="text-lg md:text-xl text-blue-400 font-black italic tracking-tight leading-none uppercase">
                  A non-technical platform dedicated to rural empowerment.
                </p>
              </div>

              <div className="space-y-6 text-slate-400 font-medium leading-relaxed max-w-xl">
                <p>
                  Solar Aid is a strategic initiative developed to simplify the sustainability lifecycle. We remove the technical jargon and provide clear, actionable tactical guidance for household energy independence.
                </p>
                <p>
                  Whether you're initializing cost estimates or seeking step-by-step installation protocols, we enable a brighter, cleaner future for your household.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {[
                  'Simple language for all',
                  'Free expert consultation',
                  'Step-by-step guidance',
                  'Sustainable focused'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 text-white font-black uppercase tracking-tight text-xs group/item">
                    <span className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all duration-300">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
