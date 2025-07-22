import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { login, loading, error, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="modern-panel p-8 flex flex-col items-center shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Login to MiAltar</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            required
            autoComplete="current-password"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="modern-btn w-full" disabled={loading}>
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            className="text-blue-600 hover:underline font-semibold"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        <button
          className="text-blue-600 hover:underline mt-2 text-sm"
          type="button"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
} 