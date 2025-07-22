import React, { useState, useEffect } from 'react';
import { sendNewsletter, getAllUsers } from '../../auth/api';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl mx-auto flex flex-col shadow-xl">
        <h3 className="text-2xl font-semibold mb-6 text-center text-orange-600 w-full">
          Send Newsletter
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* Recipient Selection */}
          <div className="border-2 border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2 text-orange-500">Recipients</h4>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="select-all"
                onChange={handleSelectAll}
                checked={users.length > 0 && selectedUsers.length === users.length}
                className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="select-all" className="ml-2 font-bold">Select All</label>
            </div>
            <div className="max-h-48 overflow-y-auto pr-2">
              {users.map(user => (
                <div key={user.email} className="flex items-center my-1">
                  <input
                    type="checkbox"
                    id={user.email}
                    checked={selectedUsers.includes(user.email)}
                    onChange={(e) => handleUserSelect(e, user.email)}
                    className="h-5 w-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label htmlFor={user.email} className="ml-2 text-gray-700">{user.username} ({user.email})</label>
                </div>
              ))}
            </div>
          </div>

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-5 py-3 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-lg"
            required
          />
          <textarea
            placeholder="Content (HTML is supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="px-5 py-3 rounded border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none text-lg"
            rows="6"
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-500 text-sm text-center">{success}</div>}
          <div className="flex gap-6 justify-center w-full">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modern-btn px-6 py-2 text-lg"
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