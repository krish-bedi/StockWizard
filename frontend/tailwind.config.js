const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["SF", "sans-serif"],
      },
      height: {
        "8v": "8vh",
        "92v": "92vh",
      },
      colors: {
        primary: "rgb(99 102 241)",
        "primary-darker": "rgb(79 70 229)",
        accent: "rgb(14 165 233)",
        "accent-darker": "rgb(2 132 199)",
        secondary: "rgb(16 185 129)",
        "secondary-darker": "rgb(5 150 105)",
        bgprimary: "rgb(10 10 10)",
        hover: "#262626",
      },
    },
  },
  plugins: [require("daisyui"), addVariablesForColors],
};

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
