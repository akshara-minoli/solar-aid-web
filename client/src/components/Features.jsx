import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      image: '/src/assets/photo/lesson_thumb.png',
      title: 'Learn Solar Basics',
      description: 'Understand how solar energy works in simple, everyday language. Sign up to unlock our full library of guides.'
    },
    {
      image: '/src/assets/photo/roof_suitability.png',
      title: 'Register Your Home',
      description: 'Join our community to get personalized advice for your specific household needs.'
    },
    {
      image: '/src/assets/photo/installers.png',
      title: 'Expert Guidance',
      description: 'Get step-by-step help from installation to maintenance. We are with you every step of the way.'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm mb-4">
            ☀️ Start Simple
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Solar Energy, <span className="text-orange-500">Simplified</span> For You</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">No engineering degree required. We make clean energy easy to understand and use for your family.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium mb-6 flex-1">{feature.description}</p>
                <Link to="/signin" className="text-orange-500 font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                  Start Now <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
