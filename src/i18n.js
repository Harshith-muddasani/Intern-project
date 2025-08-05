import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files for immediate loading (fallback)
import en from './locales/en.json';
import es from './locales/es.json';
import hi from './locales/hi.json';

// Language detection options
const detection = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  caches: ['localStorage'],
  lookupLocalStorage: 'i18nextLng',
};

i18n
  .use(Backend) // Enable lazy loading
  .use(LanguageDetector) // Enable language detection
  .use(initReactI18next)
  .init({
    // Fallback resources for immediate availability
    resources: {
      en: { translation: en },
      es: { translation: es },
      hi: { translation: hi },
    },
    
    // Language settings
    lng: 'en', // Default language
    fallbackLng: 'en',
    supportedLngs: ['en', 'es-MX', 'hi'], // Supported languages
    
    // Language detection
    detection,
    
    // Backend configuration for lazy loading
    backend: {
      loadPath: '/src/locales/{{lng}}.json',
    },
    
    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Debug mode (disable in production)
    debug: import.meta.env.DEV,
    
    // Namespace settings
    defaultNS: 'translation',
    ns: ['translation'],
    
    // React-specific settings
    react: {
      useSuspense: false, // Disable suspense for better error handling
    },
  });

// Custom language change handler with persistence
export const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('i18nextLng', lang);
};

// Get current language
export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

// Get available languages
export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es-MX', name: 'Spanish (Mexico)', nativeName: 'Español (México)' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  ];
};

export default i18n; 