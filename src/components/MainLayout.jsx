import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/DarkUI.css';

const MainLayout = ({ children, onSendNewsletter }) => { // Accept prop
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <Navbar
        user={user}
        onLogout={logout}
        onProfile={() => navigate('/profile')}
        onViewSessions={() => navigate('/sessions')}
        onAdminPanel={() => navigate('/admin')}
        onSendNewsletter={onSendNewsletter} // Pass prop down
        onSharingSettings={() => navigate('/sharing')}
      />
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer can be part of the layout but outside the main content area */}
    </div>
  );
};

export default MainLayout; 