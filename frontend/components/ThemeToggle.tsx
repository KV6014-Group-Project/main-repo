import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';

/**
 * ThemeToggle Component
 * 
 * A button component that toggles between light and dark themes.
 * Automatically persists theme preference using NativeWind's built-in storage.
 * 
 * Features:
 * - Smooth icon transitions between sun and moon
 * - Automatic theme persistence across app restarts
 * - Accessible with proper labels
 * - Platform-specific styling optimizations
 */

const THEME_CONFIG = {
  light: {
    icon: SunIcon,
    label: 'Switch to dark mode',
    next: 'dark' as const,
  },
  dark: {
    icon: MoonStarIcon,
    label: 'Switch to light mode',
    next: 'light' as const,
  },
} as const;

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  // Fallback to light theme if colorScheme is undefined
  const currentTheme = colorScheme ?? 'light';
  const themeConfig = THEME_CONFIG[currentTheme];

  const handleToggle = React.useCallback(() => {
    // NativeWind handles persistence automatically via AsyncStorage (native) or localStorage (web)
    toggleColorScheme();
  }, [toggleColorScheme]);

  return (
    <Button
      onPress={handleToggle}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4"
      accessibilityLabel={themeConfig.label}
      accessibilityRole="button"
      accessibilityHint="Double tap to toggle between light and dark theme"
    >
      <Icon 
        as={themeConfig.icon} 
        className="size-5 text-foreground"
      />
    </Button>
  );
}


