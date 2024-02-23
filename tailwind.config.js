/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

const Myclass = plugin(function ({ addUtilities }) {
  addUtilities({
    '.my-rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d',
    },
    '.perspective': {
      perspective: '1000px',
    },
    '.backface-hidden': {
      backfaceVisibility: 'hidden',
    },
  });
});

const ScrollbarHide = plugin(function ({ addUtilities }) {
  const newUtilities = {
    '.scrollbar-hide': {
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none',
      '&::-webkit-scrollbar': {
        width: '0px',
        background: 'transparent',
      },
    },
  };
  addUtilities(newUtilities);
});

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        tenada: ['Tenada'],
        DalseoHealing: 'DalseoHealing',
      },
      backgroundImage: {
        'space-bg': "url('./BackGroundImg.jpg')",
      },
      animation: {
        opacityPulse: 'opacityPulse 2s ease-in-out',
        twinkling: 'twinkling 1s infinite',
        customFadeUp: 'customFadeUp 1s both',
      },
      keyframes: {
        opacityPulse: {
          '0%': { opacity: 0.7, transform: 'translate(0, 0)' },
          '50%': { opacity: 0.3 },
          '100%': { opacity: 0, transform: 'translate(15px, 15px)' },
        },
        twinkling: {
          '0%, 100%': { borderColor: 'green' },
          '50%': { borderColor: 'white' },
        },
        customFadeUp: {
          '0%': {
            opacity: 0,
            transform: 'translateY(1rem/* 32px */) scale(1.2)',
          },
          '50%': {
            opacity: 0.5,
            transform: 'translateY(-0.5rem) scale(0.8)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0) scale(1.0)',
          },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animated'), Myclass, ScrollbarHide],
};
