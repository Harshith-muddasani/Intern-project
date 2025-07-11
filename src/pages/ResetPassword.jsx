import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }
    
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('Password has been reset successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError('Failed to reset password. Please try again.');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="sunrise-panel p-8 flex flex-col items-center shadow-lg w-[350px]">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">Invalid Reset Link</h2>
          <p className="text-red-500 text-center mb-4">
            This reset link is invalid or has expired.
          </p>
          <button 
            onClick={() => navigate('/forgot-password')}
            className="sunrise-btn"
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="sunrise-panel p-8 flex flex-col items-center shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Reset Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
            required
            autoComplete="new-password"
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
            required
            autoComplete="new-password"
            minLength={6}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}
          <button type="submit" className="sunrise-btn" disabled={loading}>
            {loading ? 'Please wait...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
} 