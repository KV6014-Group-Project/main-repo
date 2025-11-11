import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ScreenLayout } from '@/components/layouts';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';
import { usePromoterEvents } from '@/hooks';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function PromoterHome() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const promoterId = React.useMemo(() => session?.profile?.email || 'promoter-local', [session]);
  
  const {
    events,
    linkInput,
    setLinkInput,
    busy,
    shared,
    statusMsg,
    onAcceptOrganiserLink,
    onShareParticipantLink,
  } = usePromoterEvents(promoterId);

  const onSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScreenLayout
        title="Promoter"
        subtitle="Turn organiser events into audiences with tracked share links."
      >
        <Card className="overflow-hidden md:shadow-lg w-full">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Add Event</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Accept organiser links and generate participant links</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <View className="gap-1.5">
                <Text className="text-sm">Paste organiser share link</Text>
                <Input
                  value={linkInput}
                  onChangeText={setLinkInput}
                  placeholder="https://link.local/?t=... or token"
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="border-border bg-background text-foreground h-12 rounded-md border px-4"
                />
              </View>
              <Button onPress={onAcceptOrganiserLink} disabled={busy || !linkInput.trim()}>
                <Text>Add Event</Text>
              </Button>
              {statusMsg ? (
                <Text className="text-xs text-muted-foreground mt-2">{statusMsg}</Text>
              ) : null}
            </View>
          </CardContent>
        </Card>

        <Card className="overflow-hidden md:shadow-lg w-full">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Assigned Events</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Share participant links to invite people</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {events.length === 0 ? (
                <Text variant="muted">No events assigned yet.</Text>
              ) : (
                events.map(ev => (
                  <View key={ev.id} className="rounded-md border border-border p-4 gap-3">
                    <View className="gap-1.5">
                      <Text className="text-base font-semibold">{ev.name}</Text>
                      <Text variant="muted">{ev.date} • {ev.time}</Text>
                      <Text variant="muted">{ev.location.venue}{ev.location.room ? `, ${ev.location.room}` : ''}</Text>
                    </View>
                    <View className="flex-row gap-3">
                      <Button onPress={() => onShareParticipantLink(ev.id)}>
                        <Text>Share to Participants</Text>
                      </Button>
                    </View>
                    {shared[ev.id] ? (
                      <View className="gap-3 pt-3 border-t border-border">
                        <View className="gap-1.5">
                          <Text className="text-sm font-semibold">Participant link URL</Text>
                          <Text selectable className="text-xs text-muted-foreground">{shared[ev.id].url}</Text>
                        </View>
                        <View className="gap-1.5">
                          <Text className="text-sm font-semibold">Raw token</Text>
                          <Text selectable className="text-xs text-muted-foreground">{shared[ev.id].token}</Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          </CardContent>
        </Card>

        <Button
          className="mt-6"
          variant="ghost"
          size="lg"
          onPress={onSignOut}
        >
          <Text>Sign out</Text>
        </Button>
      </ScreenLayout>
    </>
  );
}


