import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { EventCard } from '@/components/events';
import { ScreenLayout } from '@/components/layouts';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { View, TextInput } from 'react-native';
import { useSession } from '@/providers/SessionProvider';
import { QrCodeIcon, LinkIcon } from 'lucide-react-native';
import { useParticipantEvents } from '@/hooks';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function Screen() {
  const { signOut } = useSession();
  const router = useRouter();
  const {
    checkedInEvents,
    showLinkInput,
    linkInput,
    setLinkInput,
    activeEvents,
    handleCheckIn,
    handleLeaveEvent,
    handleScanQRCode,
    toggleLinkInput,
    handleSubmitLink,
  } = useParticipantEvents();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/welcome');
  };

  return (
    <>
      {SCREEN_OPTIONS ? <Stack.Screen options={SCREEN_OPTIONS} /> : null}
      <ScreenLayout title="Event Manager">
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
                  onPress={toggleLinkInput}
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
          activeEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isCheckedIn={checkedInEvents.has(event.id)}
              onCheckIn={() => handleCheckIn(event.id)}
              onLeave={() => handleLeaveEvent(event.id)}
              onViewDetails={() => {}}
              onShare={() => {}}
            />
          ))
        )}

        <Button className="mt-6" onPress={handleSignOut}>
          <Text>Sign Out</Text>
        </Button>
      </ScreenLayout>
    </>
  );
}
