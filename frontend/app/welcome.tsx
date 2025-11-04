import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View, ScrollView } from 'react-native';
import { CalendarIcon, MapPinIcon, UsersIcon, Share2Icon, QrCodeIcon, LinkIcon, CheckCircleIcon } from 'lucide-react-native';
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
                        <View className="items-center gap-2">
                            <Text variant="h1" className="font-bold text-center">
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
                            {/* Introduction Card */}
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>
                                        <Text variant="h3" className="font-semibold">
                                            Welcome to Event Manager
                                        </Text>
                                    </CardTitle>
                                    <CardDescription>
                                        <Text variant="muted">
                                            A comprehensive platform for managing events, connecting organizers, promoters, and participants.
                                        </Text>
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            {/* Features Section */}
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>
                                        <Text variant="h3" className="font-semibold">
                                            Key Features
                                        </Text>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="gap-4">
                                    {/* For Participants */}
                                    <View className="flex-row items-start gap-3">
                                        <View className="mt-0.5">
                                            <CheckCircleIcon size={20} className="text-primary" />
                                        </View>
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium text-base">For Participants</Text>
                                            <Text variant="muted" className="text-sm">
                                                Easily register for events, check in with QR codes or links, and manage your event attendance.
                                            </Text>
                                        </View>
                                    </View>

                                    {/* For Organizers */}
                                    <View className="flex-row items-start gap-3">
                                        <View className="mt-0.5">
                                            <CheckCircleIcon size={20} className="text-primary" />
                                        </View>
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium text-base">For Organizers</Text>
                                            <Text variant="muted" className="text-sm">
                                                Create and manage events, track registrations, and monitor attendance in real-time.
                                            </Text>
                                        </View>
                                    </View>

                                    {/* For Promoters */}
                                    <View className="flex-row items-start gap-3">
                                        <View className="mt-0.5">
                                            <CheckCircleIcon size={20} className="text-primary" />
                                        </View>
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium text-base">For Promoters</Text>
                                            <Text variant="muted" className="text-sm">
                                                Share events with unique links and QR codes, and track promotion effectiveness.
                                            </Text>
                                        </View>
                                    </View>
                                </CardContent>
                            </Card>

                            {/* How It Works */}
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>
                                        <Text variant="h3" className="font-semibold">
                                            How It Works
                                        </Text>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="gap-4">
                                    <View className="flex-row items-start gap-3">
                                        <View className="mt-0.5">
                                            <CalendarIcon size={20} className="text-muted-foreground" />
                                        </View>
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium text-base">1. Choose Your Role</Text>
                                            <Text variant="muted" className="text-sm">
                                                Select whether you're a participant, organizer, or promoter.
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-start gap-3">
                                        <View className="mt-0.5">
                                            <UsersIcon size={20} className="text-muted-foreground" />
                                        </View>
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium text-base">2. Sign In or Register</Text>
                                            <Text variant="muted" className="text-sm">
                                                Create an account or sign in to access your dashboard.
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-start gap-3">
                                        <View className="mt-0.5">
                                            <QrCodeIcon size={20} className="text-muted-foreground" />
                                        </View>
                                        <View className="flex-1 gap-1">
                                            <Text className="font-medium text-base">3. Start Managing Events</Text>
                                            <Text variant="muted" className="text-sm">
                                                Create, join, or promote events based on your role.
                                            </Text>
                                        </View>
                                    </View>
                                </CardContent>
                            </Card>

                            {/* Get Started Button */}
                            <Button
                                onPress={handleGetStarted}
                                size="lg"
                                className="w-full mt-2"
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