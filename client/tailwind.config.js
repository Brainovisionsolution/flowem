/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cambria Math"', 'Cambria', 'Georgia', 'serif'],
        sans: ['"Cambria Math"', 'Cambria', 'Georgia', 'serif'],
      },
      colors: {
        flow: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#b4c6fc',
          400: '#8da2f8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e1b4b',
          950: '#0a0d18',
        },
        slate: {
          850: '#151c2e',
          900: '#0f172a',
          950: '#070b14',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.45)',
        'morphic-inset': 'inset 2px 2px 5px rgba(0,0,0,0.4), inset -2px -2px 5px rgba(255,255,255,0.05)',
        'morphic-card': '0 10px 30px -5px rgba(2, 6, 23, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-indigo': '0 0 30px rgba(99, 102, 241, 0.25)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

