/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./**/*.js",
  ],
  theme: {
    extend: {
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        },
        colors: {
            background: '#0B0A10',
            surface: '#13111C',
            surface2: '#1C1929',
            primary: '#6D28D9',
            primaryHover: '#5B21B6',
            textPrimary: '#F8FAFC',
            textSecondary: '#94A3B8',
        },
        backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        }
    }
  },
  plugins: [],
}
