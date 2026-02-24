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
    <section className="py-24 px-4 md:px-8 bg-white" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">We're Here to <span className="text-orange-500">Help</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">Have questions? Our friendly team is ready to guide you on your solar journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-lg">
          <div>
            <h3 className="text-2xl md:text-3xl text-gray-800 mb-4">Get in Touch</h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
              Whether you have questions about solar energy, need help with cost estimation,
              or want to learn more about our project, feel free to reach out.
            </p>
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">📧</span>
                <div>
                  <h4 className="text-lg md:text-xl text-gray-800 mb-1">Email</h4>
                  <p className="text-gray-600">info@solaraid.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">📱</span>
                <div>
                  <h4 className="text-lg md:text-xl text-gray-800 mb-1">Phone</h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-4xl flex-shrink-0">📍</span>
                <div>
                  <h4 className="text-lg md:text-xl text-gray-800 mb-1">Location</h4>
                  <p className="text-gray-600">University Campus<br />Solar Energy Department</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-base text-gray-800 font-semibold">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="p-4 border-2 border-gray-300 rounded-xl text-base font-inherit transition-all duration-300 ease-in-out focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-base text-gray-800 font-semibold">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="p-4 border-2 border-gray-300 rounded-xl text-base font-inherit transition-all duration-300 ease-in-out focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-base text-gray-800 font-semibold">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you..."
                  rows="5"
                  className="p-4 border-2 border-gray-300 rounded-xl text-base font-inherit transition-all duration-300 ease-in-out focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 resize-vertical"
                  required
                ></textarea>
              </div>

              {message && (
                <div className={`p-4 rounded-lg text-center font-medium ${message.includes('Thank you')
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                className={`py-4 px-8 bg-gradient-to-br from-orange-400 to-orange-300 text-white rounded-full text-lg font-bold cursor-pointer transition-all duration-300 ease-in-out shadow-lg ${loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:-translate-y-1 hover:shadow-xl'
                  }`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
