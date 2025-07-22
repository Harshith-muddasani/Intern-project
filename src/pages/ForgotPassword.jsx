import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!username && !email) {
      setError('Please enter either username or email.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage('If an account exists, a password reset email has been sent.');
        setUsername('');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send reset email.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="modern-panel p-8 flex flex-col items-center shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Forgot Password</h2>
        <p className="mb-4 text-sm text-gray-600 text-center">Enter your username or email and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <div className="text-center text-gray-500 text-sm">or</div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            autoComplete="email"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {message && <div className="text-green-600 text-sm text-center">{message}</div>}
          <button type="submit" className="modern-btn w-full mt-2" disabled={loading}>
            {loading ? 'Please wait...' : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-4 text-sm">
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
} 