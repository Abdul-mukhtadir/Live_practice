/**
 * pages/ForgotPasswordPage.jsx
 * Step 1 of the password reset flow.
 * User enters their email → backend sends reset link.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import Alert from '../components/Alert';
import { forgotPassword } from '../services/authService';

const ForgotPasswordPage = () => {
  // ── State ─────────────────────────────────────────────────────────────────
  const [email, setEmail]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [alert, setAlert]         = useState({ type: '', message: '' });
  const [emailSent, setEmailSent] = useState(false); // Show success screen after submission

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: '', message: '' });

    // Basic client-side validation
    if (!email.trim()) {
      setAlert({ type: 'error', message: 'Please enter your email address.' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword({ email });
      // Show success screen on successful API call
      setEmailSent(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setAlert({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen (after email is sent) ──────────────────────────────────
  if (emailSent) {
    return (
      <div className="page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <BrandLogo />

          {/* Success icon */}
          <div className="success-icon">
            <i className="bi bi-envelope-check-fill" style={{ color: 'var(--color-success)' }}></i>
          </div>

          <h1 className="card-title" style={{ textAlign: 'center' }}>Check your email</h1>
          <p className="card-subtitle" style={{ textAlign: 'center' }}>
            We've sent a password reset link to{' '}
            <strong style={{ color: 'var(--color-text)' }}>{email}</strong>.
            The link will expire in <strong style={{ color: 'var(--color-warning)' }}>1 hour</strong>.
          </p>

          <Alert
            type="warning"
            message="Don't see the email? Check your spam or junk folder."
          />

          {/* Resend option */}
          <button
            className="btn-primary-custom"
            style={{ marginTop: '0.5rem' }}
            onClick={() => { setEmailSent(false); setEmail(''); }}
          >
            <i className="bi bi-arrow-counterclockwise" style={{ marginRight: '8px' }}></i>
            Try a different email
          </button>

          <div className="footer-link" style={{ marginTop: '1rem' }}>
            <Link to="/login">
              <i className="bi bi-arrow-left" style={{ marginRight: '4px' }}></i>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Form ──────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">
      <div className="auth-card">

        <BrandLogo />

        {/* Step indicator: 3 steps total */}
        <div className="steps-indicator">
          <div className="step-dot active" title="Step 1: Enter email"></div>
          <div className="step-dot" title="Step 2: Check email"></div>
          <div className="step-dot" title="Step 3: Reset password"></div>
        </div>

        <h1 className="card-title">Forgot password?</h1>
        <p className="card-subtitle">
          Enter the email address linked to your account. We'll send you a secure reset link.
        </p>

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit} noValidate>

          <label className="form-label" htmlFor="email">Email Address</label>
          <div className="input-group-custom">
            <i className="bi bi-envelope-fill input-icon"></i>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control-custom"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
          </div>

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Sending reset link…' : (
              <>
                <i className="bi bi-send" style={{ marginRight: '8px' }}></i>
                Send Reset Link
              </>
            )}
          </button>
        </form>

        <div className="footer-link">
          Remember your password? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
