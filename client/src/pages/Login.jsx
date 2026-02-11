import { useState } from 'react';
import './Login.css';

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
        // Redirect to dashboard
        window.location.hash = 'dashboard';
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
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <span className="logo-icon">☀️</span>
              <span className="logo-text">Solar Aid</span>
            </div>
            <h2>Welcome Back!</h2>
            <p>Login to access your solar energy dashboard</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            {message && (
              <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="form-footer">
              <p>Don&apos;t have an account? <a href="#signin">Sign In</a></p>
            </div>
          </form>

          <div className="back-home">
            <a href="#home">← Back to Home</a>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="illustration-circle">
            <span className="illustration-icon">🔐</span>
          </div>
          <h3>Secure Access</h3>
          <p>Your solar energy data is safe with us</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
