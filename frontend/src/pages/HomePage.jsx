/**
 * pages/HomePage.jsx
 * Simple landing page showing the app's navigation.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';

const HomePage = () => (
  <div className="page-wrapper">
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <BrandLogo />

      <div
        style={{
          width: 72,
          height: 72,
          background: 'linear-gradient(135deg, rgba(233,69,96,0.15), rgba(99,102,241,0.15))',
          border: '1px solid rgba(233,69,96,0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem',
        }}
      >
        🔐
      </div>

      <h1 className="card-title" style={{ textAlign: 'center' }}>
        Password Reset Flow
      </h1>
      <p className="card-subtitle" style={{ textAlign: 'center' }}>
        A complete, secure password reset implementation with email verification and token expiry.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Link to="/register" className="btn-primary-custom" style={{ textDecoration: 'none', textAlign: 'center' }}>
          <i className="bi bi-person-plus-fill" style={{ marginRight: '8px' }}></i>
          Create an Account
        </Link>
        <Link
          to="/login"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '0.8rem',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text)',
            textDecoration: 'none',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.95rem',
            fontWeight: 600,
            transition: 'border-color 0.2s',
          }}
          onMouseOver={(e) => (e.target.style.borderColor = 'var(--color-accent)')}
          onMouseOut={(e) => (e.target.style.borderColor = 'var(--color-border)')}
        >
          <i className="bi bi-box-arrow-in-right" style={{ marginRight: '8px' }}></i>
          Sign In
        </Link>
        <Link
          to="/forgot-password"
          style={{
            fontSize: '0.875rem',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            textAlign: 'center',
            padding: '0.5rem',
          }}
        >
          Forgot your password? → Reset it
        </Link>
      </div>

      
    </div>
  </div>
);

export default HomePage;
