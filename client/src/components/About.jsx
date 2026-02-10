import React from 'react';

const About = () => {
  return (
    <section className="py-16 px-8 bg-white" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center items-center">
            <div className="w-60 h-60 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-400 flex justify-center items-center shadow-2xl shadow-emerald-500/30 animate-pulse-slow">
              <span className="text-7xl md:text-9xl">🌍</span>
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl text-gray-800 mb-6">About Solar Aid</h2>
            <p className="text-lg md:text-xl text-orange-400 font-semibold mb-4">
              Solar Aid is a web-based platform developed as a university project to help rural 
              households understand and adopt solar energy solutions.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-4">
              Our mission is simple: make solar energy easy to understand for everyone. We know that 
              technical terms can be confusing, especially for people who have never used solar power before.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-8">
              That's why we created Solar Aid - to explain everything in simple words, help you estimate 
              costs, and guide you step by step in choosing the right solar system for your home.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 justify-center lg:justify-start text-base md:text-lg text-gray-800">
                <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex justify-center items-center font-bold flex-shrink-0">
                  ✓
                </span>
                <span>Simple language, no technical jargon</span>
              </div>
              <div className="flex items-center gap-4 justify-center lg:justify-start text-base md:text-lg text-gray-800">
                <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex justify-center items-center font-bold flex-shrink-0">
                  ✓
                </span>
                <span>Free cost estimation tools</span>
              </div>
              <div className="flex items-center gap-4 justify-center lg:justify-start text-base md:text-lg text-gray-800">
                <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex justify-center items-center font-bold flex-shrink-0">
                  ✓
                </span>
                <span>Clear guidance for rural communities</span>
              </div>
              <div className="flex items-center gap-4 justify-center lg:justify-start text-base md:text-lg text-gray-800">
                <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex justify-center items-center font-bold flex-shrink-0">
                  ✓
                </span>
                <span>Helping make clean energy accessible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
