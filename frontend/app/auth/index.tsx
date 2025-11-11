import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, ScrollView } from 'react-native';

export default function AuthIndexScreen() {
  const { signUp } = useSession();
  const router = useRouter();
  const [loading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  const continueAsParticipant = () => {
    router.push('/auth/participant');
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: false,
          title: 'Get started',
          headerBackTitleVisible: false,
        }}
      />
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingVertical: 24,
          }}
        >
          <View className="w-full max-w-xl mx-auto gap-6">
            <View className="gap-1">
              <Text variant="h2" className="font-semibold">
                Get started
              </Text>
              <Text variant="muted" className="text-sm">
                Choose how you want to use Event Manager.
              </Text>
            </View>

                <Card className="overflow-hidden md:shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <Text variant="h3">Join as participant</Text>
                    </CardTitle>
                    <CardDescription>
                      <Text variant="muted">
                        Quick access with light details. Ideal if you just need to check in to events.
                      </Text>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="lg"
                      onPress={continueAsParticipant}
                      disabled={loading}
                      className="w-full"
                    >
                      <Text className="font-semibold">Continue as participant</Text>
                    </Button>
                  </CardContent>
                </Card>
    
                <Card className="overflow-hidden md:shadow-lg">
                  <CardHeader>
                    <CardTitle>
                      <Text variant="h3">Manage events</Text>
                    </CardTitle>
                    <CardDescription>
                      <Text variant="muted">
                        Create or promote events with dashboards tailored to your role.
                      </Text>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <View className="gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onPress={() => router.push('/auth/organiser')}
                      >
                        <Text>I am an organiser</Text>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onPress={() => router.push('/auth/promoter')}
                      >
                        <Text>I am a promoter</Text>
                      </Button>
                    </View>
                  </CardContent>
                </Card>
    
                {error ? (
                  <Text className="text-destructive text-sm mt-2 text-center">
                    {error}
                  </Text>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </>
  );
}


