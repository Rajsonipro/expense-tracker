/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Preserve existing slate palette
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      boxShadow: {
        'glow-indigo': '0 0 20px rgba(99,102,241,0.4)',
        'glow-emerald': '0 0 20px rgba(16,185,129,0.4)',
        'glow-rose': '0 0 20px rgba(239,68,68,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'modal': '0 25px 60px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease both',
        'fade-up': 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'shimmer': 'shimmer 1.6s linear infinite',
        'spin-slow': 'spin 1.5s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'mesh-dark': "radial-gradient(at 20% 20%, rgba(99,102,241,0.06) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(16,185,129,0.03) 0px, transparent 50%)",
      },
    },
  },
  plugins: [],
}
