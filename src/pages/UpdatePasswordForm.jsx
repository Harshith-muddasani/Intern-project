import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
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
    <div className="sunrise-panel p-8 flex flex-col items-center shadow-lg w-[350px] mt-8">
      <h2 className="text-xl font-bold mb-4 text-orange-500">Update Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <button type="submit" className="sunrise-btn" disabled={loading}>
          {loading ? 'Please wait...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
} 