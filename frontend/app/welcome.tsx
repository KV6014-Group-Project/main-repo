import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_OPTIONS = {
    headerShown: false,
};

export default function WelcomeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleGetStarted = () => {
        router.push('/auth');
    };

    return (
        <>
            <Stack.Screen options={SCREEN_OPTIONS} />
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: 'padding', android: undefined })}
                className="flex-1 bg-background"
            >
                <View
                    className="flex-1"
                    style={{ paddingTop: insets.top }}
                >
                    {/* Header */}
                    <View className="px-6 pt-6 pb-4">
                        <View className="items-center">
                            <Text variant="h1" className="font-bold text-center mb-2">
                                Event Manager
                            </Text>
                            <Text variant="muted" className="text-center text-lg">
                                Your complete event management solution
                            </Text>
                        </View>
                    </View>

                    {/* Content */}
                    <ScrollView className="flex-1 px-6">
                        <View className="gap-6 pb-6">
                            {/* Welcome Card */}
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>
                                        <Text variant="h3" className="font-semibold">
                                            Welcome
                                        </Text>
                                    </CardTitle>
                                    <CardDescription>
                                        <Text variant="muted">
                                            Manage your events with ease. Choose your role and get started.
                                        </Text>
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Get Started Button */}
                            <Button
                                onPress={handleGetStarted}
                                size="lg"
                                className="w-full"
                            >
                                <Text className="font-semibold text-base">Get Started</Text>
                            </Button>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </>
    );
}