import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import React from 'react';
import { View } from 'react-native';

type Mode = 'signin' | 'signup';

interface AuthFormProps {
  role: 'organiser' | 'promoter';
  onSubmit: (params: {
    mode: Mode;
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export function AuthForm({ role, onSubmit }: AuthFormProps) {
  const [mode, setMode] = React.useState<Mode>('signin');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [confirmEmail, setConfirmEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    // Validation
    if (mode === 'signup') {
      if (!firstName.trim() || !lastName.trim()) {
        setError('First and last name are required');
        return;
      }
      if (email !== confirmEmail) {
        setError('Emails do not match');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setLoading(true);
    try {
      await onSubmit({
        mode,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Text variant="h3">{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
        </CardTitle>
        <CardDescription>
          <Text variant="muted">Sign in or create a {role} account</Text>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <View className="gap-3">
          {/* Mode Toggle */}
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

          {/* Form Fields */}
          {mode === 'signup' ? (
            <>
              <Input 
                value={firstName} 
                onChangeText={setFirstName} 
                placeholder="First name" 
                autoCapitalize="words" 
              />
              <Input 
                value={lastName} 
                onChangeText={setLastName} 
                placeholder="Last name" 
                autoCapitalize="words" 
              />
              <Input 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Email" 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
              <Input 
                value={confirmEmail} 
                onChangeText={setConfirmEmail} 
                placeholder="Confirm email" 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
              <Input 
                value={password} 
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry 
              />
              <Input 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                placeholder="Confirm password" 
                secureTextEntry 
              />
            </>
          ) : (
            <>
              <Input 
                value={email} 
                onChangeText={setEmail} 
                placeholder="Email" 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
              <Input 
                value={password} 
                onChangeText={setPassword} 
                placeholder="Password" 
                secureTextEntry 
              />
            </>
          )}

          <Button onPress={handleSubmit} disabled={loading}>
            <Text>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
          </Button>

          {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
        </View>
      </CardContent>
    </Card>
  );
}

