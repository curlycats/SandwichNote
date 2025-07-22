/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/renderer/index.html',
    './src/renderer/src/**/*.{svelte,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#e5e7eb',
          hover: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};
