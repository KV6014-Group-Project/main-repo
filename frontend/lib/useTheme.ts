import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { THEME, NAV_THEME, type ColorScheme } from './theme';

/**
 * Custom hook for theme management
 * 
 * Provides easy access to current theme colors and theme toggling functionality.
 * Integrates with NativeWind's color scheme management.
 * 
 * @returns Object containing:
 *  - colorScheme: Current color scheme ('light' | 'dark')
 *  - colors: Theme colors for the current scheme
 *  - navTheme: React Navigation theme for the current scheme
 *  - toggleColorScheme: Function to toggle between light and dark themes
 *  - setColorScheme: Function to set a specific color scheme
 *  - isDark: Boolean indicating if dark mode is active
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { colors, isDark, toggleColorScheme } = useTheme();
 *   
 *   return (
 *     <View style={{ backgroundColor: colors.background }}>
 *       <Text style={{ color: colors.foreground }}>
 *         Current theme: {isDark ? 'dark' : 'light'}
 *       </Text>
 *       <Button onPress={toggleColorScheme}>Toggle Theme</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useTheme() {
  const { colorScheme, toggleColorScheme, setColorScheme } = useNativeWindColorScheme();
  
  // Ensure we always have a valid color scheme
  const currentScheme: ColorScheme = colorScheme ?? 'light';
  
  return {
    colorScheme: currentScheme,
    colors: THEME[currentScheme],
    navTheme: NAV_THEME[currentScheme],
    toggleColorScheme,
    setColorScheme,
    isDark: currentScheme === 'dark',
    isLight: currentScheme === 'light',
  } as const;
}

/**
 * Hook to get colors for a specific theme (without switching to it)
 * Useful for previewing themes or conditional styling
 * 
 * @param scheme - The color scheme to get colors for
 * @returns Theme colors for the specified scheme
 * 
 * @example
 * ```tsx
 * function ThemePreview() {
 *   const lightColors = useThemeColors('light');
 *   const darkColors = useThemeColors('dark');
 *   
 *   return (
 *     <View>
 *       <View style={{ backgroundColor: lightColors.background }}>
 *         <Text>Light Theme Preview</Text>
 *       </View>
 *       <View style={{ backgroundColor: darkColors.background }}>
 *         <Text>Dark Theme Preview</Text>
 *       </View>
 *     </View>
 *   );
 * }
 * ```
 */
export function useThemeColors(scheme: ColorScheme) {
  return THEME[scheme];
}

