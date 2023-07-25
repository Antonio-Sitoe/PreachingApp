/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        titleIBM: 'IBMPLEX_Bold',
        subTitleIBM: 'IBMPLEX_Medium',
        textIBM: 'IBMPLEX_Regular',

        title: 'Inter_700Bold',
        subTitle: 'Inter_500Medium',
        text: 'Inter_400Regular',
      },

      colors: {
        primary: '#6979F8',
        lightBg: '#F6F6F9',
        ligtInputbG: '#F6F6F9',

        dark: {
          darkBG: '#121214',
          darkBgSecundary: '#202024',
          tint: '#45B063',
          darkPrimary: '328048',
          Success200: '#C6F0C2',
        },

        gray: {
          50: '#eaeaea',
          100: '#bebebf',
          200: '#9e9ea0',
          300: '#727275',
          400: '#56565a',
          500: '#2c2c31',
          600: '#28282d',
          700: '#1f1f23',
          800: '#18181b',
          900: '#121214',
        },
        purple: {
          50: '#f3eefc',
          100: '#d8cbf7',
          200: '#c6b2f3',
          300: '#ab8eee',
          400: '#9b79ea',
          500: '#8257e5',
          600: '#764fd0',
          700: '#5c3ea3',
          800: '#48307e',
          900: '#372560',
        },
        green: {
          50: '#e6fbef',
          100: '#b1f1ce',
          200: '#8cebb6',
          300: '#57e295',
          400: '#36dc81',
          500: '#04d361',
          600: '#04c058',
          700: '#039645',
          800: '#027435',
          900: '#025929',
        },
      },
    },
  },
  plugins: [],
}
