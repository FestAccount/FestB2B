/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1B4332',
        secondary: '#C25E37',
        'orange': {
          600: '#FF6B35',
        },
        'green': {
          100: '#E8F5E9',
          600: '#2E7D32',
          800: '#1B5E20',
        },
        'ios': {
          'background': '#F2F2F7',
          'blue': '#007AFF',
          'gray': {
            'label': '#6C6C70',
            'separator': '#C6C6C8',
            'text': '#3A3A3C',
            'secondary': '#8E8E93',
          }
        }
      },
      spacing: {
        'safe': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
} 