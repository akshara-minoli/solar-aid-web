import React, { useState } from 'react';

const SignIn = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Account created successfully! You can now login.');
        // Optionally store token and redirect
        localStorage.setItem('token', data.token);
        setFormData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
      } else {
        // Check if it's a database connection error
        if (data.message && data.message.includes('Database connection error')) {
          setMessage('Service temporarily unavailable. Please use the demo login instead.');
        } else {
          setMessage(data.message || 'Registration failed');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-emerald-400 to-emerald-300 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">☀️</span>
              <span className="text-2xl font-bold text-emerald-500">Solar Aid</span>
            </div>
            <h2 className="text-2xl md:text-3xl text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Join us and start your solar journey today!</p>
          </div>

          {/* Demo Info for Database Issues */}
          <div className="bg-blue-50 p-8 my-8 rounded-xl border border-blue-200 text-center">
            <h4 className="text-blue-600 font-semibold mb-3">✨ Try Demo Account</h4>
            <p className="text-sm text-gray-600 mb-4">Experience the full Solar Aid platform instantly!</p>
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-700 mb-1">
                📧 demo@solaraid.com
              </p>
              <p className="text-sm font-bold text-gray-700">
                🔐 demo123
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => window.location.hash = '#login'}
              className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-bold"
            >
              Go to Login Page
            </button>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-sm text-gray-800 font-semibold">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-gray-800 font-semibold">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm text-gray-800 font-semibold">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm text-gray-800 font-semibold">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm text-gray-800 font-semibold">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" className="cursor-pointer" required />
                <span>I agree to the Terms and Conditions</span>
              </label>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                message.includes('success') 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {message}
                {message.includes('Service temporarily unavailable') && (
                  <div className="mt-3">
                    <button 
                      type="button"
                      onClick={() => window.location.hash = '#login'}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                    >
                      Try Demo Login Instead
                    </button>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className={`p-4 bg-gradient-to-br from-emerald-500 to-emerald-400 text-white rounded-xl text-lg font-bold transition-all duration-300 shadow-lg ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:-translate-y-1 hover:shadow-xl'
              }`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm mb-2">Already have an account? <a href="#login" className="text-emerald-500 hover:underline font-semibold">Login</a></p>
            </div>
          </form>

          <div className="text-center mt-6">
            <a href="#home" className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200">← Back to Home</a>
          </div>
        </div>

        <div className="text-center text-white hidden lg:block">
          <div className="w-52 h-52 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 animate-float">
            <span className="text-8xl">🌱</span>
          </div>
          <h3 className="text-2xl mb-4">Join Solar Aid</h3>
          <p className="text-lg">Start your journey to clean energy</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
