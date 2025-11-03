import eventsJson from './events.json';

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
export const eventsData: EventData[] = eventsJson;

// Legacy export for backward compatibility (single event)
export const eventData = eventsData[0];

