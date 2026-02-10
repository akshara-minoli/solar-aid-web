import React, { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-orange-400 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl">☀️</span>
              <span className="text-2xl font-bold text-orange-400">Solar Aid</span>
            </div>
            <h2 className="text-2xl md:text-3xl text-gray-800 mb-2">Welcome Back!</h2>
            <p className="text-gray-600">Login to access your solar energy dashboard</p>
          </div>

          {/* Demo Credentials Section */}
          <div className="bg-blue-50 p-6 my-8 rounded-xl border border-blue-200 text-center">
            <h4 className="text-blue-600 font-semibold mb-3">Demo Available</h4>
            <p className="text-sm text-gray-600 mb-1">Email: demo@solaraid.com</p>
            <p className="text-sm text-gray-600 mb-4">Password: demo123</p>
            <button 
              type="button" 
              onClick={fillDemoData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Use Demo Credentials
            </button>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-gray-800 font-semibold">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
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
                placeholder="Enter your password"
                className="p-4 border-2 border-gray-300 rounded-xl text-base transition-all duration-300 focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input type="checkbox" className="cursor-pointer" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="text-orange-400 hover:underline font-medium">Forgot password?</a>
            </div>

            {message && (
              <div className={`p-4 rounded-lg text-center font-medium ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className={`p-4 bg-gradient-to-br from-orange-400 to-orange-300 text-white rounded-xl text-lg font-bold transition-all duration-300 shadow-lg ${
                loading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:-translate-y-1 hover:shadow-xl'
              }`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <p className="text-gray-600 text-sm mb-2">Don't have an account? <a href="#signin" className="text-orange-400 hover:underline font-semibold">Sign In</a></p>
            </div>
          </form>

          <div className="text-center mt-6">
            <a href="#home" className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200">← Back to Home</a>
          </div>
        </div>

        <div className="text-center text-white hidden lg:block">
          <div className="w-52 h-52 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 animate-float">
            <span className="text-8xl">🔐</span>
          </div>
          <h3 className="text-2xl mb-4">Secure Access</h3>
          <p className="text-lg">Your solar energy data is safe with us</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
