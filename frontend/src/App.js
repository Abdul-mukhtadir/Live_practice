/**
 * App.js - Root component with React Router configuration.
 * All routes for the password reset flow are defined here.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Global styles and Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';

// Pages
import HomePage          from './pages/HomePage';
import RegisterPage      from './pages/RegisterPage';
import LoginPage         from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage  from './pages/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home / Dashboard */}
        <Route path="/" element={<HomePage />} />

        {/* Registration */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Step 1: Forgot Password - enter email */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Step 3: Reset Password - enter new password (token in URL) */}
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
