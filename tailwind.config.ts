import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // FAEVision Executive Color System
        executive: {
          blue: '#3b82f6',
          gold: '#f59e0b',
          red: '#ef4444',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        professional: {
          green: '#10b981',
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
        },
        ai: {
          purple: '#a855f7',
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'executive-xl': [
          '1.5rem',
          { lineHeight: '2rem', letterSpacing: '-0.025em', fontWeight: '700' },
        ],
        'executive-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'executive-base': ['1rem', { lineHeight: '1.625rem', fontWeight: '400' }],
      },
      spacing: {
        executive: '44px', // Minimum touch target for executives
      },
      borderRadius: {
        executive: '0.5rem',
      },
    },
  },
  plugins: [],
}
export default config
