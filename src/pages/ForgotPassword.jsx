import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

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

  const inputStyle = {
    backgroundColor: 'var(--theme-input)',
    borderColor: 'var(--theme-input-border)',
    color: 'var(--theme-text)'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--theme-accent)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = 'var(--theme-input-border)';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <div 
        className="w-[90%] max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg transition-all duration-300"
        style={{ backgroundColor: 'var(--theme-card-bg)' }}
      >
        <h2 
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: 'var(--theme-text)' }}
        >
          Forgot Password
        </h2>
        <p 
          className="mb-6 text-sm text-center opacity-80"
          style={{ color: 'var(--theme-text)' }}
        >
          Enter your username or email and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <div 
            className="text-center text-sm opacity-60"
            style={{ color: 'var(--theme-text)' }}
          >
            or
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
            style={inputStyle}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoComplete="email"
          />
          {error && (
            <div className="text-red-500 text-sm text-center p-2 rounded-lg bg-red-50">
              {error}
            </div>
          )}
          {message && (
            <div className="text-green-600 text-sm text-center p-2 rounded-lg bg-green-50">
              {message}
            </div>
          )}
          <Button type="submit" className="w-full mt-2" disabled={loading} size="lg">
            {loading ? 'Please wait...' : 'Send Reset Link'}
          </Button>
        </form>
        <div className="mt-6 text-sm text-center">
          <button
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: 'var(--theme-accent)' }}
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
} 