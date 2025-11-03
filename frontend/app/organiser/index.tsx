import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, TextInput, Share, Alert, ScrollView } from 'react-native';
import { createOrganiserEvent, listOrganiserEvents, getEventById } from '@/lib/eventStore';
import { buildShareUrl, encodeOrganiserToken } from '@/lib/shareLinks';

export default function OrganiserHome() {
  const { signOut } = useSession();
  const router = useRouter();
  const [events, setEvents] = React.useState<Array<{
    id: string;
    name: string;
    date: string;
    time: string;
    location: { venue: string; room?: string };
    description: string;
  }>>([]);

  const [name, setName] = React.useState('');
  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [venue, setVenue] = React.useState('');
  const [room, setRoom] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [shared, setShared] = React.useState<Record<string, { url: string; token: string }>>({});

  const onSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  React.useEffect(() => {
    (async () => {
      const list = await listOrganiserEvents();
      setEvents(list);
    })();
  }, []);

  const onCreate = async () => {
    if (!name.trim() || !date.trim() || !time.trim() || !venue.trim()) {
      Alert.alert('Missing details', 'Please fill name, date, time and venue.');
      return;
    }
    try {
      setBusy(true);
      const created = await createOrganiserEvent({
        name: name.trim(),
        date: date.trim(),
        time: time.trim(),
        location: { venue: venue.trim(), room: room.trim() || undefined },
        description: description.trim() || '',
      });
      setEvents((prev) => [created, ...prev]);
      setName(''); setDate(''); setTime(''); setVenue(''); setRoom(''); setDescription('');
      Alert.alert('Event Created', 'Check the console for the JSON to add to frontend/data/events.json, then reload the app to see it persisted.');
    } finally {
      setBusy(false);
    }
  };

  const onIssuePromoterLink = async (eventId: string) => {
    const token = encodeOrganiserToken({ eventId, issuedAt: Date.now(), shareId: eventId + '-' + Date.now() });
    const url = buildShareUrl(token);
    // Log updated event for sharing
    try {
      const ev = await getEventById(eventId);
      if (ev && ev.sharing) {
        const updatedSharing = {
          ...ev.sharing,
          promoterLinks: [...ev.sharing.promoterLinks, token]
        };
        const updatedEv = { ...ev, sharing: updatedSharing };
        console.log('Update this event in frontend/data/events.json with new promoter link:');
        console.log(JSON.stringify(updatedEv, null, 2));
      }
    } catch (e) {
      console.warn('Could not log sharing update:', e);
    }
    // Share the URL; always show alert with URL & token
    try {
      await Share.share({ message: url });
    } catch {}
    Alert.alert('Promoter Link Ready', `URL:\n${url}\n\nRaw token (add to events.json sharing.promoterLinks):\n${token}`);
    setShared((prev) => ({ ...prev, [eventId]: { url, token } }));
  };

  return (
    <View className="flex-1 p-6">
      <ScrollView className="w-full" contentContainerStyle={{ alignItems: 'center' }}>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Organiser</Text>
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

        <View className="h-4" />

        <Card className="w-full max-w-2xl">
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
      </ScrollView>
    </View>
  );
}


