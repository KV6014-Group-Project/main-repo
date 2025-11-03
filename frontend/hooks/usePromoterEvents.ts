import React from 'react';
import { Alert, Share } from 'react-native';
import { addPromoterAssignment, listEventsForPromoter, getEventById } from '@/lib/eventStore';
import { buildShareUrl, decodeOrganiserToken, encodeParticipantToken, extractTokenFromUrl } from '@/lib/shareLinks';

export function usePromoterEvents(promoterId: string) {
  const [events, setEvents] = React.useState<Array<{ 
    id: string; 
    name: string; 
    date: string; 
    time: string; 
    location: { venue: string; room?: string } 
  }>>([]);
  const [linkInput, setLinkInput] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [shared, setShared] = React.useState<Record<string, { url: string; token: string }>>({});
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    const list = await listEventsForPromoter(promoterId);
    setEvents(list);
  }, [promoterId]);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const onAcceptOrganiserLink = React.useCallback(async () => {
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
  }, [linkInput, promoterId, refresh]);

  const onShareParticipantLink = React.useCallback(async (eventId: string) => {
    const token = encodeParticipantToken({ eventId, issuedAt: Date.now(), shareId: eventId + '-' + Date.now(), promoterId });
    const url = buildShareUrl(token);
    
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
    
    try { 
      await Share.share({ message: url }); 
    } catch {}
    
    Alert.alert('Participant Link Ready', `URL:\n${url}\n\nRaw token (add to events.json sharing.participantLinks):\n${token}`);
    setShared(prev => ({ ...prev, [eventId]: { url, token } }));
  }, [promoterId]);

  return {
    events,
    linkInput,
    setLinkInput,
    busy,
    shared,
    statusMsg,
    onAcceptOrganiserLink,
    onShareParticipantLink,
  };
}

