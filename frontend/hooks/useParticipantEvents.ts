import React from 'react';
import { Alert } from 'react-native';
import { eventsData } from '@/data/eventData';
import { decodeParticipantToken, extractTokenFromUrl } from '@/lib/shareLinks';
import { getEventById } from '@/lib/eventStore';

export function useParticipantEvents() {
  const [checkedInEvents, setCheckedInEvents] = React.useState<Set<string>>(new Set());
  const [leftEvents, setLeftEvents] = React.useState<Set<string>>(new Set());
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkInput, setLinkInput] = React.useState('');

  const handleCheckIn = React.useCallback((eventId: string) => {
    setCheckedInEvents((prev) => new Set([...prev, eventId]));
  }, []);

  const handleLeaveEvent = React.useCallback((eventId: string) => {
    setLeftEvents((prev) => new Set([...prev, eventId]));
  }, []);

  const handleScanQRCode = React.useCallback(() => {
    // TODO: Implement QR code scanner
    console.log('Scan QR code - implement scanner');
  }, []);

  const toggleLinkInput = React.useCallback(() => {
    setShowLinkInput((prev) => !prev);
    setLinkInput('');
  }, []);

  const handleSubmitLink = React.useCallback(async () => {
    if (!linkInput.trim()) {
      Alert.alert('Error', 'Please enter a valid link');
      return;
    }

    try {
      const urlOrToken = linkInput.trim();
      const token = extractTokenFromUrl(urlOrToken);
      if (!token) {
        Alert.alert('Invalid Link', 'Could not extract token.');
        return;
      }

      const decoded = decodeParticipantToken(token);
      const ev = await getEventById(decoded.eventId);
      if (!ev) {
        Alert.alert('Unknown Event', 'This event is not available on this device.');
        return;
      }
      if (ev.sharing && !ev.sharing.participantLinks.includes(token)) {
        const proceed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Link not in events.json',
            'This participant link is not yet listed under sharing.participantLinks. Update events.json from promoter console log. Proceed anyway for dev?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Proceed', style: 'default', onPress: () => resolve(true) },
            ]
          );
        });
        if (!proceed) return;
      }

      setCheckedInEvents((prev) => new Set([...prev, ev.id]));

      Alert.alert('Success', `Joined event: ${ev.name}`, [
        { text: 'OK', onPress: () => {
          setShowLinkInput(false);
          setLinkInput('');
        }}
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to process link. Please try again.');
    }
  }, [linkInput]);

  const activeEvents = React.useMemo(() => 
    eventsData.filter((event) => !leftEvents.has(event.id)),
    [leftEvents]
  );

  return {
    checkedInEvents,
    leftEvents,
    showLinkInput,
    linkInput,
    setLinkInput,
    activeEvents,
    handleCheckIn,
    handleLeaveEvent,
    handleScanQRCode,
    toggleLinkInput,
    handleSubmitLink,
  };
}

