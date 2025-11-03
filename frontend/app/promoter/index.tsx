import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, TextInput, Alert, Share, ScrollView } from 'react-native';
import { addPromoterAssignment, listEventsForPromoter } from '@/lib/eventStore';
import { buildShareUrl, decodeOrganiserToken, encodeParticipantToken, extractTokenFromUrl } from '@/lib/shareLinks';
import { getEventById } from '@/lib/eventStore';

export default function PromoterHome() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const promoterId = React.useMemo(() => session?.profile?.email || 'promoter-local', [session]);
  const [events, setEvents] = React.useState<Array<{ id: string; name: string; date: string; time: string; location: { venue: string; room?: string } }>>([]);
  const [linkInput, setLinkInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [shared, setShared] = React.useState<Record<string, { url: string; token: string }>>({});
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const onSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  const refresh = React.useCallback(async () => {
    const list = await listEventsForPromoter(promoterId);
    setEvents(list);
  }, [promoterId]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const onAcceptOrganiserLink = async () => {
    const token = extractTokenFromUrl(linkInput.trim());
    if (!token) {
      Alert.alert('Invalid link', 'Paste a valid organiser link or token.');
      setStatusMsg('Invalid link/token');
      return;
    }
    try {
      setBusy(true);
      setStatusMsg('Processing link…');
      const decoded = decodeOrganiserToken(token);
      setStatusMsg(`Decoded eventId: ${decoded.eventId}`);
      const ev = await getEventById(decoded.eventId);
      if (!ev) {
        setStatusMsg('Event not found in events.json (reload after editing).');
        throw new Error('Event not found in shared data.');
      }
      if (ev.sharing && !ev.sharing.promoterLinks.includes(token)) {
        const proceed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Link not in events.json',
            'This organiser link is not yet listed under sharing.promoterLinks. Update events.json using the organiser console log. Proceed anyway for dev?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Proceed', style: 'default', onPress: () => resolve(true) },
            ]
          );
        });
        if (!proceed) return;
      }
      await addPromoterAssignment(decoded.eventId, promoterId);
      await refresh();
      setLinkInput('');
      Alert.alert('Event added', 'You can now promote this event.');
      setStatusMsg('Event added to your list.');
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Failed to accept link');
      setStatusMsg(e instanceof Error ? e.message : 'Failed to accept link');
    } finally {
      setBusy(false);
    }
  };

  const onShareParticipantLink = async (eventId: string) => {
    const token = encodeParticipantToken({ eventId, issuedAt: Date.now(), shareId: eventId + '-' + Date.now(), promoterId });
    const url = buildShareUrl(token);
    // Log updated event for sharing
    try {
      const ev = await getEventById(eventId);
      if (ev && ev.sharing) {
        const updatedSharing = {
          ...ev.sharing,
          participantLinks: [...ev.sharing.participantLinks, token]
        };
        const updatedEv = { ...ev, sharing: updatedSharing };
        console.log('Update this event in frontend/data/events.json with new participant link:');
        console.log(JSON.stringify(updatedEv, null, 2));
      }
    } catch (e) {
      console.warn('Could not log sharing update:', e);
    }
    // Share and always alert
    try { await Share.share({ message: url }); } catch {}
    Alert.alert('Participant Link Ready', `URL:\n${url}\n\nRaw token (add to events.json sharing.participantLinks):\n${token}`);
    setShared(prev => ({ ...prev, [eventId]: { url, token } }));
  };

  return (
    <View className="flex-1 p-6">
      <ScrollView className="w-full" contentContainerStyle={{ alignItems: 'center' }}>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>
              <Text variant="h3">Promoter</Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">Accept organiser links and generate participant links</Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              <Text className="text-sm">Paste organiser share link</Text>
              <TextInput
                value={linkInput}
                onChangeText={setLinkInput}
                placeholder="https://link.local/?t=... or token"
                autoCapitalize="none"
                autoCorrect={false}
                className="border-border bg-background text-foreground h-12 rounded-md border px-4"
              />
              <Button onPress={onAcceptOrganiserLink} disabled={busy || !linkInput.trim()}>
                <Text>Add Event</Text>
              </Button>
              {statusMsg ? (
                <Text className="text-xs text-muted-foreground">{statusMsg}</Text>
              ) : null}
            </View>
          </CardContent>
        </Card>

        <View className="h-4" />

        <Card className="w-full max-w-2xl">
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
                  <View key={ev.id} className="rounded-md border border-border p-3 gap-2">
                    <Text className="text-base font-semibold">{ev.name}</Text>
                    <Text variant="muted">{ev.date} • {ev.time}</Text>
                    <Text variant="muted">{ev.location.venue}{ev.location.room ? `, ${ev.location.room}` : ''}</Text>
                    <View className="flex-row gap-3 mt-2">
                      <Button onPress={() => onShareParticipantLink(ev.id)}>
                        <Text>Share to Participants</Text>
                      </Button>
                    </View>
                    {shared[ev.id] ? (
                      <View className="mt-3 gap-2">
                        <Text className="text-sm font-semibold">Participant link URL</Text>
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


