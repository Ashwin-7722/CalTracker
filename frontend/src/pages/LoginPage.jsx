import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/api';

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const { access_token, user } = response.data;
      login(access_token, user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">🔥</div>
          <span className="auth-logo-text">CalTrack</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to track your nutrition</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="login-submit"
            className="btn btn-primary btn-block btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
