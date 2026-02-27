/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        civic: {
          green: '#1a6b3c',
          'green-light': '#22c55e',
          'green-muted': '#dcfce7',
          amber: '#d97706',
          'amber-light': '#fbbf24',
          'amber-muted': '#fef3c7',
          crimson: '#b91c1c',
          'crimson-light': '#f87171',
          'crimson-muted': '#fee2e2',
          navy: '#0f172a',
          'navy-mid': '#1e293b',
          'navy-light': '#334155',
          slate: '#f8f7f4',
          'slate-mid': '#e8e6e1',
          'slate-dark': '#94a3b8',
        },
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 5vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 3.5vw, 2.25rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      keyframes: {
        'pulse-ring': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(26, 107, 60, 0.4)' },
          '50%': { boxShadow: '0 0 0 20px rgba(26, 107, 60, 0)' },
        },
        'ticker-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'check-draw': {
          '0%': { strokeDashoffset: '60' },
          '100%': { strokeDashoffset: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker-up': 'ticker-up 0.4s ease-out forwards',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        shimmer: 'shimmer 1.5s linear infinite',
      },
      backgroundImage: {
        'shimmer-gradient':
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
