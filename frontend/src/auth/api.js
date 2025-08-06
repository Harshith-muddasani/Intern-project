const API_URL = 'http://localhost:4000';

export async function register(username, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Registration failed');
  return res.json();
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Login failed');
  return res.json(); // { token }
}

export async function getProfile(token) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Profile fetch failed');
  return res.json();
}

export async function updatePassword(token, currentPassword, newPassword) {
  const res = await fetch(`${API_URL}/auth/update-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Password update failed');
  return res.json();
}

export async function getSessions(token) {
  const res = await fetch(`${API_URL}/sessions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch sessions');
  return res.json();
}

export async function saveSession(token, session) {
  const res = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(session)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to save session');
  return res.json();
}

export async function deleteSession(token, name) {
  const res = await fetch(`${API_URL}/sessions/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete session');
  return res.json();
}

export async function getAllUsers(token) {
  const res = await fetch(`${API_URL}/admin/users/all`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch users');
  return res.json();
}

export async function sendNewsletter(token, { subject, content, recipients }) {
  const res = await fetch(`${API_URL}/admin/newsletter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ subject, content, recipients }),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to send newsletter');
  return res.json();
}

// Altar Styles API
export async function getAltarStyles(token) {
  const res = await fetch('http://localhost:4000/altar-styles', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch altar styles');
  return res.json();
}

export async function addAltarStyle(token, style) {
  const res = await fetch('http://localhost:4000/altar-styles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(style),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to add altar style');
  return res.json();
}

export async function deleteAltarStyle(token, id) {
  const res = await fetch(`http://localhost:4000/altar-styles/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete altar style');
  return res.json();
}

// Offerings API
export async function getOfferings(token) {
  const res = await fetch('http://localhost:4000/offerings', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch offerings');
  return res.json();
}

export async function addOffering(token, offering) {
  const res = await fetch('http://localhost:4000/offerings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(offering),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to add offering');
  return res.json();
}

export async function deleteOffering(token, id) {
  const res = await fetch(`http://localhost:4000/offerings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete offering');
  return res.json();
} 