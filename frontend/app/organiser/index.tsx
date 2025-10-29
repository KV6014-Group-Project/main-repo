import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function OrganiserHome() {
  const { signOut } = useSession();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <View className="flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            <Text variant="h3">Organiser</Text>
          </CardTitle>
          <CardDescription>
            <Text variant="muted">You are signed in as Organiser</Text>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Protected organiser area</Text>
        </CardContent>
      </Card>
      <Button className="mt-6" onPress={onSignOut}>
        <Text>Sign Out</Text>
      </Button>
    </View>
  );
}


