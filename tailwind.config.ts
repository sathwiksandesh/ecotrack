import type { Config } from 'tailwindcss';

/**
 * Design tokens for EcoTrack AI — "Living Data" style.
 * Deeper, richer green palette. Keep in sync with src/app/globals.css.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#059669',
          light:   '#10B981',
          dark:    '#047857',
          deeper:  '#065f46',
        },
        secondary: '#10B981',
        accent:    '#0891B2',
        surface:   '#f0fdf4',
        'surface-2': '#dcfce7',
        ink: {
          DEFAULT: '#052e16',
          2:       '#14532d',
        },
        card:    '#ffffff',
        warning: '#d97706',
      },
      borderRadius: {
        xl:   '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      fontFamily: {
        sans:    ['var(--font-inter)',  'system-ui', 'sans-serif'],
        display: ['var(--font-sora)',   'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(5, 150, 105, 0.08), 0 4px 16px -4px rgba(5, 150, 105, 0.12)',
        'card-hover': '0 4px 8px 0 rgba(5, 150, 105, 0.12), 0 12px 32px -8px rgba(5, 150, 105, 0.2)',
        'glow':    '0 0 32px rgba(5, 150, 105, 0.25)',
        'glow-sm': '0 0 12px rgba(5, 150, 105, 0.2)',
      },
      backgroundImage: {
        'hero-mesh': `
          radial-gradient(ellipse 80% 50% at 20% -10%, rgba(16,185,129,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 10%, rgba(8,145,178,0.1) 0%, transparent 50%),
          radial-gradient(ellipse 100% 80% at 50% 100%, rgba(5,150,105,0.08) 0%, transparent 60%)
        `,
        'cta-gradient': 'linear-gradient(135deg, #047857 0%, #059669 50%, #065f46 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.8) 100%)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
