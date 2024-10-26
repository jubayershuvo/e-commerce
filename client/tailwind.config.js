/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
  extends: ["stylelint-config-tailwindcss"]
};
export const darkMode = 'class';
export const plugins = [
  require('@tailwindcss/aspect-ratio'),
  require('@tailwindcss/forms'),
];

