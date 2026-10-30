import 'dotenv/config';
import { version } from './package.json';

// Kotlin do editor de notas (modules/notes): >= 2.3; 2.3.20 é o último com o pika-compiler do Expo.
const KOTLIN_VERSION = '2.3.20';

export default {
  expo: {
    name: 'Preaching Assistant',
    slug: 'preachingApp',
    version,
    orientation: 'portrait',
    icon: './src/assets/images/icon.png',
    scheme: 'preachingApp',
    userInterfaceStyle: 'automatic',
    assetBundlePatterns: ['**/*'],
    android: {
      package: 'com.antoniositoe533.preachingApp',
      permissions: [
        'POST_NOTIFICATIONS',
        'SCHEDULE_EXACT_ALARM',
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
      ],
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#5D6CB2',
      },
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './src/assets/images/splash.png',
          imageWidth: 192,
          resizeMode: 'contain',
          backgroundColor: '#5D6CB2',
        },
      ],
      'expo-status-bar',
      'expo-sqlite',
      'expo-font',
      [
        'expo-image-picker',
        {
          photosPermission: 'A app acede às suas fotos para escolher imagens.',
          microphonePermission: false,
        },
      ],
      [
        'expo-notifications',
        {
          icon: './src/assets/images/icon.png',
          color: '#ffffff',
          defaultChannel: 'monthly-reminders',
        },
      ],
      '@react-native-community/datetimepicker',
      'expo-sharing',
      'expo-secure-store',
      'expo-local-authentication',
      ['expo-build-properties', { android: { kotlinVersion: KOTLIN_VERSION } }],
      ['./modules/notes/app.plugin.js', { kotlinVersion: KOTLIN_VERSION }],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
    },
  },
};
