/**
 * components/Alert.jsx
 * Reusable alert/notification component for success, error, and warning messages.
 */

import React from 'react';

/**
 * Alert component.
 * @param {'error'|'success'|'warning'} type - Alert style variant
 * @param {string} message - Message to display
 */
const Alert = ({ type = 'error', message }) => {
  if (!message) return null;

  // Icon mapping for each alert type
  const icons = {
    error:   'bi-exclamation-circle-fill',
    success: 'bi-check-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
  };

  return (
    <div className={`alert-custom alert-${type}`} role="alert">
      <i className={`bi ${icons[type]}`} style={{ flexShrink: 0, marginTop: '2px' }}></i>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
