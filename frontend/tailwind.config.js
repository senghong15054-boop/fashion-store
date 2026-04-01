export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0b",
        sand: "#f5f0e8",
        ember: "#ff6b35",
        pine: "#15231a",
        mist: "#e9ecef"
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 60px rgba(255, 107, 53, 0.18)"
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at top left, rgba(255,107,53,0.18), transparent 36%), radial-gradient(circle at top right, rgba(59,130,246,0.16), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.92), rgba(245,240,232,0.85))",
        auroraDark:
          "radial-gradient(circle at top left, rgba(255,107,53,0.14), transparent 36%), radial-gradient(circle at top right, rgba(45,212,191,0.16), transparent 32%), linear-gradient(135deg, rgba(10,10,11,0.96), rgba(21,35,26,0.92))"
      }
    }
  },
  plugins: []
};
