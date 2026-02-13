import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        // Store token and user data
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setMessage('Account created successfully! Redirecting...');
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/home');
        }, 1000);
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

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-emerald-100 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-40" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="hidden lg:flex flex-col justify-center space-y-10 pr-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
              <span>🚀</span> Start Your Journey
            </div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Create your <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Solar Aid
              </span> account
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of households making the switch to clean, affordable energy today.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white shadow-lg space-y-2">
              <div className="text-3xl">📝</div>
              <p className="font-bold text-gray-900">Easy Setup</p>
              <p className="text-gray-500 text-xs">Fill details in 60s</p>
            </div>
            <div className="p-6 bg-white/50 backdrop-blur-md rounded-[2rem] border border-white shadow-lg space-y-2">
              <div className="text-3xl">💡</div>
              <p className="font-bold text-gray-900">Custom Tools</p>
              <p className="text-gray-500 text-xs">Get free estimates</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/50 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-3xl">☀️</span>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Solar Aid</span>
            </div>
            <a href="#home" className="text-gray-400 hover:text-emerald-500 transition-colors">
              ✕
            </a>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500 font-medium">Join us for a sustainable future</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs text-gray-800 font-bold ml-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text" id="fullName" name="fullName"
                  value={formData.fullName} onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-xs text-gray-800 font-bold ml-1 uppercase tracking-wider">Phone</label>
                <input
                  type="tel" id="phone" name="phone"
                  value={formData.phone} onChange={handleChange}
                  placeholder="+1 (555) 000"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs text-gray-800 font-bold ml-1 uppercase tracking-wider">Email Address</label>
              <input
                type="email" id="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs text-gray-800 font-bold ml-1 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-xs text-gray-800 font-bold ml-1 uppercase tracking-wider">Confirm</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl text-sm transition-all duration-300 focus:outline-none focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-100/50 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input type="checkbox" id="terms" className="w-5 h-5 rounded-lg border-2 border-gray-200 text-emerald-500 focus:ring-emerald-500 cursor-pointer" required />
              <label htmlFor="terms" className="text-xs text-gray-600 font-medium cursor-pointer">
                I agree to the <a href="#terms" className="text-emerald-600 hover:underline font-bold">Terms and Conditions</a>
              </label>
            </div>

            {message && (
              <div className={`p-4 rounded-2xl text-center font-bold text-xs animate-fade-in ${message.includes('success')
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-red-50 text-red-600 border border-red-100'
                }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className={`w-full p-5 bg-emerald-500 text-white rounded-[1.5rem] text-lg font-bold transition-all duration-300 shadow-xl shadow-emerald-500/20 ${loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-emerald-600 hover:-translate-y-1 hover:shadow-2xl'
                }`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Get Started Now'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-600 font-medium">
                Already have an account? <a href="#login" className="text-emerald-500 hover:underline font-bold ml-1">Login here</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
