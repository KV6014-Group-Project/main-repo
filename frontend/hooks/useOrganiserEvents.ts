import React from 'react';
import { Alert, Share } from 'react-native';
import { createOrganiserEvent, listOrganiserEvents, getEventById } from '@/lib/eventStore';
import { buildShareUrl, encodeOrganiserToken } from '@/lib/shareLinks';

export function useOrganiserEvents() {
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

  React.useEffect(() => {
    (async () => {
      const list = await listOrganiserEvents();
      setEvents(list);
    })();
  }, []);

  const onCreate = React.useCallback(async () => {
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
      setName(''); 
      setDate(''); 
      setTime(''); 
      setVenue(''); 
      setRoom(''); 
      setDescription('');
      Alert.alert('Event Created', 'Check the console for the JSON to add to frontend/data/events.json, then reload the app to see it persisted.');
    } finally {
      setBusy(false);
    }
  }, [name, date, time, venue, room, description]);

  const onIssuePromoterLink = React.useCallback(async (eventId: string) => {
    const token = encodeOrganiserToken({ eventId, issuedAt: Date.now(), shareId: eventId + '-' + Date.now() });
    const url = buildShareUrl(token);
    
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
    
    try {
      await Share.share({ message: url });
    } catch {}
    
    Alert.alert('Promoter Link Ready', `URL:\n${url}\n\nRaw token (add to events.json sharing.promoterLinks):\n${token}`);
    setShared((prev) => ({ ...prev, [eventId]: { url, token } }));
  }, []);

  return {
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
  };
}

