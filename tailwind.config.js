/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: 'var(--chakra-fonts-nunito)',
        bangers: 'var(--chakra-fonts-bangers)',
      }
    },
  },
  plugins: [],
}
