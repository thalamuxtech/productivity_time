/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F1FF',
          100: '#E0E1FF',
          200: '#C3C5FF',
          300: '#A5A7FF',
          400: '#8183FF',
          500: '#6C5CE7',
          600: '#5A3FD6',
          700: '#4930B8',
          800: '#3B2594',
          900: '#2D1B70',
          950: '#1A1045',
        },
        accent: {
          50: '#FFF0F7',
          100: '#FFE0EF',
          200: '#FFC2DF',
          300: '#FF94C7',
          400: '#FF5CA8',
          500: '#FF2D8A',
          600: '#E91E6B',
          700: '#C41456',
          800: '#A31149',
          900: '#7A0D38',
          950: '#4A0621',
        },
        surface: {
          50: '#FAFBFF',
          100: '#F4F6FF',
          200: '#EAEDFF',
          300: '#D8DDFF',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.72)',
          dark: 'rgba(15, 23, 42, 0.72)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'SF Pro Display', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(108, 92, 231, 0.08)',
        'glass-lg': '0 16px 48px rgba(108, 92, 231, 0.12)',
        'glass-xl': '0 24px 64px rgba(108, 92, 231, 0.16)',
        'premium': '0 4px 24px -4px rgba(108, 92, 231, 0.2)',
        'premium-lg': '0 8px 40px -8px rgba(108, 92, 231, 0.25)',
        'premium-hover': '0 12px 48px -8px rgba(108, 92, 231, 0.3)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1)',
        'fab': '0 8px 24px -4px rgba(108, 92, 231, 0.4)',
        'fab-hover': '0 12px 32px -4px rgba(108, 92, 231, 0.5)',
        'glow': '0 0 40px rgba(108, 92, 231, 0.15)',
        'glow-accent': '0 0 40px rgba(255, 45, 138, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-premium': 'linear-gradient(135deg, #6C5CE7 0%, #FF2D8A 100%)',
        'gradient-premium-subtle': 'linear-gradient(135deg, rgba(108, 92, 231, 0.08) 0%, rgba(255, 45, 138, 0.08) 100%)',
        'gradient-premium-dark': 'linear-gradient(135deg, rgba(108, 92, 231, 0.15) 0%, rgba(255, 45, 138, 0.15) 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(108, 92, 231, 0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 45, 138, 0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(108, 92, 231, 0.05) 0px, transparent 50%)',
        'gradient-mesh-dark': 'radial-gradient(at 40% 20%, rgba(108, 92, 231, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(255, 45, 138, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(108, 92, 231, 0.08) 0px, transparent 50%)',
        'dot-pattern': 'radial-gradient(circle, rgba(108, 92, 231, 0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-pattern': '24px 24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.2s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-bounce': 'scaleBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'drawer-up': 'drawerUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'count-up': 'countUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleBounce: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 92, 231, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 92, 231, 0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        drawerUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        countUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
