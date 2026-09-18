/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#050308',
          900: '#0a0710',
          850: '#0e0a18',
          800: '#141021',
          700: '#1e1830',
          600: '#2a2240',
        },
        crimson: {
          300: '#ff8fa3',
          400: '#ff5c73',
          500: '#ff2b4d',
          600: '#e01238',
          700: '#b00c2b',
        },
        ember: {
          300: '#ffd08a',
          400: '#ffb347',
          500: '#f5b942',
        },
        ink: {
          200: '#e2ddf5',
          300: '#c9c3e0',
          400: '#9a92c2',
          500: '#6f66a3',
          600: '#544c82',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Rajdhani"', 'sans-serif'],
        mono: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 43, 77, 0.35)',
        'glow-lg': '0 0 60px rgba(255, 43, 77, 0.25)',
        ink: '0 0 20px rgba(111, 102, 163, 0.35)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 12px rgba(255,43,77,0.5))' },
          '50%': { opacity: '0.85', filter: 'drop-shadow(0 0 28px rgba(255,43,77,0.8))' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-40px,-60px,0)' },
        },
        'fog-drift': {
          '0%': { transform: 'translateX(-5%) translateY(0)' },
          '50%': { transform: 'translateX(3%) translateY(-2%)' },
          '100%': { transform: 'translateX(-5%) translateY(0)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 22%, 55%': { opacity: '0.4' },
        },
        'crack-pulse': {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.35' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        drift: 'drift 60s linear infinite alternate',
        'fog-drift': 'fog-drift 24s ease-in-out infinite',
        flicker: 'flicker 6s linear infinite',
        'crack-pulse': 'crack-pulse 5s ease-in-out infinite',
        rise: 'rise 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
