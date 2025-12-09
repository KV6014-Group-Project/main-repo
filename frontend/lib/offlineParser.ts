/**
 * Offline QR Payload Parser
 *
 * Lightweight utility to extract human-readable event data from QR payloads.
 * Uses regex-based extraction to avoid heavy YAML parsing libraries.
 * Heavy validation is left to the backend during sync.
 */

export type ParsedEventInfo = {
  eventId: string;
  title: string;
  startTime: string;
  promoterId?: string;
  shareId?: string;
  raw: string; // Original payload for sync
};

/**
 * Parse a QR code payload and extract event information.
 *
 * Supports YAML format from the backend:
 * ```yaml
 * v: 1
 * event:
 *   id: 'uuid-here'
 *   title: 'Event Title'
 *   start: '2025-12-15T10:00:00Z'
 * share:
 *   promoterId: 'uuid'
 *   shareId: 'uuid'
 * sig: 'base64-signature'
 * ```
 *
 * Returns null if the payload is invalid or missing required fields.
 */
export function parseQRPayload(data: string): ParsedEventInfo | null {
  if (!data || typeof data !== "string") {
    return null;
  }

  const trimmed = data.trim();

  // Try to parse as YAML (our primary format)
  const yamlResult = parseYAMLPayload(trimmed);
  if (yamlResult) {
    return yamlResult;
  }

  // Try to parse as JSON (fallback/alternative format)
  const jsonResult = parseJSONPayload(trimmed);
  if (jsonResult) {
    return jsonResult;
  }

  return null;
}

/**
 * Extract a YAML field value using regex.
 * Handles both quoted and unquoted values.
 */
function extractYAMLField(yaml: string, fieldPath: string): string | null {
  // Build regex pattern for the field
  // Handles: field: 'value', field: "value", field: value
  const patterns = [
    // Indented field with quotes: "  id: 'value'" or '  id: "value"'
    new RegExp(`^\\s*${fieldPath}:\\s*['"]([^'"]+)['"]`, "m"),
    // Indented field without quotes: "  id: value"
    new RegExp(`^\\s*${fieldPath}:\\s*([^\\n\\r'"]+)`, "m"),
  ];

  for (const pattern of patterns) {
    const match = yaml.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

/**
 * Parse YAML-formatted payload.
 */
function parseYAMLPayload(data: string): ParsedEventInfo | null {
  // Quick validation: must look like YAML (has colons and newlines)
  if (!data.includes(":") || !data.includes("\n")) {
    return null;
  }

  // Must have version marker or event section or short keys
  if (!data.includes("v:") && !data.includes("event:") && !data.includes("e:")) {
    return null;
  }

  // Extract required fields (support both long and short keys)
  const eventId = extractYAMLField(data, "id") || extractYAMLField(data, "e");
  const title = extractYAMLField(data, "title") || extractYAMLField(data, "t");
  const startTime =
    extractYAMLField(data, "start") ||
    extractYAMLField(data, "start_datetime") ||
    extractYAMLField(data, "s") ||
    "";

  // Validate required fields
  if (!eventId || !title) {
    return null;
  }

  // Validate eventId looks like a UUID
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidPattern.test(eventId)) {
    return null;
  }

  // Extract optional fields
  const promoterId = extractYAMLField(data, "promoterId") || extractYAMLField(data, "p");
  const shareId = extractYAMLField(data, "shareId") || extractYAMLField(data, "i");

  return {
    eventId,
    title,
    startTime,
    promoterId: promoterId || undefined,
    shareId: shareId || undefined,
    raw: data,
  };
}

/**
 * Parse JSON-formatted payload (fallback format).
 */
function parseJSONPayload(data: string): ParsedEventInfo | null {
  // Quick validation: must look like JSON
  if (!data.startsWith("{") || !data.endsWith("}")) {
    return null;
  }

  try {
    const parsed = JSON.parse(data);

    // Extract event info from various possible structures
    const event = parsed.event || parsed;
    const share = parsed.share || {};

    const eventId = event.id || event.eventId || event.e;
    const title = event.title || event.t;
    const startTime = event.start || event.start_datetime || event.s || "";

    // Validate required fields
    if (!eventId || !title) {
      return null;
    }

    // Validate eventId looks like a UUID
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(eventId)) {
      return null;
    }

    return {
      eventId,
      title,
      startTime,
      promoterId: share.promoterId || event.p || undefined,
      shareId: share.shareId || event.i || undefined,
      raw: data,
    };
  } catch {
    return null;
  }
}

/**
 * Format a start time for display.
 * Converts ISO string to a readable format.
 */
export function formatEventTime(isoString: string): string {
  if (!isoString) {
    return "Time TBD";
  }

  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "Time TBD";
    }

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "Time TBD";
  }
}
