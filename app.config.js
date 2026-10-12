import 'dotenv/config';
import { version } from './package.json';

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
      [
        'expo-build-properties',
        {
          android: {
            // Kotlin 2.4 para os editores nativos (modules/) poderem usar libs Compose recentes;
            // o cascade-editor pede pelo menos 2.3 e minSdk 26.
            kotlinVersion: '2.4.21',
            minSdkVersion: 26,
          },
        },
      ],
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
