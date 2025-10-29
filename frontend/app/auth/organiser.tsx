import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';

type Mode = 'signin' | 'signup';

export default function OrganiserAuth() {
  const { signIn, signUp } = useSession();
  const router = useRouter();

  const [mode, setMode] = React.useState<Mode>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        const session = await signIn(email, password, 'organiser');
        if (session?.role === 'organiser') router.replace('/organiser');
      } else {
        if (!name.trim()) {
          throw new Error('Full name is required');
        }
        const session = await signUp({ email, password, role: 'organiser', name });
        if (session?.role === 'organiser') router.replace('/organiser');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} className="flex-1 items-center justify-center p-6">
      <View className="w-full max-w-md gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Organiser</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Sign in or create an organiser account</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <View className="flex-row">
                <Button
                  variant={mode === 'signin' ? 'default' : 'outline'}
                  className="rounded-r-none -mr-px flex-1"
                  onPress={() => setMode('signin')}
                >
                  <Text>Sign In</Text>
                </Button>
                <Button
                  variant={mode === 'signup' ? 'default' : 'outline'}
                  className="rounded-l-none flex-1"
                  onPress={() => setMode('signup')}
                >
                  <Text>Sign Up</Text>
                </Button>
              </View>
              {mode === 'signup' ? (
                <Input value={name} onChangeText={setName} placeholder="Full name" autoCapitalize="words" />
              ) : null}
              <Input value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />
              <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
              <Button onPress={onSubmit} disabled={loading}>
                <Text>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
              </Button>
              {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
            </View>
          </CardContent>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      className="border-border bg-background text-foreground h-12 rounded-md border px-4"
      placeholderTextColor="#9CA3AF"
    />
  );
}


