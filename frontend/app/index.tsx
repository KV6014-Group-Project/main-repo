import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { EventCard } from '@/components/events';
import { ScreenLayout } from '@/components/layouts';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';
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
    router.replace('/auth');
  };

  const hasEvents = activeEvents.length > 0;

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />
      <ScreenLayout
        title="Your events"
        subtitle={hasEvents ? 'Check in fast. Leave when you are done.' : 'Join your first event in a few seconds.'}
      >
        {/* Primary CTA: Scan to join */}
        <Card className="overflow-hidden md:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle>
              <Text variant="h3" className="font-semibold">
                Join an event
              </Text>
            </CardTitle>
            <CardDescription>
              <Text variant="muted">
                Scan the QR code at check-in, or paste the link you received.
              </Text>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View className="gap-3">
              {/* Primary action */}
              <Button
                onPress={handleScanQRCode}
                size="lg"
                className="w-full"
              >
                <Icon as={QrCodeIcon} className="mr-2" size={20} />
                <Text className="font-semibold">Scan event QR code</Text>
              </Button>

              {/* Secondary: link input toggle */}
              <Button
                onPress={toggleLinkInput}
                variant={showLinkInput ? 'ghost' : 'outline'}
                size="lg"
                className="w-full"
              >
                <Icon as={LinkIcon} className="mr-2" size={20} />
                <Text>{showLinkInput ? 'Hide link input' : 'Use event link instead'}</Text>
              </Button>

              {/* Link input flow */}
              {showLinkInput && (
                <View className="gap-3 pt-3 border-t border-border">
                  <View className="gap-1.5">
                    <Text className="text-sm font-medium">Event link</Text>
                    <Text variant="muted" className="text-xs">
                      Paste the full link from your organiser or promoter. We will detect the event automatically.
                    </Text>
                    <Input
                      value={linkInput}
                      onChangeText={setLinkInput}
                      placeholder="https://event.example/join/abc123"
                      keyboardType="url"
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="border-border bg-background text-foreground h-12 rounded-md border px-4 text-base"
                    />
                  </View>
                  <Button
                    onPress={handleSubmitLink}
                    size="lg"
                    className="w-full"
                    disabled={!linkInput?.trim()}
                  >
                    <Text className="font-semibold">Join via link</Text>
                  </Button>
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Events List / States */}
        {hasEvents ? (
          <>
            <Card className="overflow-hidden md:shadow-lg mt-4">
              <CardHeader className="pb-2">
                <CardTitle>
                  <Text variant="h3" className="font-semibold">
                    Your active events
                  </Text>
                </CardTitle>
                <CardDescription>
                  <Text variant="muted">
                    Check in, view details, or leave when you are done.
                  </Text>
                </CardDescription>
              </CardHeader>
            </Card>
            {activeEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isCheckedIn={checkedInEvents.has(event.id)}
                onCheckIn={() => handleCheckIn(event.id)}
                onLeave={() => handleLeaveEvent(event.id)}
                onViewDetails={() => {}}
                onShare={() => {}}
              />
            ))}
          </>
        ) : (
          <Card className="overflow-hidden md:shadow-lg mt-4">
            <CardContent className="py-8">
              <View className="items-center gap-3">
                <Text variant="muted" className="text-center text-base">
                  You are not registered for any events yet.
                </Text>
                <Text variant="muted" className="text-center text-sm">
                  Scan the QR code at an event entrance or use the invite link shared with you.
                </Text>
                <Button
                  onPress={handleScanQRCode}
                  size="lg"
                  className="mt-1"
                >
                  <Icon as={QrCodeIcon} className="mr-2" size={18} />
                  <Text className="font-semibold">Scan to join an event</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        <Button
          className="mt-6"
          variant="ghost"
          size="lg"
          onPress={handleSignOut}
        >
          <Text>Sign out</Text>
        </Button>
      </ScreenLayout>
    </>
  );
}
