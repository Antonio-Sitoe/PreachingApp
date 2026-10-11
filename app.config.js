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
    ios: {
      bundleIdentifier: 'com.antoniositoe533.preachingApp',
    },
    android: {
      package: 'com.antoniositoe533.preachingApp',
      permissions: ['POST_NOTIFICATIONS', 'ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION'],
      adaptiveIcon: {
        foregroundImage: './src/assets/images/adaptive-icon.png',
        backgroundColor: '#5D6CB2',
      },
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './src/assets/images/favicon.png',
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
          ios: {
            imageWidth: 282,
          },
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
