import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

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
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="auth-form-heading">Forgot Password</p>
        
        <div className="auth-form-field">
          <svg className="auth-form-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
          </svg>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="auth-form-input-field"
            autoComplete="off"
          />
        </div>
        
        <div className="auth-form-divider">or</div>
        
        <div className="auth-form-field">
          <svg className="auth-form-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2H2Zm-2 9.8V4.698l5.803 3.546L0 11.801Zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586l-1.239-.757ZM16 9.671V4.697l-5.803 3.546.338.208A4.482 4.482 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671Z"></path>
            <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507-.035.896-.153 1.141-.435l.464.86c-.314.201-.853.357-1.543.411-.692.055-1.367-.02-1.965-.301-.835-.395-1.554-1.16-1.554-2.4v-.118c0-1.854 1.514-3.434 3.64-3.434 1.91 0 3.416 1.291 3.416 3.207v.118Z"></path>
          </svg>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-form-input-field"
            autoComplete="email"
          />
        </div>
        
        {error && (
          <div className="auth-form-error">{error}</div>
        )}
        
        {message && (
          <div className="auth-form-success">{message}</div>
        )}
        
        <div className="btn">
          <button type="submit" className="auth-form-button1" disabled={loading}>
            {loading ? 'Please wait...' : 'Send Reset Link'}
          </button>
        </div>
        
        <button type="button" className="auth-form-button3" onClick={() => navigate('/login')}>
          Back to Login
        </button>
      </form>
    </div>
  );
} 