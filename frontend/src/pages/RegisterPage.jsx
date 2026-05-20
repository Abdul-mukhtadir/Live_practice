/**
 * pages/RegisterPage.jsx
 * User registration page — create a new SecureApp account.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import Alert from '../components/Alert';
import PasswordStrength from '../components/PasswordStrength';
import { registerUser } from '../services/authService';

const RegisterPage = () => {
  const navigate = useNavigate();

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [alert, setAlert]       = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Handle input change ────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual field error on change
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.name.trim())         errors.name = 'Full name is required.';
    if (!formData.email.trim())        errors.email = 'Email address is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email.';
    if (!formData.password)            errors.password = 'Password is required.';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters.';
    return errors;
  };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      setAlert({ type: 'success', message: 'Account created! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="auth-card">

        <BrandLogo />

        <h1 className="card-title">Create account</h1>
        <p className="card-subtitle">Join SecureApp — it's free and secure.</p>

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <label className="form-label" htmlFor="name">Full Name</label>
          <div className="input-group-custom">
            <i className="bi bi-person-fill input-icon"></i>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-control-custom ${fieldErrors.name ? 'is-invalid' : ''}`}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          {fieldErrors.name && (
            <p className="field-error">
              <i className="bi bi-exclamation-circle"></i> {fieldErrors.name}
            </p>
          )}

          {/* Email */}
          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-group-custom">
            <i className="bi bi-envelope-fill input-icon"></i>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control-custom ${fieldErrors.email ? 'is-invalid' : ''}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {fieldErrors.email && (
            <p className="field-error">
              <i className="bi bi-exclamation-circle"></i> {fieldErrors.email}
            </p>
          )}

          {/* Password */}
          <label className="form-label" htmlFor="password">Password</label>
          <div className="input-group-custom">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control-custom ${fieldErrors.password ? 'is-invalid' : ''}`}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
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
          {fieldErrors.password ? (
            <p className="field-error">
              <i className="bi bi-exclamation-circle"></i> {fieldErrors.password}
            </p>
          ) : (
            <PasswordStrength password={formData.password} />
          )}

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="footer-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
