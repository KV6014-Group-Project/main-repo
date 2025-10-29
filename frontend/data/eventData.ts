// Event data structure
export type EventData = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: {
    venue: string;
    room?: string;
  };
  attendees: {
    registered: number;
    max?: number;
  };
  description: string;
};

// Example events data - replace with API call or props
export const eventsData: EventData[] = [
  {
    id: 'medical-screening-2024',
    name: 'Medical Screening',
    date: 'March 15, 2024',
    time: '9:00 AM - 12:00 PM',
    location: {
      venue: 'Community Health Center',
      room: 'Room 201',
    },
    attendees: {
      registered: 142,
    },
    description: 'Free health screening including blood pressure, BMI, and basic health consultation. No appointment needed, walk-ins welcome.',
  },
  {
    id: 'wellness-workshop-2024',
    name: 'Wellness Workshop',
    date: 'March 20, 2024',
    time: '2:00 PM - 4:00 PM',
    location: {
      venue: 'Community Center',
      room: 'Main Hall',
    },
    attendees: {
      registered: 78,
      max: 100,
    },
    description: 'Interactive workshop on stress management, mindfulness, and healthy lifestyle habits. Includes practical exercises and Q&A session.',
  },
];

// Legacy export for backward compatibility (single event)
export const eventData = eventsData[0];

