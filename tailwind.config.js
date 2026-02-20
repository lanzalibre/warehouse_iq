/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        scanLine: {
          '0%':   { top: '0%' },
          '50%':  { top: 'calc(100% - 2px)' },
          '100%': { top: '0%' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'scan-line': 'scanLine 1.8s linear infinite',
        'fade-in':   'fadeIn 0.35s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
    },
  },
  plugins: [],
}
