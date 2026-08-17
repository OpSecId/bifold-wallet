/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.js'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0F',
        slate: '#16161C',
        graphite: '#1C1C24',
        steel: '#2A2A32',
        signal: '#F89038',
        core: '#A8B8B8',
        bg: '#0B0B0F',
        surface: '#16161C',
        card: '#1C1C24',
        accent: '#F89038',
        elevated: '#2A2A32',
        muted: '#8E8E93',
        danger: '#FF453A',
      },
    },
  },
  plugins: [],
}
