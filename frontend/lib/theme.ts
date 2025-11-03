import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';

/**
 * Theme configuration
 * Single source of truth for theme values that syncs with global.css CSS variables
 * Uses HSL color space for better color manipulation and consistency with NativeWind
 */

// Base theme colors in HSL format (without 'hsl()' wrapper for CSS variable compatibility)
const colors = {
  light: {
    background: '0 0% 100%',
    foreground: '0 0% 3.9%',
    card: '0 0% 100%',
    cardForeground: '0 0% 3.9%',
    popover: '0 0% 100%',
    popoverForeground: '0 0% 3.9%',
    primary: '0 0% 9%',
    primaryForeground: '0 0% 98%',
    secondary: '0 0% 96.1%',
    secondaryForeground: '0 0% 9%',
    muted: '0 0% 96.1%',
    mutedForeground: '0 0% 45.1%',
    accent: '0 0% 96.1%',
    accentForeground: '0 0% 9%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '0 0% 98%',
    border: '0 0% 89.8%',
    input: '0 0% 89.8%',
    ring: '0 0% 63%',
    chart1: '12 76% 61%',
    chart2: '173 58% 39%',
    chart3: '197 37% 24%',
    chart4: '43 74% 66%',
    chart5: '27 87% 67%',
  },
  dark: {
    background: '0 0% 3.9%',
    foreground: '0 0% 98%',
    card: '0 0% 3.9%',
    cardForeground: '0 0% 98%',
    popover: '0 0% 3.9%',
    popoverForeground: '0 0% 98%',
    primary: '0 0% 98%',
    primaryForeground: '0 0% 9%',
    secondary: '0 0% 14.9%',
    secondaryForeground: '0 0% 98%',
    muted: '0 0% 14.9%',
    mutedForeground: '0 0% 63.9%',
    accent: '0 0% 14.9%',
    accentForeground: '0 0% 98%',
    destructive: '0 70.9% 59.4%',
    destructiveForeground: '0 0% 98%',
    border: '0 0% 14.9%',
    input: '0 0% 14.9%',
    ring: '0 0% 83.1%',
    chart1: '220 70% 50%',
    chart2: '160 60% 45%',
    chart3: '30 80% 55%',
    chart4: '280 65% 60%',
    chart5: '340 75% 55%',
  },
} as const;

// Helper to convert HSL values to full HSL string
const toHsl = (hsl: string) => `hsl(${hsl})`;

/**
 * Theme object with properly formatted HSL colors
 * Use these values when you need the actual color values in your components
 */
export const THEME = {
  light: Object.fromEntries(
    Object.entries(colors.light).map(([key, value]) => [key, toHsl(value)])
  ),
  dark: Object.fromEntries(
    Object.entries(colors.dark).map(([key, value]) => [key, toHsl(value)])
  ),
  radius: {
    sm: 'calc(0.625rem - 4px)',
    md: 'calc(0.625rem - 2px)',
    lg: '0.625rem',
  },
} as const;

/**
 * React Navigation theme integration
 * Maps our theme colors to React Navigation's theme format
 */
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: toHsl(colors.light.background),
      border: toHsl(colors.light.border),
      card: toHsl(colors.light.card),
      notification: toHsl(colors.light.destructive),
      primary: toHsl(colors.light.primary),
      text: toHsl(colors.light.foreground),
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: toHsl(colors.dark.background),
      border: toHsl(colors.dark.border),
      card: toHsl(colors.dark.card),
      notification: toHsl(colors.dark.destructive),
      primary: toHsl(colors.dark.primary),
      text: toHsl(colors.dark.foreground),
    },
  },
};

/**
 * Type for color scheme
 */
export type ColorScheme = 'light' | 'dark';

/**
 * Raw color values (without hsl() wrapper) for CSS variable usage
 * Useful when you need to work with the raw HSL values
 */
export const RAW_COLORS = colors;