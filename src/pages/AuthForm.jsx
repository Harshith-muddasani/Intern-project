import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function AuthForm() {
  const { login, register, loading, error } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      await register(username, password);
    } else {
      await login(username, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <div className="modern-panel p-14 flex flex-col items-center shadow-lg w-[500px]">
        <h2 className="text-3xl font-bold mb-6 text-orange-500">
          {isRegister ? 'Register for MiAltar' : 'Login to MiAltar'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="px-5 py-3 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-lg"
            autoFocus
            required
            style={{paddingTop: '1rem', paddingBottom: '1rem'}}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-5 py-3 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-lg"
            required
            style={{paddingTop: '1rem', paddingBottom: '1rem'}}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <button type="submit" className="modern-btn text-base px-6 py-2" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          className="mt-4 text-orange-500 underline text-base hover:text-orange-700"
          onClick={() => setIsRegister(r => !r)}
          disabled={loading}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
} 