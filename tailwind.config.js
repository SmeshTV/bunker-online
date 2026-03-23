/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bunker: {
          dark: '#0a0a0a',
          dark2: '#141414',
          dark3: '#1a1a1a',
          accent: '#ff4444',
          accent2: '#ff6b35',
          success: '#44ff88',
          warning: '#ffaa00',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #ff4444, 0 0 10px #ff4444' },
          '100%': { boxShadow: '0 0 20px #ff4444, 0 0 30px #ff4444' },
        }
      }
    },
  },
  plugins: [],
}