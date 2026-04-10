import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import api from '../api';

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
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://solar-aid-web.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        setMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      } else {
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

  const sideContent = (
    <div className="space-y-12 max-w-lg">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest animate-pulse">
          🚀 Start Your Journey
        </div>
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] italic">
          Create your <span className="text-blue-500">Solar Aid</span> account
        </h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed">
          Join thousands of households making the switch to clean, affordable energy today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10 group cursor-default backdrop-blur-md">
          <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">📝</div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1.5">Easy Setup</h3>
          <p className="text-slate-500 font-medium text-xs leading-relaxed">Fill details in 60s and begin your energy transition.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10 group cursor-default backdrop-blur-md">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">💡</div>
          <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1.5">Custom Tools</h3>
          <p className="text-slate-500 font-medium text-xs leading-relaxed">Get free estimates tailored to your unique household needs.</p>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      split={true}
      sideContent={sideContent}
      title="Registration"
      subtitle="Join us for a sustainable future"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-000-000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Confirm</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2 px-1">
          <input type="checkbox" id="terms" className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500 cursor-pointer" required />
          <label htmlFor="terms" className="text-[10px] text-slate-400 font-medium cursor-pointer">
            I agree to the <a href="#terms" className="text-blue-400 hover:underline font-black uppercase tracking-widest">Terms of Service</a>
          </label>
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest animate-fade-in border ${message.includes('success')
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 ${loading
            ? 'opacity-70 cursor-not-allowed'
            : 'hover:bg-blue-500 hover:shadow-blue-500/40 hover:-translate-y-0.5'
            }`}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-slate-500 font-medium text-xs">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest ml-1">Login here</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignIn;

