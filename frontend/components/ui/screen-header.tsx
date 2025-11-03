import { Text } from '@/components/ui/text';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import { View } from 'react-native';

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background border-b border-border px-6 md:px-8"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between py-4 md:max-w-4xl md:mx-auto md:w-full">
        <Text variant="h3" className="font-semibold">
          {title}
        </Text>
        <ThemeToggle />
      </View>
    </View>
  );
}