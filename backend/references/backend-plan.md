Project: Event Management System
Scope: Offline-first, token-based event sharing with 3 roles (Organiser, Promoter, Participant)
Stack: Django 5.2.7, Django REST Framework, SQLite (dev) / PostgreSQL (prod), Expo Router frontend

This plan is aligned with the existing frontend implementation in [`frontend/app/_layout.tsx`](frontend/app/_layout.tsx:1), [`frontend/providers/SessionProvider.tsx`](frontend/providers/SessionProvider.tsx:1), hooks in [`frontend/hooks`](frontend/hooks/index.ts:1), and utilities in [`frontend/lib/shareLinks.ts`](frontend/lib/shareLinks.ts:1) and [`frontend/lib/eventStore.ts`](frontend/lib/eventStore.ts:1).

# Backend Plan

## Phased Implementation Plan

- [x] Phase 1: Backend foundations
  - [x] Create Django apps: users, events, participants , core, and optionally sharing
  - [x] Register these apps in INSTALLED_APPS.
  - [x] Add DRF and django-cors-headers to INSTALLED_APPS and configure.
  - [x] In users app: Implement custom User model with roles, auth endpoints (/api/auth/*), and PromoterProfile model.
  - [x] In events app: Implement Event model, EventPromoter model, RSVP model, event CRUD and share endpoints, stats endpoints.
  - [x] In participants app: Implement DeviceProfile model and participant sync endpoints (/api/participant/*).
  - [x] In core app: Implement shared utilities — HMAC signing/verification, YAML helpers, DRF permissions/serializers, and API base classes.
  - [x] (Optional) In sharing app: Token/YAML generation/storage and helpers, if you want separation of concerns.
- [ ] Phase 2: Core sharing flows
  - [x] In events app: Implement organiser event CRUD endpoints. (Completed in Phase 1)
  - [ ] In events app (or sharing): Implement organiser share endpoints for organiser tokens and YAML. (Placeholders exist, need full implementation)
  - [x] In events app: Implement promoter accept endpoint and promoter events listing. (Basic structure done, token validation needed)
  - [ ] In events app (or sharing): Implement promoter participant-share endpoint. (Placeholder exists, need full implementation)
- [x] Phase 3: Offline sync
  - [x] In participants app: Implement `/api/participant/sync` with YAML/token validation and RSVP creation (using core utilities). (YAML validation complete, token decoding TODO)
  - [x] In participants app: Implement `/api/participant/events` for device_id.
  - [x] In core app: Add HMAC signing/verification utilities. (Completed in Phase 1)
- [ ] Phase 4: Frontend integration
  - [ ] Update auth provider to use backend.
  - [ ] Update organiser/promoter/participant hooks to call new APIs.
  - [ ] Implement QR scanner and YAML parsing on frontend.
  - [ ] Implement local pending-sync queue.
- [ ] Phase 5: Hardening
  - [ ] Token expiry, replay protections, rate limiting.
  - [x] Admin views for events, promoters, RSVPs. (Completed in Phase 1)
  - [ ] Switch DB to PostgreSQL for production.
  - [ ] Add tests for all critical flows.

---

## Backend App Structure

To layout the backend better than using main_app and accounts, we propose the following Django app structure for better modularity and separation of concerns:

- **users**: 
  - Custom User model (with roles: organiser/promoter).
  - Authentication endpoints (/api/auth/*).
  - Promoter profile (PromoterProfile model).

- **events**:
  - Event model.
  - EventPromoter (many-to-many relationship).
  - Event share endpoints (e.g., /api/organiser/events/{id}/share/*, /api/promoter/*).
  - Stats endpoints (e.g., /api/organiser/events/{id}/stats).

- **participants** (or **devices**):
  - DeviceProfile model.
  - Participant sync endpoints (/api/participant/*, e.g., /api/participant/sync, /api/participant/events).

- **core** (or **common**):
  - Shared utilities: HMAC signing/verification, YAML helpers, DRF custom permissions and serializers, API base classes.

- **(Optional) sharing**:
  - Token and YAML generation/storage.
  - Related helpers, if you prefer separation of concerns from events app.

This structure distributes responsibilities: users for auth/profiles, events for business logic, participants for device interactions, core for reusables, and optional sharing for token management.

---

## 1. Roles and Access Model

### 1.1 Role Definitions

- Organiser:
  - Authenticated.
  - Can create/manage events.
  - Can add/remove promoters for their events.
  - Can generate event share tokens (QR/link) carrying event snapshot and organiser signature.
  - Can see RSVPs and promoter performance.

- Promoter:
  - Authenticated.
  - Cannot create events.
  - Can join events only through organiser-issued tokens.
  - Can generate participant-facing share tokens (QR/link) tied to them and the event.
  - Can see limited stats for their assigned events.

- Participant:
  - Does not need an account.
  - Identified primarily by device_id (from frontend, see unique-identifier guide).
  - Scans QR codes containing YAML event payloads and tokens.
  - Adds events offline, later synced as RSVP when online.
  - May be upgradable to a full account (future extension), but core flows remain device-based.

### 1.2 Representation in Backend

Use a custom User model in the users app with a role field to match frontend expectations in [`SessionProvider`](frontend/providers/SessionProvider.tsx:1):

- User (in users app):
  - id (UUID)
  - email
  - password
  - role: 'organiser' | 'promoter'
  - profile fields (optional): name, phone, etc.

Participants:

- Stored as DeviceProfile in the participants app:
  - device_id (string, unique)
  - optional metadata (platform, app version)
  - Possible link to User in future if you add participant accounts.

Authorization:

- Implement DRF custom permissions in the core app:
  - IsOrganiser, IsPromoter, IsOrganiserOfEvent, IsPromoterOfEvent, etc.
- Map URL namespaces to role guards similar to frontend route guards in [`_layout.tsx AuthGuard`](frontend/app/_layout.tsx:60).

---

## 2. Alignment with Current Frontend Architecture

The current frontend is a local-only simulation using:

- Static events in [`frontend/data/eventData.ts`](frontend/data/eventData.ts:1).
- Local `eventStore` in [`frontend/lib/eventStore.ts`](frontend/lib/eventStore.ts:1) to:
  - List organiser events.
  - Mock event creation (console output).
  - Track promoter assignments in storage.
- Token utilities in [`frontend/lib/shareLinks.ts`](frontend/lib/shareLinks.ts:1):
  - Base64url JSON tokens with:
    - scope: 'organiser' | 'participant'
    - eventId
    - issuedAt
    - shareId
    - optional promoterId
- Hooks:
  - [`useOrganiserEvents`](frontend/hooks/useOrganiserEvents.ts:1):
    - Creates events locally.
    - Issues organiser tokens (scope='organiser') for promoters.
  - [`usePromoterEvents`](frontend/hooks/usePromoterEvents.ts:1):
    - Accepts organiser tokens.
    - Stores assignments locally.
    - Issues participant tokens (scope='participant', promoterId set).
  - [`useParticipantEvents`](frontend/hooks/useParticipantEvents.ts:1):
    - Accepts participant tokens.
    - Validates against local events.
    - Marks "checked-in" in memory only.

Key observation:

- Frontend already models the organiser → promoter → participant flow via tokens.
- It lacks:
  - Backend persistence.
  - QR/YAML encoding.
  - Offline event sync and RSVP creation.
  - Real auth and role enforcement.

Our backend must:

- Preserve the share-link semantics (eventId, scope, promoterId, etc.).
- Extend them into:
  - Signed YAML payloads suited for offline.
  - Verifiable tokens and RSVP attribution upon sync.

---

## 3. Precise QR/YAML Schema and Validation

We standardize the offline QR payload so it integrates cleanly with existing token logic.

### 3.1 YAML Schema

Use a self-contained document with:

- version (v)
- event snapshot
- share token metadata (compatible with shareLinks semantics)
- signature for integrity

Example:

```yaml
v: 1
event:
  id: "uuid-of-event"
  title: "Event title"
  description: "Event description"
  start: "2025-11-10T18:00:00Z"
  end: "2025-11-10T21:00:00Z"
  location:
    venue: "Community Center"
    room: "Main Hall"
  organiser:
    id: "organiser-uuid"
    name: "Org Name"
share:
  scope: "participant"        # or organiser/participant for compatibility
  eventId: "uuid-of-event"
  shareId: "random-or-server-id"
  promoterId: "promoter-uuid-or-null"
  issuedAt: 1731252000000     # epoch ms
  channel: "qr"               # qr/link/poster
  sig: "base64url-hmac"
```

Notes:

- scope:
  - 'organiser': link from organiser to promoter.
  - 'participant': link/QR from organiser/promoter to participant.
- eventId is canonical backend UUID.
- promoterId:
  - Present and validated when attribution is needed.
  - Omitted for non-attributed links.

### 3.2 Signing and Validation

Signing:

- Use HMAC-SHA256 with server secret (from core app utilities).
- Sign the canonicalized YAML (or JSON) of:
  - v, event.id, share.scope, share.eventId, share.shareId, share.promoterId, share.issuedAt
- Exclude sig from the signed content.

Validation on backend (using core app YAML helpers and HMAC utilities):

1. Parse YAML; reject malformed.
2. Verify v is supported.
3. Recompute HMAC; compare with share.sig.
4. Verify:
   - share.eventId exists and is active.
   - If promoterId present:
     - That promoter is assigned to this event.
5. Do not trust:
   - title, description, times, etc. for mutation.
   - Only use them for offline display; canonical data comes from DB.

If invalid:

- Mark RSVP as unattributed or invalid.
- Return structured error to frontend.

This design smoothly extends the existing `shareLinks` JSON tokens into signed offline YAML payloads.

---

## 4. Backend API Contract (Aligned with Frontend)

We design endpoints that the existing hooks can migrate to with minimal changes.

Base URL: `/api/`

### 4.1 Authentication (in users app)

For organisers/promoters (maps to `SessionProvider` and `lib/auth`):

- POST `/api/auth/register`
  - Body: email, password, role: 'organiser' | 'promoter', profile fields.
  - Response: { user: { id, email, role }, token }

- POST `/api/auth/login`
  - Body: email, password
  - Response: { user, token }

- POST `/api/auth/logout`
  - Header: Authorization: Bearer token
  - Invalidates token.

- GET `/api/auth/me`
  - Header: Authorization
  - Returns current user and role.

Implementation:

- Use JWT or DRF TokenAuth.
- Frontend `SessionProvider` will be updated to call these instead of stubs in [`lib/auth.ts`](frontend/lib/auth.ts:1).

### 4.2 Organiser Endpoints (in events app)

All require organiser auth.

- GET `/api/organiser/events`
  - List events owned by organiser.

- POST `/api/organiser/events`
  - Create event.
  - Mirrors fields used in [`useOrganiserEvents.onCreate`](frontend/hooks/useOrganiserEvents.ts:32).

- GET `/api/organiser/events/{event_id}`
- PATCH `/api/organiser/events/{event_id}`
- DELETE `/api/organiser/events/{event_id}`

Promoter management:

- POST `/api/organiser/events/{event_id}/promoters`
  - Body: { promoter_id }
  - Creates EventPromoter link.

- GET `/api/organiser/events/{event_id}/promoters`
- DELETE `/api/organiser/events/{event_id}/promoters/{promoter_id}`

Share token / QR generation (using core or sharing utilities):

- POST `/api/organiser/events/{event_id}/share/organiser`
  - Creates an organiser→promoter token (scope='organiser') and returns:
    - jsonToken: base64url JSON
    - url: https://.../?t=...
  - Used instead of local `encodeOrganiserToken` in [`useOrganiserEvents.onIssuePromoterLink`](frontend/hooks/useOrganiserEvents.ts:59).

- POST `/api/organiser/events/{event_id}/share/qr`
  - Returns YAML payload (as above) plus:
    - qrPng or data for frontend to render QR.

Stats:

- GET `/api/organiser/events/{event_id}/stats`
  - Aggregates RSVPs by promoterId, channel, etc.

### 4.3 Promoter Endpoints (in events app)

All require promoter auth.

- GET `/api/promoter/events`
  - Returns events where promoter is linked (EventPromoter).

- POST `/api/promoter/accept`
  - Body: { token }
  - Flow:
    - Decode organiser token (scope='organiser').
    - Validate signature (server-side once tokens are signed, using core utilities).
    - Attach promoter to event (EventPromoter).
  - Replaces local logic in [`usePromoterEvents.onAcceptOrganiserLink`](frontend/hooks/usePromoterEvents.ts:28).

- POST `/api/promoter/events/{event_id}/share/participant`
  - Creates participant-facing token (scope='participant', includes promoterId).
  - Returns:
    - jsonToken
    - url
    - optional YAML payload for QR.
  - Replaces `encodeParticipantToken` usage in [`usePromoterEvents.onShareParticipantLink`](frontend/hooks/usePromoterEvents.ts:71).

- GET `/api/promoter/events/{event_id}/stats`
  - Returns RSVPs attributed to this promoter.

### 4.4 Participant / Device and Sync Endpoints (in participants app)

No auth; uses device_id.

- POST `/api/participant/sync`
  - Body:
    - device_id (from frontend secure ID)
    - entries: array of:
      - yaml: string (full scanned QR YAML) OR token: string
      - local_status: 'rsvp' | 'interested' | 'scanned'
      - scanned_at: epoch ms
  - Behavior:
    - For each entry:
      - Parse YAML or decode token (using core YAML helpers).
      - Validate signature (if present, using core HMAC).
      - Resolve event (from events app).
      - Resolve promoter attribution (if valid promoterId).
      - Upsert:
        - DeviceProfile for device_id (in participants app).
        - RSVP (in events app):
          - event, device_profile, optional promoter, status, source, timestamps.
    - Respond with:
      - per-entry status.
      - canonical event data (for client to update local snapshot).

- GET `/api/participant/events`
  - Query by device_id.
  - Returns events the device is associated with (RSVPed / scanned).

This endpoint set is the backbone of offline→online reconciliation for the existing `useParticipantEvents` hook.

---

## 5. Frontend Changes Needed (High-Level)

We design minimal deltas so another mode can implement them quickly.

1. Auth:
   - Update [`lib/auth.ts`](frontend/lib/auth.ts:1) to call `/api/auth/*`.
   - Ensure `SessionProvider` persists real tokens and roles.

2. Event store:
   - Replace static [`eventStore`](frontend/lib/eventStore.ts:1) usage with real API calls:
     - listOrganiserEvents → GET `/api/organiser/events`
     - createOrganiserEvent → POST `/api/organiser/events`
     - listEventsForPromoter → GET `/api/promoter/events`
     - getEventById → GET `/api/events/{id}`

3. Tokens:
   - Keep `shareLinks` helpers for compatibility in dev.
   - In production:
     - Tokens produced by backend.
     - Decoding/validation should not trust client-only logic for security decisions.

4. QR/YAML:
   - Implement QR scanning screen for participants:
     - On scan:
       - Parse YAML -> store locally (AsyncStorage).
       - Mark as pending sync.
   - On connectivity:
     - Call `/api/participant/sync` with locally stored entries.
     - Update local event list with server responses.

5. Hooks alignment:
   - [`useOrganiserEvents`](frontend/hooks/useOrganiserEvents.ts:1):
     - Use backend for event creation and share-link issuance.
   - [`usePromoterEvents`](frontend/hooks/usePromoterEvents.ts:1):
     - Use `/api/promoter/accept` and `/api/promoter/events`.
     - Use backend to generate participant links.
   - [`useParticipantEvents`](frontend/hooks/useParticipantEvents.ts:1):
     - Use QR scanner and link handling to:
       - Capture YAML/token.
       - Push to local store.
       - Trigger sync.

---

## 6. Backend Data Model Summary

Non-code outline for Django models:

- User (CustomUser in users app):
  - id (UUID)
  - email (unique)
  - password
  - role: CharField('organiser'|'promoter')
  - is_active, is_staff, etc.

- DeviceProfile (in participants app):
  - id (UUID)
  - device_id (unique)
  - created_at

- Event (in events app):
  - id (UUID)
  - organiser (FK User with role='organiser')
  - title, description
  - start_datetime, end_datetime
  - location_venue, location_room, location_address (or JSONField)
  - visibility, status
  - metadata (JSONField)
  - created_at, updated_at

- PromoterProfile (in users app):
  - id (UUID)
  - user (FK User, unique)
  - metadata (JSONField)

- EventPromoter (in events app):
  - id
  - event (FK Event)
  - promoter (FK PromoterProfile)
  - is_active
  - created_at

- RSVP (in events app):
  - id
  - event (FK Event)
  - device (FK DeviceProfile, nullable if upgraded)
  - user (FK User, nullable)
  - promoter (FK PromoterProfile, nullable)
  - status: 'rsvp' | 'interested' | 'cancelled'
  - source: 'qr' | 'link' | 'offline_sync'
  - scanned_at, created_at

- ShareToken (optional persisted, in sharing app or events app):
  - id
  - event (FK Event)
  - promoter (FK PromoterProfile, nullable)
  - scope: 'organiser' | 'participant'
  - share_id
  - channel
  - issued_at
  - expires_at (nullable)
  - payload_snapshot (JSONField/YAML text)
  - last_used_at

---

## 7. End-to-End Data Flow Overview

Textual lifecycle from organiser creation to participant sync:

1. Organiser (users app auth):
   - Creates event via `/api/organiser/events` (events app).
   - Backend returns event with id.

2. Organiser → Promoter:
   - Organiser calls `/api/organiser/events/{id}/share/organiser` (events app).
   - Backend issues organiser-token (scope='organiser'), optionally also YAML (using core utilities).
   - Promoter uses `/api/promoter/accept` (events app) with token.
   - Backend validates and links promoter to event (EventPromoter in events app).

3. Promoter → Participant:
   - Promoter calls `/api/promoter/events/{id}/share/participant` (events app).
   - Backend creates participant-token (scope='participant', promoterId set).
   - Optionally returns YAML for QR (using core utilities).

4. Participant offline:
   - Scans QR, gets YAML.
   - Frontend stores event snapshot + share info locally.

5. Participant online:
   - Frontend POSTs `/api/participant/sync` (participants app) with stored entries.
   - Backend validates signatures and relationships (using core utilities).
   - Backend creates RSVPs with optional promoter attribution (in events app).
   - Returns canonical event data to client.

6. Insights:
   - Organiser sees stats: `/api/organiser/events/{id}/stats` (events app).
   - Promoter sees their impact: `/api/promoter/events/{id}/stats` (events app).

---

## 8. Mermaid Overview

```