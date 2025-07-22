import React, { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';

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

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex-shrink-0">
            <img src={logo} alt="MiAltar Logo" className="h-10 w-10" />
          </div>
          <div className="flex items-center space-x-4 ml-auto">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                    <a href="#" onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onProfile(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onViewSessions(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Saved Sessions</a>
                    {user.username === 'admin' && (
                      <a href="#" onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onAdminPanel && onAdminPanel(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Panel</a>
                    )}
                    {user.username === 'admin' && (
                      <a href="#" onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onSendNewsletter && onSendNewsletter(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Send Newsletter</a>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <a href="#" onClick={e => { e.preventDefault(); setUserDropdownOpen(false); onLogout(); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</a>
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
                <div className="absolute right-0 mt-2 w-24 origin-top-right bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                  <a href="#" onClick={e => { e.preventDefault(); i18n.changeLanguage('en'); setLangDropdownOpen(false); }} className={`block px-4 py-2 text-sm ${i18n.language.startsWith('en') ? 'text-blue-600 font-bold' : 'text-gray-700'} hover:bg-gray-100`}>EN</a>
                  <a href="#" onClick={e => { e.preventDefault(); i18n.changeLanguage('es'); setLangDropdownOpen(false); }} className={`block px-4 py-2 text-sm ${i18n.language.startsWith('es') ? 'text-blue-600 font-bold' : 'text-gray-700'} hover:bg-gray-100`}>ES</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
