/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        dark: {
          bg: '#0a0e1a',
          card: '#131826',
          border: '#1e2537',
        },
        // Brand colors
        brand: {
          blue: '#3b82f6',
          emerald: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        },
        // Light theme colors
        light: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'elevated': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}
