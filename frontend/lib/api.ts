import { getAuthToken, AuthUser, AuthRole } from "./AuthContext";

export type { AuthUser, AuthRole };

const fallbackApiBaseUrl = "http://localhost:8000/api";
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? fallbackApiBaseUrl;

type AuthResponse = {
  user: AuthUser;
  token: string;
};

// Paginated response structure from Django REST Framework
type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Skip ngrok interstitial page
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && typeof data === "object") {
      const messages: string[] = [];
      if (typeof (data as any).detail === "string") {
        messages.push((data as any).detail);
      }
      for (const key of Object.keys(data as any)) {
        const value = (data as any)[key];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (typeof item === "string") {
              messages.push(item);
            }
          }
        } else if (typeof value === "string") {
          messages.push(value);
        }
      }
      if (messages.length > 0) {
        throw new Error(messages.join("\n"));
      }
    }
    throw new Error(text || "Request failed");
  }

  return data as T;
}

export type Role = AuthRole;

export async function fetchRoles(): Promise<Role[]> {
  return request<Role[]>("/users/roles/");
}

async function getRoleIdByName(roleName: "organiser" | "promoter"): Promise<string> {
  const roles = await fetchRoles();
  const role = roles.find((r) => r.name === roleName);
  if (!role) {
    throw new Error(`Role '${roleName}' is not configured on the server`);
  }
  return role.id;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/users/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(params: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  roleName: "organiser" | "promoter";
}): Promise<AuthResponse> {
  const roleId = await getRoleIdByName(params.roleName);

  const body = {
    email: params.email,
    password: params.password,
    role: roleId,
    first_name: params.first_name ?? "",
    last_name: params.last_name ?? "",
    phone: params.phone ?? "",
  };

  return request<AuthResponse>("/users/register/", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function checkServerConnection(): Promise<boolean> {
  try {
    await request("/core/public-key/", { method: "GET" });
    return true;
  } catch (error) {
    return false;
  }
}

// ============ Event Types ============

export type EventStatus = {
  id: string;
  name: string;
  description: string;
};

export type EventLocation = {
  name: string;
  room: string;
  address: string;
};

export type Event = {
  id: string;
  organiser: AuthUser;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location: EventLocation;
  status: EventStatus;
  is_private: boolean;
  metadata: Record<string, unknown>;
  capacity: string;
  created_at: string;
  updated_at: string;
};

export type CreateEventParams = {
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  capacity: string;
  location: {
    name: string;
    room: string;
    address: string;
  };
  status: string;
  is_private?: boolean;
  metadata?: Record<string, unknown>;
};

export interface UpdateEventParams {
  title?: string;
  description?: string;
  start_datetime?: string;
  end_datetime?: string;
  capacity?: string;
  location?: {
    name?: string;
    room?: string;
    address?: string;
  };
  status?: string;
  is_private?: boolean;
}

export type InvitationResponse = {
  success: boolean;
  event_id: string;
  event_title: string;
  token: string;
  share_id: string;
  issued_at: string;
  expires_at: string;
  expires_in_days: number;
  share_url: string;
  targeted_to?: {
    promoter_id: string;
    email: string;
    name: string;
  };
};

export type QRShareResponse = {
  event_id: string;
  promoter_id: string;
  yaml: string;
  share_id: string;
};

export type AcceptInvitationResponse = {
  success: boolean;
  message: string;
  created: boolean;
  event: Event;
  link: {
    id: string;
    is_active: boolean;
    created_at: string;
  };
  share_id: string;
  was_targeted?: boolean;
};

// ============ Organiser Event APIs ============

export async function fetchEventStatuses(): Promise<EventStatus[]> {
  const response = await request<EventStatus[] | PaginatedResponse<EventStatus> | null>("/events/statuses/");

  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  return [];
}

export async function fetchOrganiserEvents(): Promise<Event[]> {
  const response = await request<Event[] | PaginatedResponse<Event> | null>("/events/");

  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  return [];
}

export async function fetchEvent(eventId: string): Promise<Event> {
  return request<Event>(`/events/${eventId}/`);
}

export async function createEvent(params: CreateEventParams): Promise<Event> {
  return request<Event>("/events/", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function updateEvent(eventId: string, params: UpdateEventParams): Promise<Event> {
  return request<Event>(`/events/${eventId}/`, {
    method: "PATCH",
    body: JSON.stringify(params),
  });
}

export async function deleteEvent(eventId: string): Promise<void> {
  return request<void>(`/events/${eventId}/`, {
    method: "DELETE",
  });
}

export async function generatePromoterInvitation(
  eventId: string,
  promoterId?: string
): Promise<InvitationResponse> {
  return request<InvitationResponse>(`/events/${eventId}/share/organiser/`, {
    method: "POST",
    body: JSON.stringify(promoterId ? { promoter_id: promoterId } : {}),
  });
}

// ============ Promoter Event APIs ============

export async function fetchPromoterEvents(): Promise<Event[]> {
  const response = await request<Event[] | PaginatedResponse<Event>>("/promoter/events/");
  return Array.isArray(response) ? response : response.results;
}

export async function fetchPromoterEvent(eventId: string): Promise<Event> {
  return request<Event>(`/promoter/events/${eventId}/`);
}

export async function acceptPromoterInvitation(token: string): Promise<AcceptInvitationResponse> {
  return request<AcceptInvitationResponse>("/promoter/accept/", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function generateParticipantQR(eventId: string): Promise<QRShareResponse> {
  return request<QRShareResponse>(`/promoter/events/${eventId}/share/participant/`, {
    method: "POST",
  });
}

// ============ Participant APIs (Device-based, no auth) ============

export type SyncEntry = {
  yaml: string;
  local_status: "scanned" | "rsvp" | "interested";
  scanned_at: number;
};

export type SyncEntryResult = {
  entry_index: number;
  success: boolean;
  event_id: string | null;
  rsvp_id: string | null;
  error: string | null;
};

export type SyncResponse = {
  device_id: string;
  entries: SyncEntryResult[];
  events: Event[];
};

/**
 * Sync participant events (pending QR scans) to the server.
 * No authentication required - uses device_id for identification.
 */
export async function syncParticipantEvents(
  deviceId: string,
  entries: SyncEntry[]
): Promise<SyncResponse> {
  const response = await fetch(`${API_BASE_URL}/participant/sync/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_id: deviceId,
      entries,
    }),
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && typeof data === "object" && "error" in data && typeof (data as any).error === "string") {
      throw new Error((data as any).error);
    }
    throw new Error(text || "Sync failed");
  }

  return data as SyncResponse;
}

/**
 * Fetch events associated with a device.
 * No authentication required - uses device_id for identification.
 */
export async function fetchParticipantEvents(deviceId: string): Promise<Event[]> {
  const response = await fetch(
    `${API_BASE_URL}/participant/events/?device_id=${encodeURIComponent(deviceId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (data && typeof data === "object" && "error" in data && typeof (data as any).error === "string") {
      throw new Error((data as any).error);
    }
    throw new Error(text || "Failed to fetch events");
  }

  return data as Event[];
}

