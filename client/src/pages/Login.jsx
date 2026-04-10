import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
    setMessage('Demo credentials loaded - click Login to test');
  };

  const testConnection = async () => {
    try {
      setMessage('Testing connection...');
      const response = await fetch('https://solar-aid-web.onrender.com/api/health');
      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Server connected: ${data.status}`);
      } else {
        setMessage('❌ Server responded but with error');
      }
    } catch (error) {
      setMessage(`❌ Connection failed: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const normalizedFormData = {
      ...formData,
      email: formData.email.trim().toLowerCase()
    };

    try {
      const response = await fetch('https://solar-aid-web.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(normalizedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Extract descriptive error from server or fallback to status
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful! Redirecting...');
        setTimeout(() => {
          if (data.user && data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/home');
          }
        }, 500);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setMessage('Connection failed. Server port 5000 offline.');
      } else {
        // Now displays descriptive error if available
        setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const sideContent = (
    <div className="space-y-12 max-w-lg">
      <div className="space-y-6">
        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] italic">
          Welcome back to <span className="text-blue-500">Solar Aid</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium leading-relaxed">
          Continue your journey towards sustainable energy and check your personalized savings dashboard.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10 group cursor-default backdrop-blur-md flex items-center gap-6">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl border border-blue-500/20 group-hover:scale-110 transition-transform flex-shrink-0">📊</div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Real-time Tracking</h3>
            <p className="text-slate-500 font-medium text-xs">Monitor your energy production instantly.</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 transition-all hover:bg-white/10 group cursor-default backdrop-blur-md flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-3xl border border-emerald-500/20 group-hover:scale-110 transition-transform flex-shrink-0">💰</div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest mb-1">Savings Analysis</h3>
            <p className="text-slate-500 font-medium text-xs">View your monthly cost reduction and efficiency.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthLayout
      split={true}
      sideContent={sideContent}
      title="Login"
      subtitle="Enter your credentials to continue"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>

        {/* Demo Credentials Box */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Demo Environment</p>
              <p className="text-xs text-slate-400 font-medium">Test platform capabilities instantly.</p>
            </div>
            <button
              type="button"
              onClick={fillDemoData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
            >
              Fill Demo
            </button>
          </div>
          <button
            type="button"
            onClick={testConnection}
            className="w-full py-2 border border-white/5 bg-white/5 text-slate-400 hover:text-white rounded-lg font-black text-[9px] uppercase tracking-[0.2em] transition-all"
          >
            Check Connectivity
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              <Link to="/forgot" className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest">Forgot Password?</Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-600 pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
        </div>

        {message && (
          <div className={`p-4 rounded-xl text-center font-black text-[10px] uppercase tracking-widest animate-fade-in border ${message.includes('successful')
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
          {loading ? 'Logging In...' : 'Log In'}
        </button>

        <div className="text-center pt-4 border-t border-white/5">
          <p className="text-slate-500 font-medium text-xs">
            New to Solar Aid? <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-black uppercase tracking-widest ml-1">Create Account</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;

