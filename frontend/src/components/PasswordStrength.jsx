/**
 * components/PasswordStrength.jsx
 * Visual password strength indicator with 4-level bar meter.
 */

import React, { useMemo } from 'react';

/**
 * Evaluate password strength (0–4).
 * @param {string} password
 * @returns {{ score: number, label: string }}
 */
const evaluateStrength = (password) => {
  if (!password) return { score: 0, label: '' };

  let score = 0;
  if (password.length >= 8)  score++;         // Minimum length
  if (password.length >= 12) score++;          // Good length
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++; // Mixed case
  if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++; // Number + symbol

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[score] };
};

/**
 * PasswordStrength component.
 * @param {string} password - Current password value to evaluate
 */
const PasswordStrength = ({ password }) => {
  const { score, label } = useMemo(() => evaluateStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="strength-meter">
      <div className="strength-bars">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`strength-bar ${score >= level ? `active-${score}` : ''}`}
          />
        ))}
      </div>
      <span className="strength-label">
        Password strength:{' '}
        <strong
          style={{
            color: ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][score],
          }}
        >
          {label}
        </strong>
      </span>
    </div>
  );
};

export default PasswordStrength;
