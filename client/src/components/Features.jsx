import React from 'react';

const Features = () => {
  const features = [
    {
      title: 'Real-time Tracking',
      description: 'Monitor your energy production and consumption in real-time with precise tactical data.',
      icon: '📊'
    },
    {
      title: 'Savings Analysis',
      description: 'Advanced algorithms calculate your monthly cost reduction and system efficiency.',
      icon: '💰'
    },
    {
      title: 'Smart Maintenance',
      description: 'Predictive maintenance alerts ensure your protocol remains operational 24/7.',
      icon: '🛠️'
    },
    {
      title: 'Community Protocol',
      description: 'Connect with a registry of sustainable households and share energy insights.',
      icon: '🌐'
    }
  ];

  return (
    <section className="py-32 px-4 md:px-8 bg-[#0B1120] relative overflow-hidden" id="features">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
            Core Capabilities
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
            Tactical <span className="text-blue-500">Feature Set</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            Our platform provides the necessary protocols to initialize and maintain your sustainability journey with maximum efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-3xl mb-8 shadow-inner group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>

              <div className="mt-8 flex items-center justify-between">
                <div className="h-px flex-1 bg-white/5 group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="ml-4 w-2 h-2 rounded-full bg-white/10 group-hover:bg-blue-500 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
