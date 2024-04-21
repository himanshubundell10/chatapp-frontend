/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      "synthwave",
      "valentine",
      "aqua",
      "coffee",
      "dim",
      "black",
      "forest",
      "halloween",
      "retro",
      "luxury",
    ],
  },
};
