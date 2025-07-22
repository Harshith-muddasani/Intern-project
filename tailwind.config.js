/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
      boxShadow: {
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}