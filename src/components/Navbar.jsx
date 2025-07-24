import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import ThemeSelector from './ThemeSelector';

export default function Navbar({ user, onLogout, onProfile, onViewSessions, onAdminPanel, onSendNewsletter = () => {} }) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLangLabel = (lng) => (lng.startsWith('es') ? 'ES' : 'EN');

  // Add hover handlers for dropdown options
  const handleDropdownMouseEnter = (e) => {
    e.currentTarget.style.color = '#ff5e62';
  };
  const handleDropdownMouseLeave = (e) => {
    e.currentTarget.style.color = 'var(--theme-text)';
  };

  return (
    <header 
      className="sticky top-0 shadow-sm z-50 transition-colors duration-300"
      style={{ backgroundColor: 'var(--theme-navbar)', borderBottom: `1px solid var(--theme-border)` }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex-shrink-0">
            <img src={logo} alt="MiAltar Logo" className="h-10 w-10" />
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <ThemeSelector />
            <Button variant="ghost">About Us</Button>
            <Button variant="ghost">Blog</Button>
            {user && user.username === 'admin' && (
              <Button variant="ghost" onClick={onAdminPanel}>Admin Panel</Button>
            )}
            {user && (
              <div className="relative" ref={userDropdownRef}>
                <Button variant="ghost" onClick={() => setUserDropdownOpen(v => !v)}>
                  <span>{user.username || user.name}</span>
                  <svg className={`ml-1 h-5 w-5 text-gray-500 transform transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-1 z-50 transition-colors duration-300"
                    style={{ 
                      backgroundColor: 'var(--theme-card-bg)', 
                      border: `1px solid var(--theme-border)`
                    }}
                  >
                    <a 
                      href="#" 
                      onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onProfile(); }} 
                      className="block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-80 no-underline flex items-center gap-2"
                      style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <span style={{fontSize: '1.1em', color: '#ff5e62'}}>•</span>
                      <span>Profile</span>
                    </a>
                    <div style={{ borderTop: '1px solid var(--theme-border, #e5e7eb)', margin: '0 12px' }}></div>
                    <a 
                      href="#" 
                      onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onViewSessions(); }} 
                      className="block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-80 no-underline flex items-center gap-2"
                      style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <span style={{fontSize: '1.1em', color: '#ff5e62'}}>•</span>
                      <span>Saved Sessions</span>
                    </a>
                    {user.username === 'admin' && <div style={{ borderTop: '1px solid var(--theme-border, #e5e7eb)', margin: '0 12px' }}></div>}
                    {user.username === 'admin' && (
                      <a 
                        href="#" 
                        onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onAdminPanel && onAdminPanel(); }} 
                        className="block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-80 no-underline flex items-center gap-2"
                        style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <span style={{fontSize: '1.1em', color: '#ff5e62'}}>•</span>
                        <span>Admin Panel</span>
                      </a>
                    )}
                    {user.username === 'admin' && <div style={{ borderTop: '1px solid var(--theme-border, #e5e7eb)', margin: '0 12px' }}></div>}
                    {user.username === 'admin' && (
                      <a 
                        href="#" 
                        onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onSendNewsletter && onSendNewsletter(); }} 
                        className="block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-80 no-underline flex items-center gap-2"
                        style={{ color: 'var(--theme-text)', textDecoration: 'none' }}
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <span style={{fontSize: '1.1em', color: '#ff5e62'}}>•</span>
                        <span>Send Newsletter</span>
                      </a>
                    )}
                    <div className="my-1" style={{ borderTop: `1px solid var(--theme-border)` }}></div>
                    <a 
                      href="#" 
                      onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onLogout(); }} 
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 no-underline flex items-center gap-2"
                      style={{ textDecoration: 'none' }}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <span style={{fontSize: '1.1em', color: '#ff5e62'}}>•</span>
                      <span>Logout</span>
                    </a>
                  </div>
                )}
              </div>
            )}
            {!user && <Button onClick={() => navigate('/login')}>Login</Button>}
            <div className="relative" ref={langDropdownRef}>
              <Button variant="ghost" onClick={() => setLangDropdownOpen(v => !v)}>
                <span>{getLangLabel(i18n.language)}</span>
                <svg className={`ml-1 h-5 w-5 text-gray-500 transform transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-24 origin-top-right rounded-xl shadow-lg py-1 z-50 transition-colors duration-300"
                  style={{ 
                    backgroundColor: 'var(--theme-card-bg)', 
                    border: `1px solid var(--theme-border)`
                  }}
                >
                  <a 
                    href="#" 
                    onClick={e => { e.preventDefault(); i18n.changeLanguage('en'); setLangDropdownOpen(false); }} 
                    className={`block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-80 ${
                      i18n.language.startsWith('en') ? 'font-bold' : ''
                    }`}
                    style={{ 
                      color: i18n.language.startsWith('en') ? 'var(--theme-accent)' : 'var(--theme-text)'
                    }}
                  >
                    EN
                  </a>
                  <a 
                    href="#" 
                    onClick={e => { e.preventDefault(); i18n.changeLanguage('es'); setLangDropdownOpen(false); }} 
                    className={`block px-4 py-2 text-sm transition-colors duration-200 hover:opacity-80 ${
                      i18n.language.startsWith('es') ? 'font-bold' : ''
                    }`}
                    style={{ 
                      color: i18n.language.startsWith('es') ? 'var(--theme-accent)' : 'var(--theme-text)'
                    }}
                  >
                    ES
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
