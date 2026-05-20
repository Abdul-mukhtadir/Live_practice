/**
 * components/BrandLogo.jsx
 * Shared brand logo shown at the top of every auth card.
 */

import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = () => (
  <Link to="/" className="brand-logo" style={{ display: 'flex' }}>
    <div className="icon-shield">
      <i className="bi bi-shield-lock-fill" style={{ color: '#fff' }}></i>
    </div>
    <span>Secure<em>App</em></span>
  </Link>
);

export default BrandLogo;
