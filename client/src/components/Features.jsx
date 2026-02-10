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
    <section className="py-16 px-8 bg-gradient-to-b from-gray-50 to-green-50" id="features">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl text-gray-800 mb-2">What Solar Energy Can Do For You</h2>
          <p className="text-lg md:text-xl text-gray-600">Simple explanations for everyone</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-lg mb-12">
          <h3 className="text-center text-2xl md:text-3xl text-orange-400 mb-8">Understanding Solar Energy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-300 p-8 rounded-2xl shadow-md">
              <h4 className="text-lg md:text-xl text-gray-800 mb-4">🔆 What is a Solar System?</h4>
              <p className="text-base leading-relaxed text-gray-800">
                A solar system is a set of special panels that you put on your roof. These panels catch sunlight 
                and turn it into electricity for your home - just like magic! No fuel needed, just the sun.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-300 p-8 rounded-2xl shadow-md">
              <h4 className="text-lg md:text-xl text-gray-800 mb-4">✨ Benefits of Solar Energy</h4>
              <ul className="list-none p-0">
                <li className="py-2 text-gray-800 text-base relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                  Save money on electricity bills
                </li>
                <li className="py-2 text-gray-800 text-base relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                  Clean energy - no smoke or pollution
                </li>
                <li className="py-2 text-gray-800 text-base relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                  Works even in remote villages
                </li>
                <li className="py-2 text-gray-800 text-base relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                  Reliable power for your family
                </li>
                <li className="py-2 text-gray-800 text-base relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-emerald-600 before:font-bold">
                  One-time investment, long-term savings
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-300 p-8 rounded-2xl shadow-md md:col-span-2 lg:col-span-1">
              <h4 className="text-lg md:text-xl text-gray-800 mb-4">🌾 Why Rural Homes Should Use It</h4>
              <p className="text-base leading-relaxed text-gray-800">
                Many villages don't have regular electricity or it comes and goes. Solar panels give you 
                your own power that works every day. You can charge phones, run lights, fans, and even TV - 
                all from the sun!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl text-center transition-all duration-300 ease-in-out shadow-md hover:-translate-y-3 hover:shadow-xl">
              <div className="text-6xl mb-4">{feature.icon}</div>
              <h3 className="text-lg md:text-xl text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
