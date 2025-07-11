import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import TableTemplate from '../components/TableTemplate';

export default function AdminPanel() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (token && user?.username === 'admin') {
      fetch('http://localhost:4000/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(setData)
        .catch(e => setError(e.message));
    }
  }, [token, user]);
  if (!user || user.username !== 'admin') return <div className="p-8 text-red-500">Access denied. Admins only.</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">Loading...</div>;
  return (
    <div className="sunrise-panel p-8 bg-white rounded-xl shadow-md max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">Admin Panel: All Users & Sessions</h2>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 text-orange-600">Users</h3>
        <TableTemplate headers={["username"]} data={data.users} />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-orange-600">Sessions by User</h3>
        {Object.entries(data.sessions).map(([username, sessions]) => (
          <div key={username} className="mb-4">
            <div className="font-bold mb-1 text-orange-500">{username}</div>
            <TableTemplate
              headers={["name", "altarStyle", "items", "timestamp"]}
              data={sessions.map(s => ({
                name: s.name,
                altarStyle: s.altarStyle,
                items: s.items.length,
                timestamp: new Date(s.timestamp).toLocaleString()
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 