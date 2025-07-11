import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getProfile(token)
        .then(profile => setUser(profile))
        .catch(() => { setUser(null); setToken(null); localStorage.removeItem('token'); })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const login = async (username, password) => {
    setError(null);
    setLoading(true);
    try {
      const { token: t } = await apiLogin(username, password);
      setToken(t);
      localStorage.setItem('token', t);
      const profile = await getProfile(t);
      setUser(profile);
    } catch (err) {
      setError(err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    setLoading(true);
    try {
      await apiRegister(username, email, password);
      await login(username, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 