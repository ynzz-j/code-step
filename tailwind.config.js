/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        success: {
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'combo-bounce': 'comboBounce 0.3s ease-out',
        'combo-shake': 'comboShake 0.4s ease-out',
        'combo-newbest': 'comboNewBest 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'screen-shake': 'screenShake 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        comboBounce: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        comboShake: {
          '0%, 100%': { transform: 'translateX(0)', color: 'inherit' },
          '10%': { transform: 'translateX(-6px)', color: '#f87171' },
          '20%': { transform: 'translateX(6px)', color: '#f87171' },
          '30%': { transform: 'translateX(-5px)', color: '#f87171' },
          '40%': { transform: 'translateX(5px)', color: '#ef4444' },
          '50%': { transform: 'translateX(-3px)', color: '#ef4444' },
          '60%': { transform: 'translateX(3px)', color: '#ef4444' },
          '70%': { transform: 'translateX(-2px)', color: '#f87171' },
          '80%': { transform: 'translateX(2px)', color: '#f87171' },
          '90%': { transform: 'translateX(-1px)', color: '#f87171' },
        },
        comboNewBest: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '50%': { transform: 'translateY(5px)', opacity: '1' },
          '70%': { transform: 'translateY(-3px)' },
          '85%': { transform: 'translateY(1px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        screenShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-3px)' },
          '30%': { transform: 'translateX(3px)' },
          '45%': { transform: 'translateX(-2px)' },
          '60%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-1px)' },
        },
      },
    },
  },
  plugins: [],
};
