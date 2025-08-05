import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updatePassword } from '../auth/api';

export default function UpdatePasswordForm() {
  const { token, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updatePassword(token, currentPassword, newPassword);
      setSuccess('Password updated successfully! Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'var(--theme-overlay, rgba(0,0,0,0.5))' }}>
      <div className="rounded-2xl p-8 w-full max-w-md mx-auto flex flex-col items-center justify-center shadow-xl transition-colors duration-300"
        style={{ backgroundColor: 'var(--theme-card-bg)', color: 'var(--theme-text)' }}>
        <h2 className="text-2xl font-bold mb-6 text-center w-full" style={{ color: 'var(--theme-accent)' }}>Update Password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              backgroundColor: 'var(--theme-input)',
              borderColor: 'var(--theme-input-border)',
              color: 'var(--theme-text)'
            }}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              backgroundColor: 'var(--theme-input)',
              borderColor: 'var(--theme-input-border)',
              color: 'var(--theme-text)'
            }}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button type="submit" className="modern-btn" disabled={loading} style={{ backgroundColor: 'var(--theme-accent)', color: 'var(--theme-card-bg)' }}>
            {loading ? 'Please wait...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
} 