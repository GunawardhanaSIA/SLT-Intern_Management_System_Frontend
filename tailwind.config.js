/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "blue": "#0056A4",
        "green": "#4DB848",
        "red": "#E83434",
        "gray": "#757575",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui(),
    require('daisyui'),
  ],
}

