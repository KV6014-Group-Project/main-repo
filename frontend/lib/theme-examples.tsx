/**
 * Theme Usage Examples
 * 
 * This file demonstrates various ways to use the improved theme system
 * with React Native Reusables and NativeWind.
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme, useThemeColors } from './useTheme';

/**
 * Example 1: Using the useTheme hook with inline styles
 * Good for when you need programmatic access to theme colors
 */
export function Example1_InlineStyles() {
  const { colors, isDark, toggleColorScheme } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: 16 }}>
      <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: 'bold' }}>
        Theme Example with Inline Styles
      </Text>
      <Text style={{ color: colors.mutedForeground, marginTop: 8 }}>
        Current mode: {isDark ? 'Dark' : 'Light'}
      </Text>
      <Pressable
        onPress={toggleColorScheme}
        style={{
          backgroundColor: colors.primary,
          padding: 12,
          borderRadius: 8,
          marginTop: 16,
        }}
      >
        <Text style={{ color: colors.primaryForeground, textAlign: 'center' }}>
          Toggle Theme
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Example 2: Using NativeWind className (RECOMMENDED)
 * This is the preferred approach as it leverages CSS variables
 * and provides better performance and type safety
 */
export function Example2_NativeWindClasses() {
  const { isDark, toggleColorScheme } = useTheme();

  return (
    <View className="bg-background p-4">
      <Text className="text-foreground text-2xl font-bold">
        Theme Example with NativeWind
      </Text>
      <Text className="text-muted-foreground mt-2">
        Current mode: {isDark ? 'Dark' : 'Light'}
      </Text>
      <Pressable
        onPress={toggleColorScheme}
        className="bg-primary p-3 rounded-lg mt-4 active:opacity-80"
      >
        <Text className="text-primary-foreground text-center font-medium">
          Toggle Theme
        </Text>
      </Pressable>
    </View>
  );
}

/**
 * Example 3: Conditional styling based on theme
 */
export function Example3_ConditionalStyling() {
  const { isDark } = useTheme();

  return (
    <View className="bg-background p-4">
      <View
        className={`p-4 rounded-lg ${
          isDark ? 'bg-secondary border-2 border-border' : 'bg-muted'
        }`}
      >
        <Text className="text-foreground text-lg">
          This card has different styling in dark mode
        </Text>
      </View>
    </View>
  );
}

/**
 * Example 4: Using destructive colors for error states
 */
export function Example4_DestructiveColors() {
  return (
    <View className="bg-background p-4">
      <View className="bg-destructive p-4 rounded-lg">
        <Text className="text-destructive-foreground font-semibold">
          Error: Something went wrong!
        </Text>
      </View>
      <Pressable className="bg-destructive/10 border border-destructive p-3 rounded-lg mt-4">
        <Text className="text-destructive text-center">Destructive Action</Text>
      </Pressable>
    </View>
  );
}

/**
 * Example 5: Card with all semantic colors
 */
export function Example5_SemanticColors() {
  return (
    <View className="bg-background p-4 gap-4">
      <View className="bg-card border border-border rounded-lg p-4">
        <Text className="text-card-foreground text-lg font-bold">Card Title</Text>
        <Text className="text-muted-foreground mt-2">
          This is a card with proper semantic colors
        </Text>
      </View>

      <View className="bg-popover border border-border rounded-lg p-4 shadow-sm">
        <Text className="text-popover-foreground font-medium">Popover Content</Text>
        <Text className="text-muted-foreground text-sm mt-1">
          Popover uses slightly different background colors
        </Text>
      </View>

      <View className="bg-secondary rounded-lg p-4">
        <Text className="text-secondary-foreground">Secondary Container</Text>
      </View>

      <View className="bg-accent rounded-lg p-4">
        <Text className="text-accent-foreground">Accent Container</Text>
      </View>

      <View className="bg-muted rounded-lg p-4">
        <Text className="text-muted-foreground">Muted Container</Text>
      </View>
    </View>
  );
}

/**
 * Example 6: Preview both themes side by side
 */
export function Example6_ThemePreview() {
  const lightColors = useThemeColors('light');
  const darkColors = useThemeColors('dark');

  return (
    <View className="bg-background p-4 gap-4">
      <Text className="text-foreground text-xl font-bold mb-2">Theme Preview</Text>

      <View style={{ backgroundColor: lightColors.background }} className="p-4 rounded-lg border-2 border-border">
        <Text style={{ color: lightColors.foreground }} className="font-bold">
          Light Theme
        </Text>
        <Text style={{ color: lightColors.mutedForeground }} className="text-sm mt-1">
          This is how the light theme looks
        </Text>
      </View>

      <View style={{ backgroundColor: darkColors.background }} className="p-4 rounded-lg border-2 border-border">
        <Text style={{ color: darkColors.foreground }} className="font-bold">
          Dark Theme
        </Text>
        <Text style={{ color: darkColors.mutedForeground }} className="text-sm mt-1">
          This is how the dark theme looks
        </Text>
      </View>
    </View>
  );
}

/**
 * Example 7: Available Tailwind classes for theming
 * 
 * BACKGROUND COLORS:
 * - bg-background        - Main background
 * - bg-foreground        - Main foreground (opposite of background)
 * - bg-card              - Card background
 * - bg-popover           - Popover/dropdown background
 * - bg-primary           - Primary brand color
 * - bg-secondary         - Secondary elements
 * - bg-muted             - Muted/disabled elements
 * - bg-accent            - Accent/highlighted elements
 * - bg-destructive       - Error/danger states
 * - bg-border            - Border color (rare to use as background)
 * - bg-input             - Input field backgrounds
 * 
 * TEXT COLORS:
 * - text-foreground              - Main text color
 * - text-card-foreground         - Text on cards
 * - text-popover-foreground      - Text in popovers
 * - text-primary-foreground      - Text on primary backgrounds
 * - text-secondary-foreground    - Text on secondary backgrounds
 * - text-muted-foreground        - Muted/subtle text
 * - text-accent-foreground       - Text on accent backgrounds
 * - text-destructive-foreground  - Text on destructive backgrounds
 * 
 * BORDER COLORS:
 * - border-border        - Standard borders
 * - border-input         - Input field borders
 * - border-ring          - Focus rings
 * 
 * OPACITY VARIANTS:
 * All colors support opacity: bg-primary/50, text-foreground/80, etc.
 * 
 * BORDER RADIUS:
 * - rounded-sm          - Small radius (calc(0.625rem - 4px))
 * - rounded-md          - Medium radius (calc(0.625rem - 2px))
 * - rounded-lg          - Large radius (0.625rem)
 */
export function Example7_ClassReference() {
  return (
    <View className="bg-background p-4 gap-2">
      <Text className="text-foreground text-xl font-bold mb-4">
        Theme Class Reference
      </Text>

      <Text className="text-foreground">text-foreground - Main text</Text>
      <Text className="text-muted-foreground">text-muted-foreground - Subtle text</Text>
      <Text className="text-primary">text-primary - Primary color text</Text>
      <Text className="text-destructive">text-destructive - Error text</Text>

      <View className="flex-row gap-2 mt-4 flex-wrap">
        <View className="bg-primary w-16 h-16 rounded-lg" />
        <View className="bg-secondary w-16 h-16 rounded-lg" />
        <View className="bg-accent w-16 h-16 rounded-lg" />
        <View className="bg-muted w-16 h-16 rounded-lg" />
        <View className="bg-destructive w-16 h-16 rounded-lg" />
      </View>

      <View className="mt-4 gap-2">
        <View className="border border-border rounded-sm p-2">
          <Text className="text-foreground text-xs">rounded-sm border</Text>
        </View>
        <View className="border-2 border-input rounded-md p-2">
          <Text className="text-foreground text-xs">rounded-md border-2</Text>
        </View>
        <View className="border-2 border-ring rounded-lg p-2">
          <Text className="text-foreground text-xs">rounded-lg border-2 (focus ring)</Text>
        </View>
      </View>
    </View>
  );
}

