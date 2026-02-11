import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const fillDemoData = () => {
    setFormData({
      email: 'demo@solaraid.com',
      password: 'demo123'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Login successful! Welcome back.');
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setFormData({ email: '', password: '' });
        // Redirect to dashboard or home page
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Network error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-orange-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-emerald-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden lg:flex flex-col justify-center space-y-8 pr-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Welcome back to <br />
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Solar Aid
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Continue your journey towards sustainable energy and check your personalized savings dashboard.
            </p>
          </div>

          <div className="p-8 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">📊</div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Real-time Tracking</p>
                <p className="text-gray-500 text-sm">Monitor your energy production</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">💰</div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Savings Analysis</p>
                <p className="text-gray-500 text-sm">View your monthly cost reduction</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[3.5rem] shadow-2xl border border-white/50 relative">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-3xl">☀️</span>
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">Solar Aid</span>
            </div>
            <a href="#home" className="text-gray-400 hover:text-orange-500 transition-colors">
              ✕
            </a>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
            <p className="text-gray-500 font-medium">Enter your credentials to continue</p>
          </div>

          {/* Demo Credentials Section */}
          <div className="bg-orange-50/50 p-6 mb-8 rounded-3xl border border-orange-100 flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-sm font-bold text-orange-600 mb-1">Testing our demo? ✨</p>
              <p className="text-xs text-gray-600">Instantly fill credentials for a tour.</p>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="px-5 py-3 bg-white text-orange-600 rounded-2xl hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold text-sm shadow-sm border border-orange-100"
            >
              Fill Demo
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm text-gray-800 font-bold ml-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-base transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-100/50"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-sm text-gray-800 font-bold">Password</label>
                <a href="#forgot" className="text-sm text-orange-500 hover:underline font-bold">Forgot?</a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full p-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] text-base transition-all duration-300 focus:outline-none focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-100/50 pr-14"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-gray-200 text-orange-500 focus:ring-orange-500 cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-gray-600 font-medium cursor-pointer">Remember me for 30 days</label>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl text-center font-bold text-sm animate-fade-in ${message.includes('successful')
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className={`w-full p-5 bg-orange-500 text-white rounded-[1.5rem] text-lg font-bold transition-all duration-300 shadow-xl shadow-orange-500/20 ${loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-orange-600 hover:-translate-y-1 hover:shadow-2xl'
                }`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Login to Dashboard'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600 font-medium">
                New to Solar Aid? <a href="#signin" className="text-orange-500 hover:underline font-bold ml-1">Create an account</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
