import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSession } from '@/providers/SessionProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarIcon, MapPinIcon, UsersIcon, Share2Icon, XIcon, QrCodeIcon, LinkIcon } from 'lucide-react-native';
import { eventsData, type EventData } from '@/data/eventData';
import * as Linking from 'expo-linking';
import { Alert as RNAlert } from 'react-native';
import { decodeParticipantToken, extractTokenFromUrl } from '@/lib/shareLinks';
import { getEventById } from '@/lib/eventStore';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function Screen() {
  const { signOut } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [checkedInEvents, setCheckedInEvents] = React.useState<Set<string>>(new Set());
  const [leftEvents, setLeftEvents] = React.useState<Set<string>>(new Set());
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkInput, setLinkInput] = React.useState('');

const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  const handleCheckIn = (eventId: string) => {
    setCheckedInEvents((prev) => new Set([...prev, eventId]));
  };

  const handleLeaveEvent = (eventId: string) => {
    setLeftEvents((prev) => new Set([...prev, eventId]));
  };

  const handleScanQRCode = () => {
    // TODO: Implement QR code scanner
    // This would open a camera view to scan QR codes
    console.log('Scan QR code - implement scanner');
  };

  const handleUseLink = async () => {
    // Toggle the link input field
    setShowLinkInput(!showLinkInput);
    if (!showLinkInput) {
      // Clear input when opening
      setLinkInput('');
    }
  };

  const handleSubmitLink = async () => {
    if (!linkInput.trim()) {
      Alert.alert('Error', 'Please enter a valid link');
      return;
    }

    try {
      // Validate URL format
      const urlOrToken = linkInput.trim();
      const token = extractTokenFromUrl(urlOrToken);
      if (!token) {
        Alert.alert('Invalid Link', 'Could not extract token.');
        return;
      }

      const decoded = decodeParticipantToken(token);
      const ev = await getEventById(decoded.eventId);
      if (!ev) {
        RNAlert.alert('Unknown Event', 'This event is not available on this device.');
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

      // For demo: mark as checked-in for that event
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
  };

  // Filter out events that have been left
  const activeEvents = eventsData.filter((event) => !leftEvents.has(event.id));

  // Render a single event card
  const renderEventCard = (event: EventData) => {
    const isCheckedIn = checkedInEvents.has(event.id);

    return (
      <Card key={event.id} className="overflow-hidden md:shadow-lg">
        <CardHeader className="pb-4 md:pb-6">
          <CardTitle>
            <Text variant="h2" className="font-bold md:text-3xl">
              {event.name}
            </Text>
          </CardTitle>
        </CardHeader>
        <CardContent className="gap-6 md:gap-8">
          {/* Event Details */}
          <View className="gap-4 md:flex-row md:flex-wrap md:gap-6">
            <View className="flex-row items-start gap-3 md:flex-1 md:min-w-[280px]">
              <View className="mt-0.5">
                <Icon as={CalendarIcon} className="text-muted-foreground" size={20} />
              </View>
              <View className="flex-1 gap-1">
                <Text variant="muted" className="text-xs font-medium uppercase tracking-wide">
                  Date & Time
                </Text>
                <Text className="text-base md:text-lg font-medium">
                  {event.date}
                </Text>
                <Text variant="muted" className="text-sm md:text-base">
                  {event.time}
                </Text>
              </View>
            </View>

            <View className="h-px bg-border md:hidden" />

            <View className="flex-row items-start gap-3 md:flex-1 md:min-w-[280px]">
              <View className="mt-0.5">
                <Icon as={MapPinIcon} className="text-muted-foreground" size={20} />
              </View>
              <View className="flex-1 gap-1">
                <Text variant="muted" className="text-xs font-medium uppercase tracking-wide">
                  Location
                </Text>
                <Text className="text-base md:text-lg font-medium">
                  {event.location.venue}
                </Text>
                {event.location.room && (
                  <Text variant="muted" className="text-sm md:text-base">
                    {event.location.room}
                  </Text>
                )}
              </View>
            </View>

            <View className="h-px bg-border md:hidden" />

            <View className="flex-row items-start gap-3 md:flex-1 md:min-w-[280px]">
              <View className="mt-0.5">
                <Icon as={UsersIcon} className="text-muted-foreground" size={20} />
              </View>
              <View className="flex-1 gap-1">
                <Text variant="muted" className="text-xs font-medium uppercase tracking-wide">
                  Attendees
                </Text>
                <Text className="text-base md:text-lg font-semibold">
                  {event.attendees.registered} registered
                  {event.attendees.max && ` / ${event.attendees.max} max`}
                </Text>
              </View>
            </View>

            <View className="h-px bg-border md:hidden" />

            <View className="gap-2 md:w-full">
              <Text variant="muted" className="text-xs font-medium uppercase tracking-wide">
                Description
              </Text>
              <Text className="text-sm md:text-base leading-6 text-muted-foreground">
                {event.description}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pt-2 md:pt-4 md:flex-row md:flex-wrap">
            {!isCheckedIn ? (
              <Button 
                onPress={() => handleCheckIn(event.id)} 
                size="lg" 
                className="w-full md:flex-1 md:min-w-[200px]"
              >
                <Text className="font-semibold">Check In</Text>
              </Button>
            ) : (
              <Button 
                variant="secondary" 
                size="lg" 
                disabled 
                className="w-full md:flex-1 md:min-w-[200px]"
              >
                <Text className="font-semibold">Checked In ✓</Text>
              </Button>
            )}
            <Button variant="outline" size="lg" className="w-full md:flex-1 md:min-w-[200px]">
              <Text>View Event Details</Text>
            </Button>
            <Button variant="ghost" size="lg" className="w-full md:flex-1 md:min-w-[200px]">
              <Icon as={Share2Icon} className="mr-2" size={18} />
              <Text>Share Event</Text>
            </Button>
          </View>

          {/* Leave Event Button */}
          <View className="pt-2">
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onPress={() => handleLeaveEvent(event.id)}
            >
              <Icon as={XIcon} className="mr-2" size={18} />
              <Text className="font-semibold">Leave Event</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {SCREEN_OPTIONS ? <Stack.Screen options={SCREEN_OPTIONS} /> : null}
      <View className="flex-1 bg-background">
        {/* Header */}
        <View
          className="bg-background border-b border-border px-6 md:px-8"
          style={{ paddingTop: insets.top }}
        >
          <View className="flex-row items-center justify-between py-4 md:max-w-4xl md:mx-auto md:w-full">
            <Text variant="h3" className="font-semibold">
              Event Manager
            </Text>
            <ThemeToggle />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1">
          <View className="gap-6 p-6 md:p-8 md:max-w-4xl md:mx-auto md:w-full">
            {/* Add Event Section */}
            <Card className="overflow-hidden md:shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle>
                  <Text variant="h3" className="font-semibold">
                    Add Event
                  </Text>
                </CardTitle>
                <CardDescription>
                  <Text variant="muted">
                    Register for a new event using QR code or link
                  </Text>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View className="gap-3">
                  <View className="gap-3 md:flex-row">
                    <Button
                      onPress={handleScanQRCode}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <Icon as={QrCodeIcon} className="mr-2" size={20} />
                      <Text>Scan QR Code</Text>
                    </Button>
                    <Button
                      onPress={handleUseLink}
                      variant="outline"
                      size="lg"
                      className="flex-1"
                    >
                      <Icon as={LinkIcon} className="mr-2" size={20} />
                      <Text>{showLinkInput ? 'Cancel' : 'Use Link'}</Text>
                    </Button>
                  </View>
                  
                  {showLinkInput && (
                    <View className="gap-3 pt-2">
                      <TextInput
                        value={linkInput}
                        onChangeText={setLinkInput}
                        placeholder="Paste event link here"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="border-border bg-background text-foreground h-12 rounded-md border px-4 text-base"
                      />
                      <Button
                        onPress={handleSubmitLink}
                        size="lg"
                        className="w-full"
                      >
                        <Text className="font-semibold">Add Event</Text>
                      </Button>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>

            {/* Events List */}
            {activeEvents.length === 0 ? (
              <Card className="overflow-hidden md:shadow-lg">
                <CardContent className="py-8">
                  <View className="items-center gap-3">
                    <Text variant="muted" className="text-center">
                      No events registered. Check back later for available events.
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ) : (
              activeEvents.map((event) => renderEventCard(event))
            )}

            <Button className="mt-6" onPress={handleSignOut}>
              <Text>Sign Out</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
