/**
 * pages/LoginPage.jsx
 * User login page — authenticate with email and password.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import Alert from '../components/Alert';
import { loginUser } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [alert, setAlert]         = useState({ type: '', message: '' });

  // ── Handle input change ────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    if (!formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Please enter your email and password.' });
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(formData);
      setAlert({ type: 'success', message: `Welcome back, ${data.user.name}! Login successful.` });
      // In a real app, store token/session here
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-card">

        <BrandLogo />

        <h1 className="card-title">Welcome back</h1>
        <p className="card-subtitle">Sign in to your SecureApp account.</p>

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-group-custom">
            <i className="bi bi-envelope-fill input-icon"></i>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control-custom"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-group-custom">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="form-control-custom"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>

          {/* Forgot password link */}
          <div style={{ textAlign: 'right', marginTop: '-0.75rem', marginBottom: '1.25rem' }}>
            <Link
              to="/forgot-password"
              style={{ fontSize: '0.83rem', color: 'var(--color-accent)', textDecoration: 'none' }}
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="footer-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
