import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ScreenLayout } from '@/components/layouts';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function ParticipantHome() {
  const { session, signOut } = useSession();
  const router = useRouter();

  const onLeave = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenLayout
        title="Participant profile"
        subtitle="View your guest details and end your session at any time."
      >
        <Card className="overflow-hidden md:shadow-lg">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Guest session</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">You are using Event Manager as a participant.</Text>
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            {session?.profile ? (
              <View className="gap-4">
                <View className="gap-1.5">
                  <Text className="text-sm text-muted-foreground">Name</Text>
                  <Text>
                    {session.profile.firstName} {session.profile.lastName}
                  </Text>
                </View>
                <View className="gap-1.5">
                  <Text className="text-sm text-muted-foreground">Email</Text>
                  <Text>{session.profile.email}</Text>
                </View>
                {session.profile.phone ? (
                  <View className="gap-1.5">
                    <Text className="text-sm text-muted-foreground">Phone</Text>
                    <Text>{session.profile.phone}</Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <Text variant="muted">
                No profile details available for this session.
              </Text>
            )}
          </CardContent>
        </Card>

        <Button
          onPress={onLeave}
          variant="ghost"
          size="lg"
          className="mt-6"
        >
          <Text>End guest session</Text>
        </Button>
      </ScreenLayout>
    </>
  );
}


