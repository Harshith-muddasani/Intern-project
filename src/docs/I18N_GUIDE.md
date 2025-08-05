# Internationalization (i18n) Implementation Guide

## Overview
This guide explains how to use the comprehensive i18n system implemented in the MiAltar application. The system supports English (default), Hindi, and Mexican Spanish with localStorage persistence, lazy loading, and dynamic content translation.

## Features Implemented

✅ **Multi-language Support**: English (en), Hindi (hi), Mexican Spanish (es-MX)  
✅ **Language Switcher**: Dropdown component in navbar  
✅ **localStorage Persistence**: Language selection persists across sessions  
✅ **Lazy Loading**: Translation files loaded on demand for performance  
✅ **Dynamic Content**: Support for database content translation  
✅ **Custom Hooks**: Enhanced translation utilities  
✅ **Fallback System**: Graceful handling of missing translations  

## File Structure

```
src/
├── locales/
│   ├── en.json          # English translations
│   ├── es.json          # Spanish translations  
│   └── hi.json          # Hindi translations
├── components/
│   └── LanguageSwitcher.jsx  # Language switcher component
├── hooks/
│   └── useTranslation.js     # Enhanced translation hooks
├── utils/
│   └── dynamicTranslation.js # Dynamic content utilities
└── i18n.js              # i18n configuration
```

## Basic Usage

### 1. Using translations in components

```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button>{t('login')}</button>
    </div>
  );
}
```

### 2. Using the enhanced custom hook

```jsx
import { useTranslation } from '../hooks/useTranslation';

function EnhancedComponent() {
  const { 
    translate, 
    translateWithValues, 
    currentLanguage, 
    changeLanguage 
  } = useTranslation();
  
  return (
    <div>
      <h1>{translate('welcome')}</h1>
      <p>{translateWithValues('greeting', { name: 'John' })}</p>
      <p>Current language: {currentLanguage}</p>
      <button onClick={() => changeLanguage('hi')}>
        Switch to Hindi
      </button>
    </div>
  );
}
```

### 3. Adding the Language Switcher

```jsx
import LanguageSwitcher from './components/LanguageSwitcher';

function NavBar() {
  return (
    <nav>
      {/* Other nav items */}
      <LanguageSwitcher variant="dropdown" />
      {/* Or use button variant */}
      <LanguageSwitcher variant="buttons" />
    </nav>
  );
}
```

## Translation Files

### Structure
All translation files follow the same JSON structure with nested objects for organization:

```json
{
  "welcome": "Welcome to MiAltar",
  "login": "Login",
  "logout": "Logout",
  "validation": {
    "required": "This field is required",
    "emailInvalid": "Please enter a valid email address"
  },
  "navigation": {
    "home": "Home",
    "sessions": "Sessions",
    "admin": "Admin"
  }
}
```

### Adding New Translations

1. Add the key-value pair to all language files (`en.json`, `es.json`, `hi.json`)
2. Use nested objects for logical grouping
3. Keep keys consistent across all language files

```json
// en.json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature description"
  }
}

// es.json  
{
  "newFeature": {
    "title": "Nueva Función",
    "description": "Esta es la descripción de una nueva función"
  }
}

// hi.json
{
  "newFeature": {
    "title": "नई सुविधा", 
    "description": "यह एक नई सुविधा का विवरण है"
  }
}
```

## Dynamic Database Content Translation

For content that comes from a database and needs translation:

### 1. Database Content Structure

```javascript
// When saving to database, structure multilingual content like this:
const offeringData = {
  name: {
    en: "Apple",
    "es-MX": "Manzana",
    hi: "सेब",
    _isMultilingual: true
  },
  category: {
    en: "Fruits", 
    "es-MX": "Frutas",
    hi: "फल",
    _isMultilingual: true
  }
};
```

### 2. Using Dynamic Translation Hook

```jsx
import { useDynamicTranslation } from '../utils/dynamicTranslation';

function OfferingComponent({ offering }) {
  const { translateDynamic } = useDynamicTranslation();
  
  return (
    <div>
      <h3>{translateDynamic(offering.name)}</h3>
      <p>Category: {translateDynamic(offering.category)}</p>
    </div>
  );
}
```

### 3. Creating Multilingual Forms

```jsx
import { useDynamicTranslation } from '../utils/dynamicTranslation';

function MultilingualForm() {
  const { createMultilingualField, currentLang } = useDynamicTranslation();
  const [name, setName] = useState(createMultilingualField());
  
  const handleNameChange = (value) => {
    setName(prev => ({
      ...prev,
      [currentLang]: value
    }));
  };
  
  return (
    <form>
      <input
        value={name[currentLang] || ''}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder={`Name in ${currentLang}`}
      />
    </form>
  );
}
```

## Form Validation with i18n

```jsx
import { useValidationTranslation } from '../hooks/useTranslation';

function LoginForm() {
  const validation = useValidationTranslation();
  const [errors, setErrors] = useState({});
  
  const validateForm = (data) => {
    const newErrors = {};
    
    if (!data.email) {
      newErrors.email = validation.required('Email');
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = validation.emailInvalid();
    }
    
    if (!data.password) {
      newErrors.password = validation.required('Password');
    } else if (data.password.length < 6) {
      newErrors.password = validation.passwordTooShort(6);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return (
    <form>
      <input type="email" />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input type="password" />
      {errors.password && <span className="error">{errors.password}</span>}
    </form>
  );
}
```

## Language Switching

### Programmatic Language Change

```jsx
import { changeLanguage } from '../i18n';

function LanguageButtons() {
  return (
    <div>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es-MX')}>Español</button>
      <button onClick={() => changeLanguage('hi')}>हिंदी</button>
    </div>
  );
}
```

### Detecting User's Preferred Language

The system automatically detects language from:
1. localStorage (previously saved preference)
2. Browser language settings
3. HTML lang attribute
4. Falls back to English

## Performance Optimization

### Lazy Loading
Translation files are loaded on demand:

```javascript
// i18n.js configuration enables lazy loading
backend: {
  loadPath: '/src/locales/{{lng}}.json',
}
```

### Caching
- Translations are cached in localStorage
- Language preference is persisted
- No re-downloads on subsequent visits

## Testing Translations

### 1. Manual Testing
- Switch between languages using the dropdown
- Check if text updates immediately  
- Verify persistence after page reload
- Test with browser in different languages

### 2. Missing Translation Detection
The system logs warnings for missing translations:

```javascript
// Check browser console for warnings like:
// "Translation missing for key: someKey"
```

### 3. Automated Testing Example

```javascript
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

test('renders welcome message in different languages', async () => {
  // Test English
  i18n.changeLanguage('en');
  render(
    <I18nextProvider i18n={i18n}>
      <WelcomeComponent />
    </I18nextProvider>
  );
  expect(screen.getByText('Welcome to MiAltar')).toBeInTheDocument();
  
  // Test Spanish
  i18n.changeLanguage('es-MX');
  await screen.findByText('Bienvenido a MiAltar');
  
  // Test Hindi
  i18n.changeLanguage('hi');
  await screen.findByText('मी अल्तार में आपका स्वागत है');
});
```

## Best Practices

### 1. Key Naming
- Use descriptive, hierarchical keys: `validation.emailInvalid`
- Keep keys consistent across languages
- Use camelCase for JavaScript compatibility

### 2. Pluralization
```json
{
  "itemCount": "{{count}} item",
  "itemCount_plural": "{{count}} items"
}
```

Usage:
```jsx
{t('itemCount', { count: items.length })}
```

### 3. Interpolation
```json
{
  "greeting": "Hello {{name}}, welcome to {{appName}}!"
}
```

Usage:
```jsx
{t('greeting', { name: user.name, appName: 'MiAltar' })}
```

### 4. Context-aware Translations
```json
{
  "button": {
    "save": "Save",
    "cancel": "Cancel", 
    "delete": "Delete"
  }
}
```

### 5. Accessibility
- Ensure language switcher is keyboard accessible
- Use proper lang attributes on HTML elements
- Test with screen readers in different languages

## Troubleshooting

### Common Issues

1. **Translations not loading**
   - Check file paths in `backend.loadPath`
   - Verify JSON syntax in translation files
   - Check browser network tab for failed requests

2. **Language not persisting**
   - Verify localStorage is available
   - Check if `detection.caches` includes 'localStorage'

3. **Fallback not working**
   - Ensure `fallbackLng` is set in i18n config
   - Verify fallback language file exists

4. **Dynamic content not translating**
   - Check if content has `_isMultilingual: true` flag
   - Verify useDynamicTranslation hook is being used
   - Ensure content structure matches expected format

### Debug Mode
Enable debug mode in development:

```javascript
// i18n.js
debug: process.env.NODE_ENV === 'development'
```

This will log translation loading and missing key information to the console.

## Contributing New Languages

To add a new language:

1. Create new translation file: `src/locales/[lang-code].json`
2. Add all existing translation keys with appropriate translations
3. Update `supportedLngs` array in `i18n.js`
4. Add language option to `getAvailableLanguages()` function
5. Test thoroughly with native speakers if possible

Example for adding French:

```javascript
// i18n.js
supportedLngs: ['en', 'es-MX', 'hi', 'fr']

// In getAvailableLanguages():
{ code: 'fr', name: 'French', nativeName: 'Français' }
```

## API Integration

For backend integration with multilingual content:

```javascript
// API helper for multilingual data
const apiHelpers = {
  // Prepare data for API submission
  prepareMultilingualData: (data, fields) => {
    const prepared = { ...data };
    fields.forEach(field => {
      if (prepared[field]) {
        prepared[field]._isMultilingual = true;
      }
    });
    return prepared;
  },
  
  // Process API response with multilingual content
  processMultilingualResponse: (data, fields) => {
    fields.forEach(field => {
      if (data[field] && typeof data[field] === 'object') {
        data[field]._isMultilingual = true;
      }
    });
    return data;
  }
};
```

This comprehensive i18n system provides a robust foundation for multilingual applications with performance optimization, persistence, and extensibility.