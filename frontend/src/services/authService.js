/**
 * services/authService.js
 * Centralized API calls for auth & password reset endpoints.
 * Uses Axios with the React proxy to /api/auth.
 */

import axios from 'axios';

// Base URL — React's package.json "proxy" handles forwarding to backend
const BASE_URL = 'https://live-practice-8xhk.onrender.com/api/auth';
/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} data
 */
export const registerUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/register`, data);
  return response.data;
};

/**
 * Login with email and password.
 * @param {{ email: string, password: string }} data
 */
export const loginUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/login`, data);
  return response.data;
};

/**
 * Request a password reset email.
 * @param {{ email: string }} data
 */
export const forgotPassword = async (data) => {
  const response = await axios.post(`${BASE_URL}/forgot-password`, data);
  return response.data;
};

/**
 * Verify that a reset token is still valid (called on page load).
 * @param {string} token - Token from the URL
 */
export const verifyResetToken = async (token) => {
  const response = await axios.get(`${BASE_URL}/verify-reset-token/${token}`);
  return response.data;
};

/**
 * Submit the new password using the reset token.
 * @param {string} token - Token from the URL
 * @param {{ password: string, confirmPassword: string }} data
 */
export const resetPassword = async (token, data) => {
  const response = await axios.post(`${BASE_URL}/reset-password/${token}`, data);
  return response.data;
};
