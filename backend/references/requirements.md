# Event Management System — Core Requirements

## 1. Summary
- Backend must support offline-first, token-based event sharing with three roles: Organiser, Promoter, Participant.

## 2. Roles & Authentication Requirements
- Provide user accounts for Organiser and Promoter with explicit roles.
- Participants are device-identified (device_id) and do not require an account.
- Authentication endpoints: register, login, logout, and retrieve current user.
- Authentication responses must return a session token for client use.

## 3. Event Management Requirements
- Event CRUD operations for organisers: create, retrieve, update, delete.
- Events must include canonical fields: id (UUID), title, description, start/end, location, visibility, metadata, timestamps.
- Promoter management per event: add, list, remove promoters.

## 4. Sharing & Token Requirements
- Generate organiser→promoter tokens and promoter→participant tokens.
- Tokens must include: scope, eventId, shareId, issuedAt, and optional promoterId.
- Support generating QR/YAML payloads containing an event snapshot, share metadata, and signature for offline use.

## 5. Offline & Sync Requirements
- Participants can scan QR/YAML offline and store entries locally for later sync.
- Sync endpoint must accept device_id and an array of entries (yaml or token), local_status, and scanned_at.
- Sync processing must: parse/validate entries, resolve canonical event, determine promoter attribution, upsert DeviceProfile, create or update RSVP records, and return per-entry status plus canonical event data for client reconciliation.

## 6. QR/YAML Schema & Validation Requirements
- QR/YAML payloads must contain: version, event snapshot (id, title, times, location, organiser id/name), share metadata (scope, eventId, shareId, promoterId, issuedAt, channel), and signature.
- Backend must parse and reject malformed YAML and ensure version support.
- Backend must verify signature integrity and confirm share.eventId exists and is active.
- If promoterId is present, backend must verify the promoter is assigned to the event.
- Client-provided event snapshot fields are only for offline display; authoritative data must come from canonical backend records.
- Invalid payloads must result in unattributed/invalid RSVP handling and structured error responses.

## 7. Participant Data & RSVP Requirements
- Persist DeviceProfile keyed by device_id with optional metadata (platform, app version).
- RSVP records must link event, device_profile (or user), optional promoter, status (rsvp|interested|cancelled), source (qr|link|offline_sync), and timestamps (scanned_at, created_at).
- Sync must use upsert semantics to avoid duplicate RSVPs and to update existing records correctly.

## 8. Statistics & Reporting Requirements
- Provide aggregated event statistics (e.g., RSVPs by promoterId, channel, status).
- Provide promoter-scoped statistics showing RSVPs attributed to a specific promoter.

## 9. Security & Hardening Requirements
- Ensure integrity protection for tokens and payloads (e.g., HMAC or equivalent).
- Support token expiry and replay-protection mechanisms.
- Apply rate limiting and input validation on sensitive endpoints.
- Return consistent, structured errors for authentication and validation failures.

## 10. API Contract Requirements
- Base API path: /api/.
- Authentication endpoints: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me.
- Organiser endpoints (authenticated): GET/POST /api/organiser/events, GET/PATCH/DELETE /api/organiser/events/{event_id}, promoter management endpoints, share token/qr issuance, event stats endpoint.
- Promoter endpoints (authenticated): GET /api/promoter/events, POST /api/promoter/accept (token), POST /api/promoter/events/{event_id}/share/participant, GET promoter event stats.
- Participant endpoints (device-based, no auth): POST /api/participant/sync, GET /api/participant/events.

## 11. Data Persistence Requirements
- Persist core entities: Users, DeviceProfiles, Events, PromoterProfiles, EventPromoter links, RSVPs, and optional persisted share tokens with necessary fields.
- Record auditing timestamps: created_at, updated_at, scanned_at, issued_at, last_used_at.

## 12. Testing & Admin Requirements
- Provide automated tests for core flows: authentication, event CRUD, token generation/validation, participant sync, RSVP attribution, and stats aggregation.
- Provide administrative interfaces to manage events, promoters, RSVPs, and share tokens.

## 13. Non-functional Requirements
- Support separate development and production data configurations.
- APIs must be resilient to malformed input and concurrent syncs.
- Sync responses must return canonical event data so clients can reconcile local snapshots.

End of requirements.