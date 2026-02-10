import React from 'react';

const IntroBanner = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-400 py-16 px-8 min-h-[70vh] flex items-center justify-center" id="home">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-gray-800">
          <h1 className="text-3xl md:text-5xl mb-4 leading-tight text-gray-800">
            Welcome to <span className="text-red-600 drop-shadow-sm">Solar Aid</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-600 font-medium">
            Helping rural households adopt clean, affordable solar energy
          </p>
          <p className="text-lg mb-8 text-gray-800 leading-relaxed">
            Learn about solar power, estimate costs, and take your first step towards sustainable energy for your home.
          </p>
          <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
            <a 
              href="#features" 
              className="bg-emerald-500 text-white py-4 px-8 rounded-full font-bold text-base transition-all duration-300 ease-in-out shadow-lg hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-xl inline-block"
            >
              Learn Solar
            </a>
            <a 
              href="#contact" 
              className="bg-white text-orange-400 py-4 px-8 rounded-full font-bold text-base transition-all duration-300 ease-in-out shadow-lg border-2 border-orange-400 hover:bg-orange-400 hover:text-white hover:-translate-y-1 hover:shadow-xl inline-block"
            >
              Get Cost Estimation
            </a>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-60 h-60 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex justify-center items-center shadow-2xl animate-float">
            <span className="text-8xl md:text-9xl animate-spin-slow">☀️</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroBanner;
