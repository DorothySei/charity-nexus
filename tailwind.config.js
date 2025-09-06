/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charity: {
          pink: '#ff6b6b',
          red: '#ee5a52',
          orange: '#ffa726',
        },
      },
      backgroundImage: {
        'charity-gradient': 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
      },
    },
  },
  plugins: [],
}
