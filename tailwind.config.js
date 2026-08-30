/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--bg-canvas)',
        surface: {
          DEFAULT: 'var(--bg-surface)',
          soft: 'var(--bg-surface-soft)',
          muted: 'var(--bg-surface-muted)',
          border: 'var(--border-surface)',
        },
        sidebar: {
          DEFAULT: 'var(--bg-sidebar)',
          border: 'var(--border-sidebar)',
          hover: 'var(--hover-sidebar)',
        },
        mint: {
          50: '#F0FAF5',
          100: '#D8F3E5',
          200: '#B8EAD0',
          300: '#A7E8C8',
          400: '#64C59F',
          500: '#38A37F', // Primary Brand
          600: '#2D8667', // Hover
          700: '#236951',
          800: '#1B4938', // Deep Pine
          900: '#123327',
        },
        pine: 'var(--deep-pine)',
        sand: {
          50: 'var(--sand-50)',
          100: 'var(--sand-100)',
          200: 'var(--sand-200)',
          300: 'var(--sand-300)',
          400: 'var(--sand-400)',
          500: '#948775',
        },
        status: {
          activeBg: '#D8F3E5',
          activeText: '#1B4938',
          pendingBg: '#FDEED9',
          pendingText: '#8F5B1E',
          rejectedBg: '#FBE8E6',
          rejectedText: '#9E3324',
          infoBg: '#E1F0FA',
          infoText: '#1E588F',
        },
        terracotta: {
          DEFAULT: '#C85A48',
          hover: '#B34B3A',
        },
        neutral: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Outfit', 'Inter', 'system-ui', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 8px 24px -4px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'dropdown': '0 10px 30px -5px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.08)',
        'mint-glow': '0 0 15px rgba(56, 163, 127, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
