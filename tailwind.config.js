/** @type {import('tailwindcss').Config} */
import {nextui} from '@nextui-org/react'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        helvetica: ["Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        darkBg: "#161616",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

