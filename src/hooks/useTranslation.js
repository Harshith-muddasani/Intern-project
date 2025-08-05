import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../i18n';

// Custom hook that extends react-i18next's useTranslation with additional utilities
export const useTranslation = (namespace = 'translation') => {
  const { t, i18n, ready } = useI18nextTranslation(namespace);

  // Translation function with fallback
  const translate = (key, options = {}) => {
    if (!ready) return key; // Return key if translations not loaded yet
    
    const translation = t(key, options);
    
    // If translation returns the key (meaning translation not found), 
    // try to provide a sensible fallback
    if (translation === key && !options.defaultValue) {
      console.warn(`Translation missing for key: ${key}`);
      // Return a formatted version of the key as fallback
      return key.split('.').pop().replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }
    
    return translation;
  };

  // Translate with interpolation
  const translateWithValues = (key, values, options = {}) => {
    return translate(key, { ...options, ...values });
  };

  // Translate array of items
  const translateArray = (keys, options = {}) => {
    return keys.map(key => translate(key, options));
  };

  // Get current language info
  const currentLanguage = getCurrentLanguage();
  const availableLanguages = getAvailableLanguages();
  const currentLangInfo = availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];

  return {
    t: translate,
    translate,
    translateWithValues,
    translateArray,
    changeLanguage,
    currentLanguage,
    currentLangInfo,
    availableLanguages,
    isReady: ready,
    i18n
  };
};

// Hook for form validation messages
export const useValidationTranslation = () => {
  const { translate } = useTranslation();

  const getValidationMessage = (field, rule, value) => {
    const key = `validation.${rule}`;
    return translate(key, { field, value });
  };

  return {
    required: (field) => getValidationMessage(field, 'required'),
    emailInvalid: () => translate('validation.emailInvalid'),
    passwordTooShort: (minLength) => translate('validation.passwordTooShort', { minLength }),
    passwordsDoNotMatch: () => translate('validation.passwordsDoNotMatch'),
  };
};

// Hook for navigation translations
export const useNavigationTranslation = () => {
  const { translate } = useTranslation();

  return {
    home: () => translate('navigation.home'),
    sessions: () => translate('navigation.sessions'),
    admin: () => translate('navigation.admin'),
    settings: () => translate('navigation.settings'),
  };
};

export default useTranslation;