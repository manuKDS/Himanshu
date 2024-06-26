/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#145388",
        purple: "#DAE1FC",
        lightGray: "#3a3a3a",
        gray1: "#6c757d",
      },
      boxShadow: {
        cb: " 0 3px 20px rgba(0, 0, 0,0.1)",
      },
      backgroundImage: {
        login_bg: "url('../images/login_bg.jpg')",
      },
    },
    fontFamily: {
      roboto: ["Roboto"],
    },
  },
  plugins: [],
};
