import React, { createContext, useContext, useState, useEffect } from 'react';

const themes = {
  light: {
    name: 'Light',
    colors: {
      bg: '#f9f9f9',
      text: '#111827',
      accent: '#4A90E2',
      accentHover: '#357ABD',
      border: '#e5e7eb',
      cardBg: '#ffffff',
      sidebar: '#ffffff',
      navbar: '#ffffff',
      canvas: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
      input: '#ffffff',
      inputBorder: '#d1d5db'
    }
  },
  dark: {
    name: 'Dark',
    colors: {
      bg: '#121212',
      text: '#f3f4f6',
      accent: '#BB86FC',
      accentHover: '#9C6AFA',
      border: '#374151',
      cardBg: '#1f2937',
      sidebar: '#1f2937',
      navbar: '#1f2937',
      canvas: '#374151',
      overlay: 'rgba(0, 0, 0, 0.7)',
      input: '#374151',
      inputBorder: '#4b5563'
    }
  },
  pastel: {
    name: 'Pastel',
    colors: {
      bg: '#fdf6f0',
      text: '#444444',
      accent: '#F7B2AD',
      accentHover: '#F5A099',
      border: '#e8d5c4',
      cardBg: '#fefcfa',
      sidebar: '#fefcfa',
      navbar: '#fefcfa',
      canvas: '#ffffff',
      overlay: 'rgba(68, 68, 68, 0.5)',
      input: '#ffffff',
      inputBorder: '#e8d5c4'
    }
  },
  diaDeMuertos: {
    name: 'Día de Muertos',
    colors: {
      bg: '#2E1A47',
      text: '#FDD835',
      accent: '#FF6F00',
      accentHover: '#E65100',
      border: '#4A148C',
      cardBg: '#3A2459',
      sidebar: '#3A2459',
      navbar: '#3A2459',
      canvas: '#4A148C',
      overlay: 'rgba(46, 26, 71, 0.8)',
      input: '#4A148C',
      inputBorder: '#7B1FA2'
    }
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('theme', themeName);
    }
  };

  const theme = themes[currentTheme];

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }, [theme]);

  const value = {
    currentTheme,
    theme,
    themes,
    changeTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <div 
        className="min-h-screen transition-colors duration-300"
        style={{ 
          backgroundColor: theme.colors.bg,
          color: theme.colors.text 
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};