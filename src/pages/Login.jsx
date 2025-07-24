import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

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
          Login to MiAltar
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              backgroundColor: 'var(--theme-input)',
              borderColor: 'var(--theme-input-border)',
              color: 'var(--theme-text)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--theme-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--theme-input-border)'}
            autoFocus
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300"
            style={{
              backgroundColor: 'var(--theme-input)',
              borderColor: 'var(--theme-input-border)',
              color: 'var(--theme-text)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--theme-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--theme-input-border)'}
            required
            autoComplete="current-password"
          />
          {error && (
            <div className="text-red-500 text-sm text-center p-2 rounded-lg bg-red-50">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading} size="lg">
            {loading ? 'Please wait...' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 text-sm text-center">
          <span style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
            Don't have an account?{' '}
          </span>
          <button
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: 'var(--theme-accent)' }}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        <button
          className="w-full mt-3 text-sm hover:underline transition-colors duration-200"
          style={{ color: 'var(--theme-accent)' }}
          type="button"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot Password?
        </button>
      </div>
    </div>
  );
} 