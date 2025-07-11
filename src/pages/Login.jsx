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
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="sunrise-panel p-8 flex flex-col items-center shadow-lg w-[350px]">
        <h2 className="text-2xl font-bold mb-4 text-orange-500">Login to MiAltar</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-2 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
            required
            autoComplete="current-password"
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="sunrise-btn" disabled={loading}>
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
        <button
          className="sunrise-btn w-full mt-4"
          onClick={() => navigate('/register')}
        >
          Don't have an account? Register
        </button>
        <button
          className="text-orange-500 underline mt-2"
          type="button"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
} 