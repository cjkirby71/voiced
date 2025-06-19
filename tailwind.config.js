/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Trustworthy blue - blue-600
        'primary-50': '#EFF6FF', // Light blue background - blue-50
        'primary-100': '#DBEAFE', // Light blue - blue-100
        'primary-500': '#3B82F6', // Medium blue - blue-500
        'primary-600': '#2563EB', // Primary blue - blue-600
        'primary-700': '#1D4ED8', // Dark blue - blue-700
        'primary-900': '#1E3A8A', // Very dark blue - blue-900

        // Secondary Colors
        'secondary': '#64748B', // Professional slate gray - slate-500
        'secondary-100': '#F1F5F9', // Light slate - slate-100
        'secondary-200': '#E2E8F0', // Light slate border - slate-200
        'secondary-300': '#CBD5E1', // Medium light slate - slate-300
        'secondary-400': '#94A3B8', // Medium slate - slate-400
        'secondary-500': '#64748B', // Secondary slate - slate-500
        'secondary-600': '#475569', // Dark slate - slate-600
        'secondary-700': '#334155', // Darker slate - slate-700
        'secondary-800': '#1E293B', // Very dark slate - slate-800

        // Accent Colors
        'accent': '#DC2626', // Strategic red - red-600
        'accent-50': '#FEF2F2', // Light red background - red-50
        'accent-100': '#FEE2E2', // Light red - red-100
        'accent-500': '#EF4444', // Medium red - red-500
        'accent-600': '#DC2626', // Accent red - red-600
        'accent-700': '#B91C1C', // Dark red - red-700

        // Background Colors
        'background': '#F8FAFC', // Clean off-white - slate-50
        'surface': '#FFFFFF', // Pure white - white

        // Text Colors
        'text-primary': '#0F172A', // Near-black - slate-900
        'text-secondary': '#475569', // Medium gray - slate-600
        'text-muted': '#64748B', // Muted text - slate-500

        // Status Colors
        'success': '#059669', // Confident green - emerald-600
        'success-50': '#ECFDF5', // Light green background - emerald-50
        'success-100': '#D1FAE5', // Light green - emerald-100
        'success-500': '#10B981', // Medium green - emerald-500
        'success-600': '#059669', // Success green - emerald-600

        'warning': '#D97706', // Amber warning - amber-600
        'warning-50': '#FFFBEB', // Light amber background - amber-50
        'warning-100': '#FEF3C7', // Light amber - amber-100
        'warning-500': '#F59E0B', // Medium amber - amber-500
        'warning-600': '#D97706', // Warning amber - amber-600

        'error': '#DC2626', // Clear red error - red-600
        'error-50': '#FEF2F2', // Light red background - red-50
        'error-100': '#FEE2E2', // Light red - red-100
        'error-500': '#EF4444', // Medium red - red-500
        'error-600': '#DC2626', // Error red - red-600

        // Border Colors
        'border': '#E2E8F0', // Minimal border - slate-200
        'border-light': '#F1F5F9', // Light border - slate-100
        'border-dark': '#CBD5E1', // Dark border - slate-300
      },
      fontFamily: {
        'sans': ['Source Sans Pro', 'system-ui', 'sans-serif'],
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'monospace'],
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
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      boxShadow: {
        'civic': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'civic-md': '0 4px 6px rgba(0, 0, 0, 0.07)',
        'civic-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '100': '100',
        '110': '110',
        '200': '200',
        '300': '300',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}