import { Text } from '@/components/ui/text';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { View, ScrollView } from 'react-native';

interface ScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  scrollable?: boolean;
  showThemeToggle?: boolean;
  showBackButton?: boolean;
  onBackPress?: () => void;
}
 
export function ScreenLayout({
  title,
  subtitle,
  children,
  scrollable = true,
  showThemeToggle = true,
  showBackButton = false,
  onBackPress,
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();
 
  const header = (
    <View
      className="bg-background border-b border-border px-6 md:px-8"
      style={{ paddingTop: insets.top }}
    >
      <View className="py-4 md:max-w-4xl md:mx-auto md:w-full">
        <View className="flex-row items-center gap-3">
          {showBackButton && (
            <Text
              onPress={onBackPress}
              className="text-sm text-muted-foreground pr-1"
            >
              Back
            </Text>
          )}
          <View className="flex-1">
            <Text variant="h3" className="font-semibold">
              {title}
            </Text>
            {subtitle ? (
              <Text variant="muted" className="text-sm mt-1">
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showThemeToggle && <ThemeToggle />}
        </View>
      </View>
    </View>
  );
 
  const content = (
    <View className="gap-6 p-6 md:p-8 md:max-w-4xl md:mx-auto md:w-full">
      {children}
    </View>
  );
 
  return (
    <View className="flex-1 bg-background">
      {header}
      {scrollable ? (
        <ScrollView className="flex-1">
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

