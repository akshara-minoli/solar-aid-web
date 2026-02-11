import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📚',
      title: 'Learn Solar Basics',
      description: 'Understand how solar energy works in simple language. Perfect for beginners with no technical knowledge.'
    },
    {
      icon: '💰',
      title: 'Estimate Your Cost',
      description: 'Get a rough idea of how much a solar system would cost for your home based on your needs.'
    },
    {
      icon: '🏠',
      title: 'Register Your Home',
      description: 'Create your profile and save your information for personalized solar recommendations.'
    },
    {
      icon: '🤝',
      title: 'Get Guidance',
      description: 'Receive step-by-step guidance on choosing and installing the right solar system for your family.'
    }
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">What Solar Energy Can Do For You</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Simple, practical explanations for everyone. No technical jargon needed.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          <div className="lg:col-span-2 bg-gradient-to-br from-orange-50 to-yellow-50 p-10 md:p-14 rounded-[3rem] border border-orange-100/50 shadow-inner">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Understanding Solar Energy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="text-4xl">🔆</div>
                <h4 className="text-xl font-bold text-gray-900">What is a Solar System?</h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Think of it as "Magic Panels" for your roof. They catch sunlight and turn it into
                  electricity for your home. No fuel, no noise, just pure sunshine.
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl">✨</div>
                <h4 className="text-xl font-bold text-gray-900">Key Benefits</h4>
                <ul className="space-y-4">
                  {[
                    'Save money on every bill',
                    'Reliable power for your family',
                    'Zero smoke, zero pollution',
                    'Works even in remote areas'
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-gray-700 font-medium text-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-10 md:p-14 rounded-[3rem] border border-emerald-100/50 flex flex-col justify-center gap-6">
            <div className="text-5xl">🌾</div>
            <h4 className="text-2xl font-bold text-gray-900">For Rural Homes</h4>
            <p className="text-gray-600 leading-relaxed text-lg">
              Many villages face power cuts. Solar panels give you
              independence. Power your lights, fans, and TV every single day, for free.
            </p>
            <div className="pt-4">
              <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold text-sm">Most Popular Choice</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="group bg-gray-50 p-10 rounded-[2.5rem] transition-all duration-300 hover:bg-white hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-transparent hover:border-gray-100">
              <div className="text-5xl mb-6 transform transition-transform group-hover:scale-110 duration-300">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
