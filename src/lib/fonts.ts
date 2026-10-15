
export const FONTS = {
  RedHatDisplay_500Medium: require('@/assets/fonts/RedHatDisplay_500Medium.ttf'),
  RedHatDisplay_600SemiBold: require('@/assets/fonts/RedHatDisplay_600SemiBold.ttf'),
  RedHatDisplay_700Bold: require('@/assets/fonts/RedHatDisplay_700Bold.ttf'),
  Sen_400Regular: require('@/assets/fonts/Sen_400Regular.ttf'),
  Sen_600SemiBold: require('@/assets/fonts/Sen_600SemiBold.ttf'),
} as const;

export type FontName = keyof typeof FONTS;
