// Lightweight share-link token helpers (frontend-only)
// Encodes small JSON payloads into base64url strings and back

export type ShareScope = 'organiser' | 'participant';

export type BaseSharePayload = {
  scope: ShareScope;
  eventId: string;
  issuedAt: number; // epoch ms
  shareId: string; // random id
};

export type OrganiserSharePayload = BaseSharePayload & {
  scope: 'organiser';
};

export type ParticipantSharePayload = BaseSharePayload & {
  scope: 'participant';
  promoterId?: string;
};

function toBase64Url(input: string): string {
  if (typeof globalThis.btoa === 'function') {
    return globalThis
      .btoa(input)
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
  // Node / RN polyfill
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const b64 = Buffer.from(input, 'utf8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string): string {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '==='.slice((b64.length + 3) % 4);
  if (typeof globalThis.atob === 'function') {
    return globalThis.atob(padded);
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function encodeOrganiserToken(payload: Omit<OrganiserSharePayload, 'scope'>): string {
  const full: OrganiserSharePayload = { scope: 'organiser', ...payload };
  return toBase64Url(JSON.stringify(full));
}

export function decodeOrganiserToken(token: string): OrganiserSharePayload {
  const json = fromBase64Url(token);
  const data = JSON.parse(json) as OrganiserSharePayload;
  if (data.scope !== 'organiser') throw new Error('Invalid organiser token');
  if (!data.eventId) throw new Error('Missing eventId');
  return data;
}

export function encodeParticipantToken(payload: Omit<ParticipantSharePayload, 'scope'>): string {
  const full: ParticipantSharePayload = { scope: 'participant', ...payload };
  return toBase64Url(JSON.stringify(full));
}

export function decodeParticipantToken(token: string): ParticipantSharePayload {
  const json = fromBase64Url(token);
  const data = JSON.parse(json) as ParticipantSharePayload;
  if (data.scope !== 'participant') throw new Error('Invalid participant token');
  if (!data.eventId) throw new Error('Missing eventId');
  return data;
}

export function buildShareUrl(token: string): string {
  // Neutral https URL that carries the token in a query param
  // Real apps should use a domain and route handler
  return `https://link.local/?t=${token}`;
}

export function extractTokenFromUrl(input: string): string | null {
  try {
    const url = new URL(input);
    const t = url.searchParams.get('t') || url.searchParams.get('token');
    return t ?? null;
  } catch {
    // Not a URL, treat the whole input as raw token if it looks base64url-ish
    if (/^[A-Za-z0-9-_]+$/.test(input.trim())) return input.trim();
    return null;
  }
}


