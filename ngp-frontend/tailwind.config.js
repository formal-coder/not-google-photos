/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // switched from a CSS mechanism controlled by the OS (media) to one controlled by the DOM (class)
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

/**
Note: Add or remove below line above to enable/disable toggle based theme switching
  darkMode: 'class', // switch from a CSS mechanism controlled by the OS (media) to one controlled by the DOM (class)
*/
