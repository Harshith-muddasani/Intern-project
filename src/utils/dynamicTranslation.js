import { getCurrentLanguage } from '../i18n';

/**
 * Utility functions for handling dynamic content translation
 * This is useful for content that comes from a database and needs to be translated
 */

// Structure for multilingual database content
// Example: { en: "Apple", "es-MX": "Manzana", hi: "सेब" }
export const createMultilingualContent = (translations) => {
  return {
    ...translations,
    _isMultilingual: true
  };
};

// Get translated content based on current language
export const getTranslatedContent = (content, fallbackLang = 'en') => {
  if (!content || typeof content !== 'object') {
    return content; // Return as-is if not a multilingual object
  }

  if (!content._isMultilingual) {
    return content; // Return as-is if not marked as multilingual
  }

  const currentLang = getCurrentLanguage();
  
  // Try current language first
  if (content[currentLang]) {
    return content[currentLang];
  }

  // Try base language (e.g., 'es' for 'es-MX')
  const baseLang = currentLang.split('-')[0];
  if (content[baseLang]) {
    return content[baseLang];
  }

  // Fall back to specified fallback language
  if (content[fallbackLang]) {
    return content[fallbackLang];
  }

  // Fall back to first available translation
  const availableKeys = Object.keys(content).filter(key => key !== '_isMultilingual');
  if (availableKeys.length > 0) {
    return content[availableKeys[0]];
  }

  return 'Translation not available';
};

// Hook for dynamic content translation
export const useDynamicTranslation = () => {
  const currentLang = getCurrentLanguage();

  const translateDynamic = (content, fallbackLang = 'en') => {
    return getTranslatedContent(content, fallbackLang);
  };

  const translateDynamicArray = (contentArray, fallbackLang = 'en') => {
    return contentArray.map(content => translateDynamic(content, fallbackLang));
  };

  // For form fields that need to handle multilingual input
  const createMultilingualField = (defaultValue = {}) => {
    return {
      en: defaultValue.en || '',
      'es-MX': defaultValue['es-MX'] || '',
      hi: defaultValue.hi || '',
      _isMultilingual: true
    };
  };

  return {
    translateDynamic,
    translateDynamicArray,
    createMultilingualField,
    currentLang
  };
};

// Helper for API calls that need to handle multilingual content
export const prepareMultilingualData = (data, multilingualFields = []) => {
  const prepared = { ...data };
  
  multilingualFields.forEach(field => {
    if (prepared[field] && typeof prepared[field] === 'object') {
      prepared[field] = {
        ...prepared[field],
        _isMultilingual: true
      };
    }
  });

  return prepared;
};

// Example usage for offering categories that come from database:
export const exampleUsage = {
  // In your component:
  // const { translateDynamic } = useDynamicTranslation();
  // 
  // Database content structure:
  // const offeringFromDB = {
  //   id: 1,
  //   name: {
  //     en: "Apple",
  //     "es-MX": "Manzana", 
  //     hi: "सेब",
  //     _isMultilingual: true
  //   },
  //   category: {
  //     en: "Fruits",
  //     "es-MX": "Frutas",
  //     hi: "फल",
  //     _isMultilingual: true
  //   }
  // };
  //
  // Usage in component:
  // const translatedName = translateDynamic(offeringFromDB.name);
  // const translatedCategory = translateDynamic(offeringFromDB.category);
};

export default {
  createMultilingualContent,
  getTranslatedContent,
  useDynamicTranslation,
  prepareMultilingualData
};