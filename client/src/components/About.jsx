import React from 'react';

const About = () => {
  return (
    <section className="py-24 px-4 md:px-8 bg-[#fafaf9]" id="about">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-gray-200/50 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border border-gray-50">
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 scale-110" />
            <div className="relative w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-emerald-500/20">
              <img
                src="/src/assets/photo/roof_suitability.png"
                alt="Solar Suitable Home"
                className="w-full h-full object-cover"
              />

              {/* Decorative Stats Cards */}
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 hidden md:block">
                <p className="text-sm font-bold text-gray-900">Project Mission</p>
                <p className="text-xs text-emerald-500 font-bold">100% Educational</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">About Solar Aid</h2>
              <p className="text-xl md:text-2xl text-emerald-600 font-bold leading-relaxed">
                A non-technical platform designed dedicated to rural empowerment.
              </p>
            </div>

            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Solar Aid is a university project developed with one simple goal: make solar energy easy for everyone.
                We remove the technical jargon and provide clear, actionable guidance.
              </p>
              <p>
                Whether you're estimating costs for the first time or looking for step-by-step installation help, we're here to guide you towards a brighter, cleaner future for your home.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {[
                'Simple language for all',
                'Free expert consultation',
                'Step-by-step guidance',
                'Sustainable focused'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-800 font-bold">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
