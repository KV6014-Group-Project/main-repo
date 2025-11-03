import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'expo-router';
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
    <View className="flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <Text variant="h3">Participant</Text>
          </CardTitle>
          <CardDescription>
            <Text variant="muted">Guest session — no signup required</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Public participant area</Text>
          {session?.profile ? (
            <View className="mt-4 gap-1">
              <Text className="text-sm text-muted-foreground">Name</Text>
              <Text>{session.profile.firstName} {session.profile.lastName}</Text>
              <Text className="text-sm text-muted-foreground mt-2">Email</Text>
              <Text>{session.profile.email}</Text>
              {session.profile.phone ? (
                <>
                  <Text className="text-sm text-muted-foreground mt-2">Phone</Text>
                  <Text>{session.profile.phone}</Text>
                </>
              ) : null}
            </View>
          ) : null}
        </CardContent>
      </Card>
      <Button className="mt-6" onPress={onLeave}>
        <Text>End Guest Session</Text>
      </Button>
    </View>
  );
}


