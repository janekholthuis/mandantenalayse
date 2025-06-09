/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/**/*.css'],
  safelist: [
    'text-graphit-800',
    'bg-kanzlei-500',
    'bg-kanzlei-600'
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette based on style guide
        'kanzlei': {
          50: 'var(--kanzlei-50)',
          100: 'var(--kanzlei-100)',
          500: 'var(--kanzlei-500)', // Kanzlei-Dunkelblau
          600: 'var(--kanzlei-600)',
          700: 'var(--kanzlei-700)',
          800: 'var(--kanzlei-800)',
          900: 'var(--kanzlei-900)',
        },
        'graphit': {
          50: 'var(--graphit-50)',
          100: 'var(--graphit-100)',
          200: 'var(--graphit-200)',
          300: 'var(--graphit-300)',
          400: 'var(--graphit-400)',
          500: 'var(--graphit-500)', // Graphit-Grau
          600: 'var(--graphit-600)',
          700: 'var(--graphit-700)',
          800: 'var(--graphit-800)',
          900: 'var(--graphit-900)',
        },
        'benefit': {
          50: 'var(--benefit-50)',
          100: 'var(--benefit-100)',
          200: 'var(--benefit-200)',
          300: 'var(--benefit-300)',
          400: 'var(--benefit-400)',
          500: 'var(--benefit-500)', // Benefit-Grün
          600: 'var(--benefit-600)',
          700: 'var(--benefit-700)',
          800: 'var(--benefit-800)',
          900: 'var(--benefit-900)',
        },
        'akzent': {
          50: 'var(--akzent-50)',
          100: 'var(--akzent-100)',
          200: 'var(--akzent-200)',
          300: 'var(--akzent-300)',
          400: 'var(--akzent-400)',
          500: 'var(--akzent-500)', // Akzent-Rot
          600: 'var(--akzent-600)',
          700: 'var(--akzent-700)',
          800: 'var(--akzent-800)',
          900: 'var(--akzent-900)',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};