/**
 * Theme Module Exports
 * Central export point for all theme-related functionality
 */

// Core theme configuration and types
export { THEME, NAV_THEME, RAW_COLORS, type ColorScheme } from './theme';

// Theme hooks
export { useTheme, useThemeColors } from './useTheme';

// Theme utilities
export {
  parseHSL,
  toHSLString,
  adjustLightness,
  adjustSaturation,
  withOpacity,
  getThemeColor,
  isColorDark,
  generateShades,
  createColorVariant,
  platformUtils,
} from './theme-utils';

// Note: theme-examples.tsx is excluded as it's for reference only

