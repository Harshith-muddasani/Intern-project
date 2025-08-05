import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../i18n';
import { ChevronDown, Globe } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const dropdownRef = useRef(null);
  
  const languages = getAvailableLanguages();
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setCurrentLang(langCode);
    setIsOpen(false);
  };

  if (variant === 'buttons') {
    return (
      <div className="flex items-center gap-2">
        <Globe 
          className="h-4 w-4" 
          style={{ color: 'var(--theme-text)' }}
        />
        <div className="flex bg-opacity-20 rounded-lg p-1" style={{ backgroundColor: 'var(--theme-accent)' }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                currentLang === lang.code
                  ? 'shadow-sm text-white'
                  : 'hover:bg-opacity-10'
              }`}
              style={{
                backgroundColor: currentLang === lang.code 
                  ? 'var(--theme-accent)' 
                  : 'transparent',
                color: currentLang === lang.code 
                  ? 'white' 
                  : 'var(--theme-text)'
              }}
              title={lang.name}
            >
              {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-opacity-10"
        style={{ 
          backgroundColor: isOpen ? 'var(--theme-accent-light)' : 'transparent',
          color: 'var(--theme-text)',
          border: `1px solid ${isOpen ? 'var(--theme-accent)' : 'var(--theme-border)'}`
        }}
        title={t('languageSelector')}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentLanguage.nativeName}
        </span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-lg border z-50 transition-all duration-200"
          style={{
            backgroundColor: 'var(--theme-card-bg)',
            borderColor: 'var(--theme-border)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center justify-between ${
                currentLang === lang.code
                  ? 'font-semibold'
                  : 'hover:bg-opacity-5'
              }`}
              style={{
                backgroundColor: currentLang === lang.code 
                  ? 'var(--theme-accent-light)' 
                  : 'transparent',
                color: currentLang === lang.code 
                  ? 'var(--theme-accent)' 
                  : 'var(--theme-text)'
              }}
            >
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs opacity-60">{lang.name}</div>
              </div>
              {currentLang === lang.code && (
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--theme-accent)' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;