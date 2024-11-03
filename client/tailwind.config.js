// tailwind.config.js
import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extends: ["stylelint-config-tailwindcss"],
  },
  darkMode: 'class',
  plugins: [aspectRatio, forms],
};
