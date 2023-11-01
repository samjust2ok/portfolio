/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "320px",
        xs: "420px",
      },
      colors: {
        "primary-color": "#161616",
        "secondary-color": "#1a1a1a",
        "tertiary-color": "#121212",
        "logo-color": "#8a8a8a",
        "primary-text-color": "#9a9a9a",
        "primary-text-color-darker": "#8a8a8a",
        "primary-text-hover-color": "#dcdcdc",
        "border-color": "#242424",
        "accent-color": "#9c0b9c",
        "scrollbar-color": "#8a8a8a",
      },
      fontSize: {
        "5.5xl": ["3.5rem"],
      },
      boxShadow: {
        "drawer-x": "rgba(0, 0, 0, .2) 0px 4px 8px",
        "drawer-y": "rgba(0, 0, 0, .2) -5px 0px 20px",
      },
    },
  },
  plugins: [],
};
