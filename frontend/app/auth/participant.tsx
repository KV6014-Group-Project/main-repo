import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

export default function ParticipantOnboardingScreen() {
  const { signUp } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isValidEmail = (value: string) => /.+@.+\..+/.test(value.trim());
  const isValidUkMobileOptional = (value: string) => {
    const v = value.trim();
    if (!v) return true; // optional
    const cleaned = v.replace(/[^+\d]/g, '');
    if (/^\+447\d{9}$/.test(cleaned)) return true; // +44 7xxxxxxxxx
    if (/^07\d{9}$/.test(cleaned)) return true; // 07xxxxxxxxx
    return false;
  };
  const canSubmit = firstName.trim() && lastName.trim() && isValidEmail(email) && isValidUkMobileOptional(phone);

  const normalizeUkMobileToE164 = (value: string): string | undefined => {
    const v = value.trim();
    if (!v) return undefined;
    let cleaned = v.replace(/[^+\d]/g, '');
    if (cleaned.startsWith('00')) cleaned = '+' + cleaned.slice(2);
    if (cleaned.startsWith('+44')) {
      // already in +44 format; ensure it's +447xxxxxxxxx
      if (/^\+447\d{9}$/.test(cleaned)) return cleaned;
      return cleaned; // leave as-is if different UK number; lightweight handling
    }
    if (cleaned.startsWith('0')) {
      const withoutZero = cleaned.slice(1);
      return `+44${withoutZero}`;
    }
    // If just digits without prefix and starts with 7, assume UK mobile
    if (/^7\d{9}$/.test(cleaned)) return `+44${cleaned}`;
    return cleaned || undefined;
  };

  const onSubmit = async () => {
    if (!canSubmit) return;
    try {
      setLoading(true);
      setError(null);
      const s = await signUp({
        role: 'participant',
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: normalizeUkMobileToE164(phone),
      });
      if (s?.role === 'participant') router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Participant Details' }} />
      <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} className="flex-1 items-center justify-center p-6">
        <View className="w-full max-w-md gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Text variant="h3">Tell us about you</Text>
              </CardTitle>
              <CardDescription>
                <Text variant="muted">No account needed — just your basic details</Text>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <View className="gap-3">
                <View>
                  <Text className="mb-1">First name</Text>
                  <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    editable={!loading}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
                <View>
                  <Text className="mb-1">Last name</Text>
                  <Input
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    editable={!loading}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
                <View>
                  <Text className="mb-1">Email</Text>
                  <Input
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    returnKeyType="next"
                  />
                </View>
                <View>
                  <Text className="mb-1">UK mobile (optional)</Text>
                  <Input
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+44 7xxx xxxxxx or 07xxxxxxxxx"
                    keyboardType="phone-pad"
                    editable={!loading}
                    returnKeyType="done"
                  />
                </View>

                {error ? <Text className="text-destructive text-sm">{error}</Text> : null}

                <Button size="lg" onPress={onSubmit} disabled={loading || !canSubmit} className="mt-2">
                  <Text>Continue</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}


