/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

/**
Note: Add below line above to enable toggle based theme switching
  darkMode: 'class', // switched from a CSS mechanism controlled by the OS (media) to one controlled by the DOM (class)
*/
