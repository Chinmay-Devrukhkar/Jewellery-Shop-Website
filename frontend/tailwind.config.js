/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false, // Disables all base styles
  },
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

