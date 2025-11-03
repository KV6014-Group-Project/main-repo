import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPinIcon, UsersIcon, Share2Icon, XIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import type { EventData } from '@/data/eventData';

interface EventCardProps {
  event: EventData;
  isCheckedIn?: boolean;
  onCheckIn?: () => void;
  onLeave?: () => void;
  onShare?: () => void;
  onViewDetails?: () => void;
}

export function EventCard({ 
  event, 
  isCheckedIn = false,
  onCheckIn,
  onLeave,
  onShare,
  onViewDetails 
}: EventCardProps) {
  return (
    <Card className="overflow-hidden md:shadow-lg">
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
          {/* Date & Time */}
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

          {/* Location */}
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

          {/* Attendees */}
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

          {/* Description */}
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
        {(onCheckIn || onViewDetails || onShare) && (
          <View className="gap-3 pt-2 md:pt-4 md:flex-row md:flex-wrap">
            {onCheckIn && (
              !isCheckedIn ? (
                <Button 
                  onPress={onCheckIn} 
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
              )
            )}
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full md:flex-1 md:min-w-[200px]"
                onPress={onViewDetails}
              >
                <Text>View Event Details</Text>
              </Button>
            )}
            {onShare && (
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full md:flex-1 md:min-w-[200px]"
                onPress={onShare}
              >
                <Icon as={Share2Icon} className="mr-2" size={18} />
                <Text>Share Event</Text>
              </Button>
            )}
          </View>
        )}

        {/* Leave Event Button */}
        {onLeave && (
          <View className="pt-2">
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onPress={onLeave}
            >
              <Icon as={XIcon} className="mr-2" size={18} />
              <Text className="font-semibold">Leave Event</Text>
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

