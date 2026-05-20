/**
 * pages/ResetPasswordPage.jsx
 * Step 3 of the password reset flow.
 * 1. On load: verify the token from URL → valid / expired / invalid
 * 2. If valid: show new password form
 * 3. On submit: call API to update password and clear token from DB
 */

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import Alert from '../components/Alert';
import PasswordStrength from '../components/PasswordStrength';
import { verifyResetToken, resetPassword } from '../services/authService';

// ── Token Verification States ────────────────────────────────────────────────
const TOKEN_STATUS = {
  LOADING:  'loading',
  VALID:    'valid',
  EXPIRED:  'expired',
  INVALID:  'invalid',
};

const ResetPasswordPage = () => {
  const { token }   = useParams(); // Extract token from URL: /reset-password/:token
  const navigate    = useNavigate();

  // ── State ─────────────────────────────────────────────────────────────────
  const [tokenStatus, setTokenStatus]   = useState(TOKEN_STATUS.LOADING);
  const [userEmail, setUserEmail]       = useState('');
  const [formData, setFormData]         = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ password: false, confirm: false });
  const [loading, setLoading]           = useState(false);
  const [alert, setAlert]               = useState({ type: '', message: '' });
  const [fieldErrors, setFieldErrors]   = useState({});
  const [resetSuccess, setResetSuccess] = useState(false);

  // ── Verify token on component mount ───────────────────────────────────────
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenStatus(TOKEN_STATUS.INVALID);
        return;
      }

      try {
        const data = await verifyResetToken(token);
        setUserEmail(data.email || '');
        setTokenStatus(TOKEN_STATUS.VALID);
      } catch (err) {
        // Check if token is expired vs completely invalid
        const isExpired = err.response?.data?.expired === true;
        setTokenStatus(isExpired ? TOKEN_STATUS.EXPIRED : TOKEN_STATUS.INVALID);
      }
    };

    checkToken();
  }, [token]);

  // ── Handle input change ────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Toggle password visibility ─────────────────────────────────────────────
  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = () => {
    const errors = {};
    if (!formData.password)
      errors.password = 'New password is required.';
    else if (formData.password.length < 8)
      errors.password = 'Password must be at least 8 characters.';

    if (!formData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';

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
      await resetPassword(token, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      setResetSuccess(true);
    } catch (err) {
      const isExpired = err.response?.data?.expired === true;
      if (isExpired) {
        setTokenStatus(TOKEN_STATUS.EXPIRED);
      } else {
        const msg = err.response?.data?.message || 'Password reset failed. Please try again.';
        setAlert({ type: 'error', message: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // Render: Loading
  // ──────────────────────────────────────────────────────────────────────────
  if (tokenStatus === TOKEN_STATUS.LOADING) {
    return (
      <div className="page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <BrandLogo />
          <div style={{ padding: '2rem 0', color: 'var(--color-muted)' }}>
            <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3, marginRight: 0 }}></span>
            <p style={{ marginTop: '1.25rem', fontSize: '0.95rem' }}>Verifying your reset link…</p>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render: Token Expired
  // ──────────────────────────────────────────────────────────────────────────
  if (tokenStatus === TOKEN_STATUS.EXPIRED) {
    return (
      <div className="page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <BrandLogo />
          <div
            className="success-icon"
            style={{
              background: 'rgba(251, 191, 36, 0.1)',
              border: '2px solid rgba(251, 191, 36, 0.4)',
            }}
          >
            <i className="bi bi-clock-history" style={{ color: 'var(--color-warning)' }}></i>
          </div>
          <h1 className="card-title" style={{ textAlign: 'center' }}>Link Expired</h1>
          <p className="card-subtitle" style={{ textAlign: 'center' }}>
            Your password reset link has expired. Reset links are valid for{' '}
            <strong style={{ color: 'var(--color-warning)' }}>1 hour</strong> only.
            Please request a new one.
          </p>
          <Alert type="warning" message="For security, all reset links expire after 1 hour." />
          <Link to="/forgot-password" className="btn-primary-custom" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
            <i className="bi bi-arrow-repeat" style={{ marginRight: '8px' }}></i>
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render: Token Invalid
  // ──────────────────────────────────────────────────────────────────────────
  if (tokenStatus === TOKEN_STATUS.INVALID) {
    return (
      <div className="page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <BrandLogo />
          <div
            className="success-icon"
            style={{
              background: 'rgba(248, 113, 113, 0.1)',
              border: '2px solid rgba(248, 113, 113, 0.4)',
            }}
          >
            <i className="bi bi-x-circle-fill" style={{ color: 'var(--color-error)' }}></i>
          </div>
          <h1 className="card-title" style={{ textAlign: 'center' }}>Invalid Link</h1>
          <p className="card-subtitle" style={{ textAlign: 'center' }}>
            This password reset link is invalid or has already been used.
            Please request a new reset link.
          </p>
          <Link to="/forgot-password" className="btn-primary-custom" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
            Request a New Link
          </Link>
          <div className="footer-link">
            <Link to="/login">
              <i className="bi bi-arrow-left" style={{ marginRight: '4px' }}></i>
              Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render: Password Reset Success
  // ──────────────────────────────────────────────────────────────────────────
  if (resetSuccess) {
    // Auto-redirect to login after 3 seconds
    setTimeout(() => navigate('/login'), 3000);
    return (
      <div className="page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <BrandLogo />
          <div className="success-icon">
            <i className="bi bi-check-lg" style={{ color: 'var(--color-success)' }}></i>
          </div>
          <h1 className="card-title" style={{ textAlign: 'center' }}>Password Updated!</h1>
          <p className="card-subtitle" style={{ textAlign: 'center' }}>
            Your password has been successfully changed. You can now log in with your new password.
          </p>
          <Alert type="success" message="Redirecting you to the login page in 3 seconds…" />
          <Link to="/login" className="btn-primary-custom" style={{ display: 'block', textDecoration: 'none', textAlign: 'center' }}>
            <i className="bi bi-box-arrow-in-right" style={{ marginRight: '8px' }}></i>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Render: Reset Password Form (token is VALID)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-wrapper">
      <div className="auth-card">

        <BrandLogo />

        {/* Step indicator */}
        <div className="steps-indicator">
          <div className="step-dot done" title="Step 1: Done"></div>
          <div className="step-dot done" title="Step 2: Done"></div>
          <div className="step-dot active" title="Step 3: Reset password"></div>
        </div>

        <h1 className="card-title">Set new password</h1>
        <p className="card-subtitle">
          {userEmail ? (
            <>Resetting password for <strong style={{ color: 'var(--color-accent)' }}>{userEmail}</strong></>
          ) : (
            'Choose a strong new password for your account.'
          )}
        </p>

        <Alert type={alert.type} message={alert.message} />

        <form onSubmit={handleSubmit} noValidate>

          {/* New Password */}
          <label className="form-label" htmlFor="password">New Password</label>
          <div className="input-group-custom">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              id="password"
              name="password"
              type={showPassword.password ? 'text' : 'password'}
              className={`form-control-custom ${fieldErrors.password ? 'is-invalid' : ''}`}
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              autoFocus
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => toggleVisibility('password')}
              aria-label="Toggle password visibility"
            >
              <i className={`bi ${showPassword.password ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
          {fieldErrors.password ? (
            <p className="field-error">
              <i className="bi bi-exclamation-circle"></i> {fieldErrors.password}
            </p>
          ) : (
            <PasswordStrength password={formData.password} />
          )}

          {/* Confirm Password */}
          <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
          <div className="input-group-custom">
            <i className="bi bi-lock-fill input-icon"></i>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              className={`form-control-custom ${fieldErrors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => toggleVisibility('confirm')}
              aria-label="Toggle confirm password visibility"
            >
              <i className={`bi ${showPassword.confirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="field-error">
              <i className="bi bi-exclamation-circle"></i> {fieldErrors.confirmPassword}
            </p>
          )}

          {/* Match indicator */}
          {formData.password && formData.confirmPassword && (
            <p
              style={{
                fontSize: '0.8rem',
                marginBottom: '1rem',
                color: formData.password === formData.confirmPassword
                  ? 'var(--color-success)'
                  : 'var(--color-error)',
              }}
            >
              <i className={`bi ${formData.password === formData.confirmPassword ? 'bi-check-circle' : 'bi-x-circle'}`} style={{ marginRight: '4px' }}></i>
              {formData.password === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}

          <button type="submit" className="btn-primary-custom" disabled={loading}>
            {loading && <span className="spinner"></span>}
            {loading ? 'Updating password…' : (
              <>
                <i className="bi bi-shield-check" style={{ marginRight: '8px' }}></i>
                Update Password
              </>
            )}
          </button>
        </form>

        <div className="footer-link">
          <Link to="/login">
            <i className="bi bi-arrow-left" style={{ marginRight: '4px' }}></i>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
