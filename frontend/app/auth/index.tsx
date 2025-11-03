import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function AuthIndexScreen() {
  const { signUp } = useSession();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const continueAsParticipant = async () => {
    router.push('/auth/participant');
  };

  return (
    <>
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} className="flex-1 items-center justify-center p-6">
      <View className="w-full max-w-md gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Welcome</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Choose how to continue</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              <Button size="lg" onPress={continueAsParticipant} disabled={loading}>
                <Text>Continue as Participant</Text>
              </Button>

              <View className="h-px bg-border" />
              <Text className="text-center text-sm text-muted-foreground">Or manage an event</Text>

              <Button variant="outline" onPress={() => router.push('/auth/organiser')}>
                <Text>I am an Organiser</Text>
              </Button>
              <Button variant="outline" onPress={() => router.push('/auth/promoter')}>
                <Text>I am a Promoter</Text>
              </Button>

              {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
            </View>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
    </>
  );
}


