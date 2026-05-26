import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../api/api';

export default function RegisterPage({ onSwitch }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser({ username, email, password });
      const { access_token, user } = response.data;
      login(access_token, user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
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

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start tracking your nutrition today</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="register-username">Username</label>
            <input
              id="register-username"
              className="form-input"
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm">Confirm Password</label>
            <input
              id="register-confirm"
              className="form-input"
              type="password"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            id="register-submit"
            className="btn btn-primary btn-block btn-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
