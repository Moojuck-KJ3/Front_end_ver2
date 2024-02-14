/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

const Myclass = plugin(function ({ addUtilities }) {
  addUtilities({
    ".my-rotate-y-180": {
      transform: "rotateY(180deg)",
    },
    ".preserve-3d": {
      transformStyle: "preserve-3d",
    },
    ".perspective": {
      perspective: "1000px",
    },
    ".backface-hidden": {
      backfaceVisibility: "hidden",
    },
  });
});

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        tenada: ["Tenada"],
      },
      backgroundImage: {
        "space-bg": "url('./BackGroundImg.jpg')",
      },
      animation: {
        opacityPulse: "opacityPulse 2s ease-in-out",
      },
      keyframes: {
        opacityPulse: {
          "0%": { opacity: 0.7, transform: "translate(0, 0)" },
          "50%": { opacity: 0.3 },
          "100%": { opacity: 0, transform: "translate(5px, 5px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animated"), Myclass],
};
