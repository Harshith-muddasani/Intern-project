import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../auth/AuthContext'; // Corrected import path
import { useNavigate } from 'react-router-dom';

const MainLayout = ({ children, onSendNewsletter }) => { // Accept prop
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        user={user}
        onLogout={logout}
        onProfile={() => navigate('/profile')}
        onViewSessions={() => navigate('/sessions')}
        onAdminPanel={() => navigate('/admin')}
        onSendNewsletter={onSendNewsletter} // Pass prop down
      />
      <main className="flex-grow">
        {children}
      </main>
      {/* Footer can be part of the layout but outside the main content area */}
    </div>
  );
};

export default MainLayout; 