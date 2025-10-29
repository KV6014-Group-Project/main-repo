import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useSession } from '@/providers/SessionProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CalendarIcon, MapPinIcon, UsersIcon, Share2Icon, XIcon } from 'lucide-react-native';

const SCREEN_OPTIONS = {
  headerShown: false,
};

export default function Screen() {
  const { signOut } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isCheckedIn, setIsCheckedIn] = React.useState(false);
  const [hasLeft, setHasLeft] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth');
  };

  const handleCheckIn = () => {
    setIsCheckedIn(true);
  };

  const handleLeaveEvent = () => {
    setHasLeft(true);
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
            {hasLeft ? (
              <Card className="overflow-hidden md:shadow-lg">
                <CardContent className="py-8">
                  <View className="items-center gap-3">
                    <Text variant="muted" className="text-center">
                      You have left this event. Your spot has been freed up for another participant.
                    </Text>
                  </View>
                </CardContent>
              </Card>
            ) : (
              /* Medical Screening Event */
              <Card className="overflow-hidden md:shadow-lg">
                <CardHeader className="pb-4 md:pb-6">
                  <CardTitle>
                    <Text variant="h2" className="font-bold md:text-3xl">
                      Medical Screening
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
                          March 15, 2024
                        </Text>
                        <Text variant="muted" className="text-sm md:text-base">
                          9:00 AM - 12:00 PM
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
                          Community Health Center
                        </Text>
                        <Text variant="muted" className="text-sm md:text-base">
                          Room 201
                        </Text>
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
                          142 registered
                        </Text>
                      </View>
                    </View>

                    <View className="h-px bg-border md:hidden" />

                    <View className="gap-2 md:w-full">
                      <Text variant="muted" className="text-xs font-medium uppercase tracking-wide">
                        Description
                      </Text>
                      <Text className="text-sm md:text-base leading-6 text-muted-foreground">
                        Free health screening including blood pressure, BMI, and basic health consultation.
                        No appointment needed, walk-ins welcome.
                      </Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="gap-3 pt-2 md:pt-4 md:flex-row md:flex-wrap">
                    {!isCheckedIn ? (
                      <Button onPress={handleCheckIn} size="lg" className="w-full md:flex-1 md:min-w-[200px]">
                        <Text className="font-semibold">Check In</Text>
                      </Button>
                    ) : (
                      <Button variant="secondary" size="lg" disabled className="w-full md:flex-1 md:min-w-[200px]">
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
                      onPress={handleLeaveEvent}
                    >
                      <Icon as={XIcon} className="mr-2" size={18} />
                      <Text className="font-semibold">Leave Event</Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            )}

            <Button variant="outline" onPress={handleLogout} className="mt-2">
              <Text>Log Out</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </>
  );
}


