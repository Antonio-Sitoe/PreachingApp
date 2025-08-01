const tintColorLight = '#6979F8';
const tintColorDark = '#328048';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    ligtInputbG: '#F6F6F9',
    inputBg: `#D9D8FF`,
    Error: '#FF0000',
  },
  dark: {
    text: '#fff',
    background: '#121214',
    tint: tintColorDark,
    darkBgSecundary: '#202024',
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    Success200: '#C6F0C2',
    Error: '#FF0000',
  },
};

// Tema de navegação para React Native Reusables
export const navigationTheme = {
  dark: false,
  colors: {
    primary: '#6979F8',
    background: '#fff',
    card: '#fff',
    text: '#000',
    border: '#e5e7eb',
  },
};

export const navigationDarkTheme = {
  dark: true,
  colors: {
    primary: '#328048',
    background: '#121214',
    card: '#121214',
    text: '#fff',
    border: '#262626',
  },
};
