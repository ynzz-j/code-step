/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand（暖橙/琥珀 —— 黄昏暖光）
        primary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Semantic status colors
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
        // UI token colors (semantic)（深夜蓝底，配黄昏插画氛围）
        'bg-app': '#0a1120',
        'bg-panel': '#111b2e',
        'bg-surface': '#1a2740',
        'bg-elevated': '#243352',
        'text-primary': '#f5f8ff',
        'text-secondary': '#9aa8bd',
        'text-muted': '#64748b',
        'text-disabled': '#3d4c63',
        'accent-primary': '#f59e0b',
        'accent-success': '#22c55e',
        'accent-warning': '#f59e0b',
        'accent-error': '#ef4444',
        'accent-record': '#eab308',
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
        // 手写批注体（mockup 中的 "Keep Practicing" 注释风格）
        hand: [
          'Caveat',
          'Segoe Script',
          'Bradley Hand',
          'Comic Sans MS',
          'cursive',
        ],
      },
      borderRadius: {
        'tool': '8px',
        'brand': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-up-fade': 'slideUpFade 0.5s ease-out forwards',
        'combo-bounce': 'comboBounce 0.3s ease-out',
        'combo-shake': 'comboShake 0.4s ease-out',
        'combo-newbest-in': 'comboNewBestIn 0.4s ease-out forwards',
        'combo-newbest-out': 'comboNewBestOut 0.5s ease-in forwards',
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
        slideUpFade: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        comboBounce: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.15)' },
          '70%': { transform: 'scale(0.97)' },
          '100%': { transform: 'scale(1)' },
        },
        comboShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-2px)' },
          '80%': { transform: 'translateX(2px)' },
        },
        comboNewBestIn: {
          from: { opacity: '0', transform: 'translateY(-10px) scale(0.8)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        comboNewBestOut: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to: { opacity: '0', transform: 'translateY(-10px) scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
};
