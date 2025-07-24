import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSelector = () => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonMouseEnter = (e) => {
    e.currentTarget.style.color = '#ff5e62';
  };
  const handleButtonMouseLeave = (e) => {
    e.currentTarget.style.color = 'var(--theme-text, #f3f4f6)';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg h-9 min-h-0 text-sm"
        style={{ 
          backgroundColor: 'var(--theme-card-bg, #1f2937)', // fallback for dark
          border: `1px solid var(--theme-border, #374151)`,
          color: 'var(--theme-text, #f3f4f6)'
        }}
      >
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: themes[currentTheme].colors.accent }}
        />
        <span className="text-sm font-medium">{themes[currentTheme].name}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-2 w-48 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{ 
            backgroundColor: 'var(--theme-card-bg, #1f2937)', // fallback for dark
            border: `1px solid var(--theme-border, #374151)`
          }}
        >
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => {
                changeTheme(key);
                setIsOpen(false);
              }}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:opacity-80 ${
                currentTheme === key ? 'opacity-50' : ''
              }`}
              style={{ 
                color: 'var(--theme-text, #f3f4f6)',
                backgroundColor: 'transparent',
                borderBottom: `1px solid var(--theme-border, #374151)`
              }}
            >
              <div 
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <div>
                <div className="font-medium text-sm">{theme.name}</div>
                <div className="text-xs opacity-70">
                  {key === 'light' && 'Clean & bright'}
                  {key === 'dark' && 'Easy on the eyes'}
                  {key === 'pastel' && 'Soft & warm'}
                  {key === 'diaDeMuertos' && 'Vibrant & festive'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;