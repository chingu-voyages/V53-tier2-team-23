/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      // padding: '15px',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontFamily: {
        shantell: ['Shantell Sans', 'sans-serif'],
        poppins: ['Poppins', 'san-serif'],
      },
      colors: {
        background: '#f6f2f2',
        primary: '#762F63',
        secondary: '#FCBB1C',
        complementary: '#FBF560',
      },
    },
  },
  plugins: [],
};
