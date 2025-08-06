import React, { useState, useEffect } from 'react';
import { sendNewsletter, getAllUsers } from '../../auth/api';
import '../../styles/DarkUI.css';

export default function NewsletterDialog({ token, onClose }) {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const userList = await getAllUsers(token);
        setUsers(userList);
      } catch (err) {
        setError('Failed to fetch users. Please try again.');
      }
    }
    fetchUsers();
  }, [token]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(users.map(u => u.email));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelect = (e, email) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, email]);
    } else {
      setSelectedUsers(selectedUsers.filter(u => u !== email));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await sendNewsletter(token, {
        subject,
        content,
        recipients: selectedUsers,
      });
      setSuccess('Newsletter sent successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div 
        style={{
          backgroundColor: '#171717',
          borderRadius: '1rem',
          padding: '2rem',
          width: '100%',
          maxWidth: '42rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #333'
        }}
      >
        <h3 className="text-2xl font-semibold mb-6 text-center w-full dark-text">
          Send Newsletter
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* Recipient Selection */}
          <div className="rounded-lg p-4 dark-panel">
            <h4 className="font-semibold text-lg mb-2 dark-text">Recipients</h4>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="select-all"
                onChange={handleSelectAll}
                checked={users.length > 0 && selectedUsers.length === users.length}
                className="h-5 w-5 rounded border-gray-300 focus:ring-2"
                style={{ accentColor: 'var(--theme-accent)' }}
              />
              <label htmlFor="select-all" className="ml-2 font-bold dark-text">Select All</label>
            </div>
            <div className="max-h-48 overflow-y-auto pr-2">
              {users.map(user => (
                <div key={user.email} className="flex items-center my-1">
                  <input
                    type="checkbox"
                    id={user.email}
                    checked={selectedUsers.includes(user.email)}
                    onChange={(e) => handleUserSelect(e, user.email)}
                    className="h-5 w-5 rounded border-gray-300 focus:ring-2"
                    style={{ accentColor: 'var(--theme-accent)' }}
                  />
                  <label htmlFor={user.email} className="ml-2 dark-text">{user.username} ({user.email})</label>
                </div>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-5 py-3 rounded border-2 outline-none text-lg dark-input"
            required
          />
          <textarea
            placeholder="Content (HTML is supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-5 py-3 rounded border-2 outline-none text-lg dark-input"
            rows="6"
            required
          />
          {error && <div className="text-sm text-center dark-text-muted">{error}</div>}
          {success && <div className="text-sm text-center dark-text-muted">{success}</div>}
          <div className="flex gap-6 justify-center w-full">
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                border: '2px solid #333',
                backgroundColor: '#252525',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1.125rem',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              disabled={loading || selectedUsers.length === 0}
            >
              {loading ? 'Sending...' : `Send to ${selectedUsers.length} user(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 