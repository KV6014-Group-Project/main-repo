import { Text } from '@/components/ui/text';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { View, ScrollView } from 'react-native';

interface ScreenLayoutProps {
  title: string;
  children: React.ReactNode;
  scrollable?: boolean;
  showThemeToggle?: boolean;
}

export function ScreenLayout({ 
  title, 
  children, 
  scrollable = true,
  showThemeToggle = true 
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  const header = (
    <View
      className="bg-background border-b border-border px-6 md:px-8"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between py-4 md:max-w-4xl md:mx-auto md:w-full">
        <Text variant="h3" className="font-semibold">
          {title}
        </Text>
        {showThemeToggle && <ThemeToggle />}
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

