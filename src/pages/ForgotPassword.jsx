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

    // Validate input
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
        setMessage('If an account exists with the provided information, a password reset email has been sent. Please check your email inbox and spam folder.');
        // Clear form
        setUsername('');
        setEmail('');
        // Redirect to login after 5 seconds
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setError(data.message || 'Failed to send reset email.');
        if (data.debug) {
          console.error('Reset email debug info:', data.debug);
        }
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Network error. Please check your connection and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="sunrise-panel p-8 flex flex-col items-center shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Forgot Password?</h2>
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter your username or email address to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username (optional)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          />
          <div className="text-center text-gray-500 text-sm">OR</div>
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
          />
          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="text-green-600 text-sm text-center bg-green-50 p-2 rounded">
              {message}
            </div>
          )}
          <button 
            type="submit" 
            className="sunrise-btn" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
        </form>
        <button
          className="text-orange-500 underline mt-4"
          type="button"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
} 