export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        primaryDark: "#FF5252",
        grayText: "#444444",
        graySubtext: "#777777",
        grayLight: "#F7F7F7",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
