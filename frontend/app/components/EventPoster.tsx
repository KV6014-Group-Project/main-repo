import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface EventPosterProps {
  qrValue: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventRoom?: string;
}

const EventPoster = forwardRef<View, EventPosterProps>(
  ({ qrValue, eventTitle, eventDate, eventTime, eventLocation, eventRoom }, ref) => {
    return (
      <View
        ref={ref}
        style={{
          backgroundColor: '#ffffff',
          padding: 32,
          alignItems: 'center',
          width: 400,
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: '#28B900',
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            marginBottom: 24,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontSize: 14,
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            You're Invited!
          </Text>
        </View>

        {/* Event Title */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#1a1a1a',
            textAlign: 'center',
            marginBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          {eventTitle}
        </Text>

        {/* QR Code */}
        <View
          style={{
            backgroundColor: '#f5f5f5',
            padding: 20,
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <QRCode
            value={qrValue}
            size={200}
            backgroundColor="#f5f5f5"
            color="#000000"
            ecl="M"
          />
        </View>

        {/* Event Details */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: '#333333' }}>Date: </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#333333',
                fontWeight: '500',
              }}
            >
              {eventDate}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: '#333333' }}>Time: </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#333333',
                fontWeight: '500',
              }}
            >
              {eventTime}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, color: '#333333' }}>Location: </Text>
            <Text
              style={{
                fontSize: 16,
                color: '#333333',
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              {eventLocation}
              {eventRoom ? `, ${eventRoom}` : ''}
            </Text>
          </View>
        </View>

        {/* Scan Instructions */}
        <View
          style={{
            backgroundColor: '#f0f9ff',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: '#0369a1',
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            Scan QR code to RSVP
          </Text>
        </View>

        {/* Footer */}
        <Text
          style={{
            fontSize: 11,
            color: '#9ca3af',
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Powered by ROSE
        </Text>
      </View>
    );
  }
);

EventPoster.displayName = 'EventPoster';

export default EventPoster;
