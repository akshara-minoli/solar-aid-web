import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Welcome.css';

const solarComponents = [
  {
    id: 'panel',
    name: 'Solar Panels',
    color: '#3b82f6', // blue
    desc: 'Captures sunlight and converts it into direct current (DC) electricity.',
    features: ['Monocrystalline or Polycrystalline', 'Durable for outdoor weather', 'Requires direct sunlight'],
    purpose: 'Energy Generation',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 5h16v14H4V5zm2 2v3h3V7H6zm5 0v3h3V7h-3zm5 0v3h3V7h-3zM6 12v3h3v-3H6zm5 0v3h3v-3h-3zm5 0v3h3v-3h-3z" /></svg>
    ),
    img: 'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=600&q=80'
  },
  {
    id: 'controller',
    name: 'Charge Controller',
    color: '#f59e0b', // amber
    desc: 'Regulates the voltage and current coming from the solar panels to safely charge the battery.',
    features: ['Prevents battery overcharging', 'Protects against reverse current', 'Maximizes charging efficiency (MPPT/PWM)'],
    purpose: 'System Regulation',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 2h6v2H9V2zM7 6h10v14H7V6zm2 2v2h6V8H9zm0 4v2h2v-2H9zm4 0v2h2v-2h-2zm-4 4v2h2v-2H9zm4 0v2h2v-2h-2z" /></svg>
    ),
    img: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&q=80'
  },
  {
    id: 'battery',
    name: 'Battery Bank',
    color: '#10b981', // green
    desc: 'Stores the DC electrical energy produced by the solar panels for use during the night or cloudy days.',
    features: ['Deep cycle lead-acid or Lithium-ion', 'Capacity measured in Amp-hours (Ah)', 'Crucial for off-grid systems'],
    purpose: 'Energy Storage',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 2h-8v2H6v18h12V4h-2V2zm-4 6h4v2h-4v4h-2v-4H6V8h4V6h2v2z" /></svg>
    ),
    img: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80'
  },
  {
    id: 'inverter',
    name: 'Inverter',
    color: '#8b5cf6', // purple
    desc: 'Converts the Direct Current (DC) electricity stored in batteries into Alternating Current (AC) used by household appliances.',
    features: ['Pure Sine Wave for sensitive electronics', 'Matches household voltage (220V/110V)', 'Provides surge power for motors'],
    purpose: 'Current Conversion',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v12H4V6zm2 2v8h12V8H6zm3 2h2v4H9v-4zm4 0h2v4h-2v-4z" /></svg>
    ),
    img: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80'
  },
  {
    id: 'home',
    name: 'Household Appliances',
    color: '#ec4899', // pink
    desc: 'Lights, fans, TVs, and other appliances that consume the generated AC electricity.',
    features: ['Improves quality of life in rural areas', 'Enables studying after dark', 'Powers communication devices'],
    purpose: 'Energy Consumption',
    icon: (
      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L4 9v12h16V9l-8-6zm0 2.5l6 4.5v9h-3v-5H9v5H6v-9l6-4.5z" /></svg>
    ),
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80'
  }
];

const galleryImages = [
  'https://images.unsplash.com/photo-1548614606-52b4451f994b?w=600&q=80',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&q=80',
  'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=600&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=600&q=80'
];

const Welcome = () => {
  const [selectedComp, setSelectedComp] = useState(solarComponents[0]);

  const handleScrollToExplore = () => {
    document.getElementById('explore-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden energy-bg pb-12">
        <div className="sun-glow"></div>

        <div className="relative z-10 max-w-5xl pt-32">
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-6 drop-shadow-lg">
            Empowering Rural Homes <br />with Solar Energy
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-3xl mx-auto">
            Educating communities, simplifying installation, and bringing sustainable, clean light to every household.
          </p>
          <div className="bg-slate-900/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 mb-10 max-w-4xl mx-auto text-left shadow-lg">
            <p className="text-slate-300 text-lg leading-relaxed">
              Transitioning to solar power doesn't just lighten the load on traditional power grids; it breathes life into rural communities that have historically lacked access to consistent electricity. By installing a modest solar array, families can power essential tasks—providing adequate lighting for children to read at night, running communication devices to stay connected, or even operating small-scale medical refrigeration. When neighbors learn how to install and maintain these robust systems, entire villages move towards economic independence and a brighter future.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleScrollToExplore}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full font-bold text-lg text-slate-900 border-2 border-yellow-400/50 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.6)]"
            >
              Start Learning How It Works
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Solar System Section */}
      <section id="features" className="py-20 relative bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Interactive System Flow</h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            A solar setup relies on a chain of vital components. Click on any node below to discover its specific role in capturing the sun's energy, regulating it, storing it, and eventually powering off-grid appliances.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row items-center justify-center gap-10 container mx-auto px-4">

          {/* Energy Flow Animation */}
          <div className="xl:w-3/5 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-[0_0_40px_rgba(30,41,59,0.8)] overflow-hidden">
            <h3 className="text-center text-slate-500 font-semibold mb-12 uppercase tracking-widest text-sm">Flow of Electrcity</h3>
            <div className="energy-flow-container">
              {solarComponents.map((comp, index) => (
                <React.Fragment key={comp.id}>
                  <div
                    className={`solar-node ${selectedComp?.id === comp.id ? 'active' : ''}`}
                    style={{ color: comp.color }}
                    onClick={() => setSelectedComp(comp)}
                  >
                    {comp.icon}
                    <span className="text-xs font-semibold text-white text-center px-2">{comp.name}</span>
                  </div>
                  {/* Render flow line between components except after the last one */}
                  {index < solarComponents.length - 1 && (
                    <div className="flow-line"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-center text-slate-500 mt-12 text-sm italic">*DC: Direct Current | AC: Alternating Current</p>
          </div>

          {/* Info Panel */}
          <div className="w-full xl:w-2/5 bg-slate-800/50 backdrop-blur-md rounded-2xl p-8 min-h-[500px] border border-slate-700">
            {selectedComp ? (
              <div className="animate-pulse-slow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-full bg-slate-900 border shadow-lg" style={{ color: selectedComp.color, borderColor: selectedComp.color }}>
                    {selectedComp.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-white" style={{ textShadow: `0 0 10px ${selectedComp.color}50` }}>
                    {selectedComp.name}
                  </h3>
                </div>

                <p className="text-slate-300 text-lg mb-6 leading-relaxed">{selectedComp.desc}</p>

                <div className="mb-6 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-600 h-56">
                  <img src={selectedComp.img} alt={selectedComp.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                </div>

                <div className="mb-6">
                  <div className="bg-slate-900/80 p-4 rounded-lg border-l-4" style={{ borderColor: selectedComp.color }}>
                    <span className="block text-slate-400 text-xs uppercase tracking-wider mb-1">Primary Role</span>
                    <span className="font-semibold text-lg text-white">{selectedComp.purpose}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 tracking-wide">Key Features:</h4>
                  <ul className="space-y-3">
                    {selectedComp.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300">
                        <span className="w-2 h-2 rounded-full mr-3 shadow-[0_0_5px_currentColor]" style={{ backgroundColor: selectedComp.color }}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center opacity-70">
                <svg className="w-20 h-20 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
                <p className="text-xl font-medium tracking-wide">Tap any component in the flow to learn more</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How To Setup Section */}
      <section id="about" className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How to Set Up a Basic System</h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Installing a solar system may seem daunting, but it breaks down into a handful of logical, safe steps. Following standard guidelines allows community members—even those without initial electrical training—to assist in setting up their own power sources alongside trained technicians. Here is a brief look at the 3 main phases of physical installation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative group">
              <div className="absolute top-4 right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10 group-hover:scale-110 transition-transform">1</div>
              <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&q=80" alt="Mounting Panels" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-white mb-3">Mount the Panels</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Securing the panels is a team effort. The arrays must be securely mounted on a roof or a sturdy pole angled directly toward the sun, making sure that trees or nearby buildings won’t cast shade on them throughout the day.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative group">
              <div className="absolute top-4 right-4 bg-amber-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10 group-hover:scale-110 transition-transform">2</div>
              <img src="https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=500&q=80" alt="Wiring" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-white mb-3">Wire to Controller & Battery</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  Once mounted, technicians route UV-resistant cables to the charge controller. It is critical to hook up the battery to the controller first to establish system voltage, before safely attaching the live solar panel incoming wires.
                </p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative group">
              <div className="absolute top-4 right-4 bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10 group-hover:scale-110 transition-transform">3</div>
              <img src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=500&q=80" alt="Inverter" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-white mb-3">Attach Inverter & Use</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  The inverter connects directly to the high-current battery bank. Once turned on, it converts the stored energy into household AC power. Now, families can simply plug in standard lights and fans directly to the inverter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Videos Section */}
      <section className="py-24 bg-slate-900 border-t border-b border-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Educational Video Guides</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-6">
              Visual learning is often the fastest way to grasp a new concept. Explore our curated video guides below, showcasing step-by-step installation guides and how solar fundamentally alters rural communities.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Video 1 */}
            <div className="rounded-2xl flex flex-col items-center bg-slate-800 border border-slate-700 shadow-lg overflow-hidden group">
              <div className="relative w-full pb-[56.25%] h-0 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/khYZTmm7S5I"
                  title="Understanding Solar"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">The Basics of Solar</h3>
                <p className="text-sm text-slate-400">An introduction to how solar panels capture sunlight and the science behind the photovoltaic effect and community grids.</p>
              </div>
            </div>

            {/* Video 2 */}
            <div className="rounded-2xl flex flex-col items-center bg-slate-800 border border-slate-700 shadow-lg overflow-hidden group">
              <div className="relative w-full pb-[56.25%] h-0 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/EYeHB3CC9L8?si=XvS0HUh6qrecuxk0"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Step-by-Step Installation</h3>
                <p className="text-sm text-slate-400">Watch hands-on, practical demonstrations detailing exact procedures for mounting arrays, wiring, and verifying controller voltages safely.</p>
              </div>
            </div>

            {/* Video 3 */}
            <div className="rounded-2xl flex flex-col items-center bg-slate-800 border border-slate-700 shadow-lg overflow-hidden group">
              <div className="relative w-full pb-[56.25%] h-0 bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/o0Lc6nxaTG4?si=shZsi0Ad_VhNStHl"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-400 mb-2">Rural Setup Walkthrough</h3>
                <p className="text-sm text-slate-400">See real-world examples of households completing successful solar installations. Observe the transformation and learn from real structural setups.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section Below Videos */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">The Impact on Rural Households</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center shadow-[0_0_15px_rgba(234,179,8,0.05)]">
              <div className="w-16 h-16 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Reliable Energy</h4>
              <p className="text-slate-400 text-sm">Eliminates dependence on unreliable grid power or expensive, smoke-producing diesel generators.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center shadow-[0_0_15px_rgba(34,197,94,0.05)]">
              <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path><path d="M10 2.252V8H4.252a8.014 8.014 0 005.748-5.748z"></path><path fillRule="evenodd" d="M10 17.748V10H4.252A8.014 8.014 0 0010 17.748zm2 0A8.014 8.014 0 0017.748 10H12v7.748z" clipRule="evenodd"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Cost Savings</h4>
              <p className="text-slate-400 text-sm">After the initial setup, sunlight is absolutely free! This massively reduces long-term fuel costs.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col items-center shadow-[0_0_15px_rgba(59,130,246,0.05)]">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Better Education</h4>
              <p className="text-slate-400 text-sm">Allows children to study after dark and households to safely run laptops and phones for online learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Solar in Action</h2>
            <p className="text-slate-400 text-lg">Glimpses of solar networks empowering lives across the globe.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {galleryImages.map((src, index) => (
              <div key={index} className="group overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-lg aspect-square">
                <img
                  src={src}
                  alt={`Solar imagery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:opacity-80"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </div>
  );
};

export default Welcome;
