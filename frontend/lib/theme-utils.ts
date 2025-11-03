import { ColorScheme, RAW_COLORS } from './theme';

/**
 * Theme utility functions
 * Helper functions for working with themes in React Native Reusables
 */

/**
 * Parse HSL string to component values
 * @param hsl - HSL string in format "H S% L%" (e.g., "0 0% 100%")
 * @returns Object with hue, saturation, and lightness values
 */
export function parseHSL(hsl: string): { h: number; s: number; l: number } {
  const [h, s, l] = hsl.split(' ').map((val) => parseFloat(val.replace('%', '')));
  return { h, s, l };
}

/**
 * Convert HSL components to CSS HSL string
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns HSL string in format "hsl(H S% L%)"
 */
export function toHSLString(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`;
}

/**
 * Adjust lightness of a theme color
 * Useful for creating hover states or variants
 * 
 * @param hslValue - Raw HSL value (e.g., "0 0% 100%")
 * @param adjustment - Amount to adjust lightness by (-100 to 100)
 * @returns New HSL string with adjusted lightness
 * 
 * @example
 * ```tsx
 * const lighterPrimary = adjustLightness(RAW_COLORS.light.primary, 10);
 * const darkerPrimary = adjustLightness(RAW_COLORS.light.primary, -10);
 * ```
 */
export function adjustLightness(hslValue: string, adjustment: number): string {
  const { h, s, l } = parseHSL(hslValue);
  const newL = Math.max(0, Math.min(100, l + adjustment));
  return toHSLString(h, s, newL);
}

/**
 * Adjust saturation of a theme color
 * 
 * @param hslValue - Raw HSL value (e.g., "0 0% 100%")
 * @param adjustment - Amount to adjust saturation by (-100 to 100)
 * @returns New HSL string with adjusted saturation
 */
export function adjustSaturation(hslValue: string, adjustment: number): string {
  const { h, s, l } = parseHSL(hslValue);
  const newS = Math.max(0, Math.min(100, s + adjustment));
  return toHSLString(h, s, newS);
}

/**
 * Add alpha/opacity to HSL color
 * 
 * @param hslValue - Raw HSL value (e.g., "0 0% 100%")
 * @param alpha - Opacity value (0-1)
 * @returns HSLA string with opacity
 * 
 * @example
 * ```tsx
 * const semiTransparent = withOpacity(RAW_COLORS.light.primary, 0.5);
 * // Returns: "hsl(0 0% 9% / 0.5)"
 * ```
 */
export function withOpacity(hslValue: string, alpha: number): string {
  const clampedAlpha = Math.max(0, Math.min(1, alpha));
  return `hsl(${hslValue} / ${clampedAlpha})`;
}

/**
 * Get a color value from the current theme
 * Type-safe accessor for theme colors
 * 
 * @param colorScheme - The current color scheme
 * @param colorKey - The color key to retrieve
 * @returns HSL color value
 * 
 * @example
 * ```tsx
 * const primaryColor = getThemeColor('light', 'primary');
 * ```
 */
export function getThemeColor(
  colorScheme: ColorScheme,
  colorKey: keyof typeof RAW_COLORS.light
): string {
  return RAW_COLORS[colorScheme][colorKey];
}

/**
 * Check if a color is "dark" based on its lightness value
 * Useful for determining whether to use light or dark text on a background
 * 
 * @param hslValue - Raw HSL value (e.g., "0 0% 100%")
 * @param threshold - Lightness threshold (default 50)
 * @returns true if the color is dark (lightness < threshold)
 * 
 * @example
 * ```tsx
 * const isDarkBg = isColorDark(RAW_COLORS.dark.background); // true
 * const textColor = isDarkBg ? 'text-white' : 'text-black';
 * ```
 */
export function isColorDark(hslValue: string, threshold: number = 50): boolean {
  const { l } = parseHSL(hslValue);
  return l < threshold;
}

/**
 * Generate a series of shades for a color
 * Creates lighter and darker variants of a base color
 * 
 * @param hslValue - Raw HSL value
 * @param steps - Number of steps to generate (default 5)
 * @returns Array of HSL strings from light to dark
 * 
 * @example
 * ```tsx
 * const primaryShades = generateShades(RAW_COLORS.light.primary, 5);
 * // Returns: [lighter, light, base, dark, darker]
 * ```
 */
export function generateShades(hslValue: string, steps: number = 5): string[] {
  const { h, s, l } = parseHSL(hslValue);
  const shades: string[] = [];
  const stepSize = 15; // Adjust lightness by 15% for each step

  for (let i = Math.floor(steps / 2); i > 0; i--) {
    const newL = Math.min(100, l + stepSize * i);
    shades.push(toHSLString(h, s, newL));
  }

  shades.push(toHSLString(h, s, l)); // Base color

  for (let i = 1; i <= Math.floor(steps / 2); i++) {
    const newL = Math.max(0, l - stepSize * i);
    shades.push(toHSLString(h, s, newL));
  }

  return shades;
}

/**
 * Create a custom color variant
 * Combines multiple adjustments in one function
 * 
 * @param hslValue - Raw HSL value
 * @param options - Adjustment options
 * @returns Adjusted HSL string
 * 
 * @example
 * ```tsx
 * const customColor = createColorVariant(RAW_COLORS.light.primary, {
 *   lightness: 10,
 *   saturation: -5,
 *   opacity: 0.8
 * });
 * ```
 */
export function createColorVariant(
  hslValue: string,
  options: {
    lightness?: number;
    saturation?: number;
    opacity?: number;
  } = {}
): string {
  let result = hslValue;

  if (options.lightness !== undefined) {
    result = adjustLightness(result, options.lightness).replace('hsl(', '').replace(')', '');
  }

  if (options.saturation !== undefined) {
    result = adjustSaturation(result, options.saturation).replace('hsl(', '').replace(')', '');
  }

  if (options.opacity !== undefined) {
    return withOpacity(result, options.opacity);
  }

  return `hsl(${result})`;
}

/**
 * Platform-specific theme utilities
 */
export const platformUtils = {
  /**
   * Check if running on web
   */
  isWeb: typeof window !== 'undefined' && typeof document !== 'undefined',

  /**
   * Get stored theme preference
   * Works across web (localStorage) and native (AsyncStorage via NativeWind)
   */
  getStoredTheme: (): ColorScheme | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('nativewind-color-scheme');
      return stored === 'dark' || stored === 'light' ? stored : null;
    } catch {
      return null;
    }
  },

  /**
   * Get system/OS theme preference
   */
  getSystemTheme: (): ColorScheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },
} as const;

