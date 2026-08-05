/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712',
          card: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: '#6366f1',
          cyan: '#06b6d4',
          purple: '#a855f7',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'orbit-slow': 'orbit 40s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'aurora': 'aurora 15s ease infinite alternate'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 25px rgba(168, 85, 247, 0.8))' }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
