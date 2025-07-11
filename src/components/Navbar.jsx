import React, { useState, useRef } from 'react';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, onLogout, onProfile, onViewSessions, onAdminPanel }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  // Helper to get language label
  const getLangLabel = (lng) => {
    if (lng.startsWith('es')) return 'ES';
    return 'EN';
  };

  // Close language dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    }
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langDropdownOpen]);

  return (
    <header className="flex items-center justify-between px-6 py-3 logo-navbar mb-4" style={{ boxShadow: '0 2px 8px 0 rgba(252, 182, 159, 0.15)' }}>
      <div className="flex items-center gap-2">
        <img src={logo} alt="MiAltar Logo" className="h-10 w-10 mr-2" />
      </div>
      <nav className="space-x-2 text-sm flex flex-wrap gap-2 items-center relative">
        <button className="nav-btn">About Us</button>
        <button className="nav-btn">Blog</button>
        {user && user.username === 'admin' && (
          <button className="sunrise-btn" onClick={onAdminPanel} style={{ marginRight: '1rem' }}>
            Admin Panel
          </button>
        )}
        {user ? (
          <div className="relative inline-block">
            <span
              className="font-extrabold py-1 text-base shadow cursor-pointer border-2 border-[#fff8f0] inline-flex items-center"
              style={{
                background: 'linear-gradient(90deg, #ffb300 0%, #ff5e62 60%, #ff3cac 100%)',
                color: '#fff',
                letterSpacing: '1px',
                textShadow: '0 2px 8px #ffb30033',
                marginRight: '0.5rem',
                minWidth: 0,
                paddingLeft: '1rem',
                paddingRight: '1rem',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setDropdownOpen(v => !v)}
              tabIndex={0}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            >
              {(user.username || user.name)} <span style={{fontWeight: 'normal'}}>▼</span>
            </span>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-36 bg-[#fff8f0] border border-orange-200 shadow-lg z-50 rounded-xl">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[#ff5e62] hover:bg-orange-100 hover:text-orange-600 rounded-t-xl"
                  onClick={() => { setDropdownOpen(false); if (onProfile) onProfile(); }}
                >Profile</button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-[#ffb88c] hover:bg-orange-100 hover:text-orange-600"
                  onClick={() => { setDropdownOpen(false); if (onViewSessions) onViewSessions(); }}
                >View Saved Sessions</button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-orange-100 hover:text-orange-600 rounded-b-xl"
                  onClick={() => { setDropdownOpen(false); onLogout(); navigate('/login'); }}
                >Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="nav-btn">Login</button>
        )}
        {/* Language Dropdown */}
        <div className="relative inline-block" ref={langDropdownRef}>
          <button
            className="nav-btn px-3 py-1"
            onClick={() => setLangDropdownOpen(v => !v)}
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={langDropdownOpen}
          >
            {getLangLabel(i18n.language)} ▼
          </button>
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-24 bg-[#fff8f0] border border-orange-200 shadow-lg z-50 rounded-xl">
              <button
                className={`block w-full text-left px-4 py-2 text-sm rounded-t-xl ${i18n.language.startsWith('en') ? 'text-[#ff5e62] font-bold' : 'text-gray-700'} hover:bg-orange-100 hover:text-orange-600`}
                onClick={() => { i18n.changeLanguage('en'); setLangDropdownOpen(false); }}
              >EN</button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm rounded-b-xl ${i18n.language.startsWith('es') ? 'text-[#ff5e62] font-bold' : 'text-gray-700'} hover:bg-orange-100 hover:text-orange-600`}
                onClick={() => { i18n.changeLanguage('es'); setLangDropdownOpen(false); }}
              >ES</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
