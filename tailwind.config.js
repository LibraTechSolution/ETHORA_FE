/** @type {import('tailwindcss').Config} */
module.exports = {  
  mode: 'jit',
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/views/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: 'var(--chakra-fonts-poppins)',
        // bangers: 'var(--chakra-fonts-bangers)',
      },
      faucetShadow: {
        border: '1px 0.5px 0px 0px #3D3D40 inset'
      },
      boxShadow: {
        iconShadow: '0px 3px 11px 0px rgba(96, 82, 251, 0.40)'
      }
    },
  },
  plugins: [],
}
