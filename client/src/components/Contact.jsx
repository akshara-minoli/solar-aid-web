import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setMessage(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setMessage('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 px-4 md:px-8 bg-[#0B1120] relative overflow-hidden" id="contact">
      {/* Background Decorative Glow */}
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
            Communication Protocol
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase">
            Initialize <span className="text-blue-500">Contact</span>
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto">
            Our support registry is available for all your sustainability inquiries. Reach out to our technical team today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white/5 backdrop-blur-2xl p-8 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

          <div className="space-y-12 relative z-10">
            <div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-6">Support Vector</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-10 max-w-md">
                Whether you have inquiries regarding solar energy protocols, cost estimation metrics, or platform assistance, our team is standing by.
              </p>

              <div className="space-y-8">
                {[
                  { icon: '📧', title: 'Email Registry', value: 'info@solaraid.com', accent: 'blue' },
                  { icon: '📱', title: 'Direct Link', value: '+1 (555) 123-4567', accent: 'indigo' },
                  { icon: '📍', title: 'Tactical HQ', value: 'University Campus, Solar Dept', accent: 'sky' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6 group/item">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl group-hover/item:border-blue-500/30 transition-all duration-300 shadow-inner">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-white font-black tracking-tight text-lg">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message Protocol</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can our technical team assist you?"
                  rows="4"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 resize-none"
                  required
                ></textarea>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-fade-in ${message.includes('Thank you')
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group/btn ${loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-blue-500 hover:-translate-y-1 hover:shadow-blue-500/40'
                  }`}
                disabled={loading}
              >
                {loading ? 'Initializing...' : (
                  <>
                    Transmit Message
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
