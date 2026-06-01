/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { 50: '#fdf8f0', 100: '#faefd9', 200: '#f4d9a0', 300: '#eec165', 400: '#e8a83a', 500: '#c8841a', 600: '#a66614', 700: '#854f10', 800: '#6b3f0f', 900: '#57330d' },
        gold: { DEFAULT: '#C8841A', light: '#E8A83A', dark: '#A66614' },
        dark: { DEFAULT: '#1a1a2e', card: '#16213e', light: '#0f3460' }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 4px 24px rgba(200,132,26,0.25)',
        card: '0 8px 32px rgba(0,0,0,0.12)',
      }
    },
  },
  plugins: [],
}
