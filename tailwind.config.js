/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#8FC9E3',
          'blue-dark': '#6FAFCB',
          'blue-light': '#BCE1F2',
          brown: '#A86632',
          'brown-dark': '#8A4F23',
          'brown-light': '#C58451',
          yellow: '#F4D27E',
          'yellow-light': '#FDF4D4',
          pink: '#E95BA8',
          'pink-light': '#FCE4F0',
          'warm-white': '#FFFDF9',
          cream: '#FFF6E7',
          'soft-blue': '#EAF6FB',
          text: '#5C4637',
          'text-muted': '#8D7A6E',
          border: '#EFE7DC',
          'border-focus': '#8FC9E3',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(92, 70, 55, 0.06)',
        'soft-lg': '0 10px 30px -4px rgba(92, 70, 55, 0.08)',
        'soft-xl': '0 20px 40px -8px rgba(92, 70, 55, 0.10)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      lineHeight: {
        'thai-relaxed': '1.75',
        'thai-loose': '1.9',
      }
    },
  },
  plugins: [],
}
