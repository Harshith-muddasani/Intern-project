/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-based CSS variables
        'theme-bg': 'var(--theme-bg)',
        'theme-text': 'var(--theme-text)',
        'theme-accent': 'var(--theme-accent)',
        'theme-accent-hover': 'var(--theme-accent-hover)',
        'theme-border': 'var(--theme-border)',
        'theme-card-bg': 'var(--theme-card-bg)',
        'theme-sidebar': 'var(--theme-sidebar)',
        'theme-navbar': 'var(--theme-navbar)',
        'theme-canvas': 'var(--theme-canvas)',
        'theme-overlay': 'var(--theme-overlay)',
        'theme-input': 'var(--theme-input)',
        'theme-input-border': 'var(--theme-input-border)',
        
        // Legacy colors (keeping for compatibility)
        background: '#F9FAFB',
        text: '#111827',
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          disabled: '#93C5FD',
        },
        border: '#E5E7EB',
        'cool-gray': '#E5E7EB',
        'charcoal-black': '#111827',
        'sky-blue': '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      transitionProperty: {
        'theme': 'background-color, border-color, color, fill, stroke',
      }
    },
  },
  plugins: [],
}