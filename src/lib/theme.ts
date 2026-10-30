import { DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation';
import { vars } from 'nativewind';

export const THEME = {
  light: {
    background: '#FAFAFA',
    foreground: '#1E1E1E',
    card: '#FFFFFF',
    cardForeground: '#1E1E1E',
    popover: '#FFFFFF',
    popoverForeground: '#1E1E1E',
    primary: '#5D6CB2',
    primaryForeground: '#FFFFFF',
    primaryStrong: '#4A5385',
    secondary: '#F2F5FF',
    secondaryForeground: '#4A5385',
    muted: '#F1F2F5',
    mutedForeground: '#484C52',
    subtle: '#6B7080',
    accent: '#F2F5FF',
    accentForeground: '#4A5385',
    border: '#E4E4E4',
    input: '#E4E4E4',
    ring: '#5D6CB2',
    warning: '#B45309',
    warningSoft: '#FFF4E0',
    success: '#17704A',
    successSoft: '#E6F6EE',
    destructive: '#C7256B',
    destructiveForeground: '#FFFFFF',
    destructiveSoft: '#FFE5F0',
    stageContact: '#5B6270',
    stageContactSoft: '#EEF0F3',
    stageRevisit: '#2F6FB0',
    stageRevisitSoft: '#E6F1FB',
    stageStarted: '#5A4FB3',
    stageStartedSoft: '#EEECFB',
    stageRegular: '#4A5385',
    stageRegularSoft: '#E3E7F8',
    stagePublisher: '#17704A',
    stagePublisherSoft: '#E6F6EE',
    stageBaptized: '#7A5400',
    stageBaptizedSoft: '#FBF1D6',
    stagePaused: '#5B6270',
    stagePausedSoft: '#F1F2F5',
    toast: '#1E2233',
    toastForeground: '#FFFFFF',
    toastAction: '#C5CCF0',
    radius: 10,
  },
  dark: {
    background: '#10121C',
    foreground: '#F2F3F7',
    card: '#1B1E2D',
    cardForeground: '#F2F3F7',
    popover: '#1B1E2D',
    popoverForeground: '#F2F3F7',
    primary: '#8E9BDB',
    primaryForeground: '#10121C',
    primaryStrong: '#C5CCF0',
    secondary: '#252A40',
    secondaryForeground: '#C5CCF0',
    muted: '#262A3A',
    mutedForeground: '#B9BDCA',
    subtle: '#9399AC',
    accent: '#252A40',
    accentForeground: '#C5CCF0',
    border: '#2E3348',
    input: '#2E3348',
    ring: '#8E9BDB',
    warning: '#FFC069',
    warningSoft: '#3A2E14',
    success: '#6FD3A5',
    successSoft: '#173327',
    destructive: '#FF8DB8',
    destructiveForeground: '#10121C',
    destructiveSoft: '#3A1F2C',
    stageContact: '#C3C8D4',
    stageContactSoft: '#2A2E3C',
    stageRevisit: '#8CC0F2',
    stageRevisitSoft: '#1B2C40',
    stageStarted: '#B5ADF5',
    stageStartedSoft: '#27244A',
    stageRegular: '#C5CCF0',
    stageRegularSoft: '#2A3052',
    stagePublisher: '#6FD3A5',
    stagePublisherSoft: '#173327',
    stageBaptized: '#F2CB6B',
    stageBaptizedSoft: '#3A3013',
    stagePaused: '#A9AEBB',
    stagePausedSoft: '#262A3A',
    toast: '#2E3348',
    toastForeground: '#FFFFFF',
    toastAction: '#C5CCF0',
    radius: 10,
  },
} as const;

export type ThemeName = keyof typeof THEME;
export type ThemeColor = Exclude<keyof (typeof THEME)['light'], 'radius'>;

function toChannels(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

function themeVars(name: ThemeName) {
  return vars(
    Object.fromEntries(
      Object.entries(THEME[name])
        .filter(([key]) => key !== 'radius')
        .map(([key, hex]) => [
          `--${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`,
          toChannels(hex as string),
        ])
    )
  );
}

export const LIGHT_THEME_VARS = themeVars('light');

/** As cores de cada tema, para o que abre fora da raiz da app (como um Modal). */
export const THEME_VARS = { light: LIGHT_THEME_VARS, dark: themeVars('dark') } as const;

export const BRAND = {
  purple: '#6775B8',
  purpleDark: '#4A5385',
  terracotta: '#C47A5D',
  sand: '#E8D9C5',
  white: '#FFFFFF',
  splash: '#5D6CB2',
  gradients: {
    purple: { colors: ['#495082', '#636EAD', '#6975B8'], locations: [0, 0.64, 1] },
    terracotta: {
      colors: ['#C47A5D', '#CE9276', '#D3A185', '#E8D9C5'],
      locations: [0, 0.45, 0.71, 1],
    },
  },
} as const;

export const SHADOWS = {
  fab: '0 6px 16px rgba(16, 18, 28, 0.2)',
  sheet: '0 -4px 24px rgba(16, 18, 28, 0.08)',
  backdrop: 'rgba(16, 18, 28, 0.4)',
} as const;

export const NAV_THEME: Record<ThemeName, Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};
