import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ScreenLayout } from '@/components/layouts';
import { useSession } from '@/providers/SessionProvider';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, TextInput } from 'react-native';
import { useOrganiserEvents } from '@/hooks';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function OrganiserHome() {
  const { signOut } = useSession();
  const router = useRouter();
  const {
    events,
    name,
    setName,
    date,
    setDate,
    time,
    setTime,
    venue,
    setVenue,
    room,
    setRoom,
    description,
    setDescription,
    busy,
    shared,
    onCreate,
    onIssuePromoterLink,
  } = useOrganiserEvents();

  const onSignOut = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <>
      {SCREEN_OPTIONS ? <Stack.Screen options={SCREEN_OPTIONS} /> : null}
      <ScreenLayout title="Organiser">
        <Card className="overflow-hidden md:shadow-lg w-full">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Create Event</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Create events and share with promoters</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <Text className="text-sm">Event name</Text>
              <TextInput value={name} onChangeText={setName} placeholder="Health Fair" className="border-border bg-background text-foreground h-12 rounded-md border px-4" />
              <Text className="text-sm">Date</Text>
              <TextInput value={date} onChangeText={setDate} placeholder="2025-11-30" className="border-border bg-background text-foreground h-12 rounded-md border px-4" />
              <Text className="text-sm">Time</Text>
              <TextInput value={time} onChangeText={setTime} placeholder="10:00 - 15:00" className="border-border bg-background text-foreground h-12 rounded-md border px-4" />
              <Text className="text-sm">Venue</Text>
              <TextInput value={venue} onChangeText={setVenue} placeholder="Community Center" className="border-border bg-background text-foreground h-12 rounded-md border px-4" />
              <Text className="text-sm">Room (optional)</Text>
              <TextInput value={room} onChangeText={setRoom} placeholder="Room 2" className="border-border bg-background text-foreground h-12 rounded-md border px-4" />
              <Text className="text-sm">Description</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Short description" multiline className="border-border bg-background text-foreground min-h-20 rounded-md border px-4 py-2" />
              <Button onPress={onCreate} disabled={busy} className="mt-2">
                <Text>Create Event</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        <Card className="overflow-hidden md:shadow-lg">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Your Events</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Issue links to promoters</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-4">
              {events.length === 0 ? (
                <Text variant="muted">No events yet.</Text>
              ) : (
                events.map(ev => (
                  <View key={ev.id} className="rounded-md border border-border p-3 gap-2">
                    <Text className="text-base font-semibold">{ev.name}</Text>
                    <Text variant="muted">{ev.date} • {ev.time}</Text>
                    <Text variant="muted">{ev.location.venue}{ev.location.room ? `, ${ev.location.room}` : ''}</Text>
                    <View className="flex-row gap-3 mt-2">
                      <Button onPress={() => onIssuePromoterLink(ev.id)}>
                        <Text>Share with Promoter</Text>
                      </Button>
                    </View>
                    {shared[ev.id] ? (
                      <View className="mt-3 gap-2">
                        <Text className="text-sm font-semibold">Promoter link URL</Text>
                        <Text selectable className="text-xs text-muted-foreground">{shared[ev.id].url}</Text>
                        <Text className="text-sm font-semibold mt-2">Raw token</Text>
                        <Text selectable className="text-xs text-muted-foreground">{shared[ev.id].token}</Text>
                      </View>
                    ) : null}
                  </View>
                ))
              )}
            </View>
          </CardContent>
        </Card>

        <Button className="mt-6" onPress={onSignOut}>
          <Text>Sign Out</Text>
        </Button>
      </ScreenLayout>
    </>
  );
}


