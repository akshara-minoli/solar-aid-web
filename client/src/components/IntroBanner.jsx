import React from 'react';

const IntroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-[#fafaf9] pt-32 pb-20 px-4 md:px-8 min-h-screen flex items-center" id="home">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="text-center lg:text-left space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
            <span>✨</span> Simple & Free Solar Help
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Welcome to <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
              Solar Aid
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl font-medium leading-relaxed">
            Empowering rural households with clean, affordable, and easy-to-understand solar energy solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <a
              href="#features"
              className="px-8 py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2"
            >
              Start Learning Now <span>→</span>
            </a>
            <a
              href="#contact"
              className="px-8 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg transition-all duration-300 hover:border-orange-200 hover:bg-orange-50 hover:-translate-y-1 flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="flex justify-center items-center lg:justify-end">
          <div className="relative">
            {/* Animated Sun Glow */}
            <div className="absolute inset-0 bg-yellow-200 rounded-full blur-3xl scale-125 animate-pulse-slow opacity-60" />

            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-[3rem] bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-400 p-1 flex justify-center items-center shadow-[0_32px_64px_-16px_rgba(251,146,60,0.3)] animate-float overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
              <span className="text-[120px] md:text-[220px] animate-spin-slow drop-shadow-2xl">☀️</span>
            </div>

            {/* Floating Info Cards */}
            <div className="absolute -bottom-6 -left-6 md:-bottom-10 md:-left-10 bg-white p-6 rounded-2xl shadow-2xl animate-float [animation-delay:-1s] border border-gray-50 max-w-[200px]">
              <div className="text-emerald-500 text-2xl mb-1">🌿</div>
              <p className="text-sm font-bold text-gray-900">100% Clean Energy</p>
              <p className="text-xs text-gray-500">Free from nature</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroBanner;
