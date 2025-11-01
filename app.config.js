import 'dotenv/config';
import { version } from './package.json';

export default {
  expo: {
    name: 'Preaching Assistant',
    slug: 'preachingApp',
    version: version,
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'preachingApp',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './src/assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],

    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.antoniositoe533.preachingApp',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './src/assets/images/favicon.png',
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your friends.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './src/assets/images/icon.png',
          color: '#ffffff',
          defaultChannel: 'monthly-reminders'
        }
      ],
      'expo-build-properties',
      'expo-font',
      'expo-router',
      'expo-web-browser',
      'expo-sqlite',
      '@react-native-google-signin/google-signin',
    ],
    experiments: {
      tsconfigPaths: true,
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },
};
