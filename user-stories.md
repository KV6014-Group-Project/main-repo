
## User Roles Overview

- **Organiser (staff / NGO event organiser)**  
  Creates and manages events, assigns promoters, views impact.

- **Promoter (community leader / staff)**  
  Receives invitations from organisers, promotes events and shares QR codes with participants, views their impact.

- **Participant (community member on a device)**  
  Scans QR codes, registers interest/attendance, manages their participation history. Represented as a device profile, not a login account.

- **Anonymous / Device-based user**  
  Initial state of the app on a device before a participant profile is created. Device is identified and linked to RSVPs.

Implementation status uses:

- `[x] Implemented` — there is concrete backend + frontend support shipped.  
- `[~] Partially implemented` — some code exists but flows are incomplete or UI is missing.  
- `[ ] Not implemented` — planned only.

---

## Organiser User Stories

### O1 — Account Registration and Login

- **As an organiser**, I want to register an account with my email, password, and role so that I can securely access organiser features.
  - Acceptance criteria:
    - POST `/api/users/register/` accepts organiser role.
    - Frontend organiser signup screen allows entering email/password (and optional profile details).
    - On success, I am logged in with a token and taken to an organiser area.
  - Status: **[x] Implemented**  
    - Backend: `users` app routes for register/login, roles API.  
    - Frontend: `auth/organiser-signup.tsx`, `auth/organiser-login.tsx`, role-based navigation.

### O2 — View Organiser Dashboard

- **As an organiser**, I want to see a dashboard entry point so that I know where to manage my events.
  - Acceptance criteria:
    - After login, I can navigate to an organiser home/dashboard screen.
    - The screen is branded as “Organiser Dashboard” and links to event management views.
  - Status: **[x] Implemented**  
    - Frontend: `organiser/index.tsx`, `organiser/organiserdashboard.tsx`.

### O3 — Create Events

- **As an organiser**, I want to create new events with title, time, and venue details so that participants can attend.
  - Acceptance criteria:
    - Authenticated organiser can POST `/api/events/create/` with required fields.
    - Validation errors are surfaced if required fields are missing or invalid.
    - Frontend form allows entering title, dates, venue, and status.
  - Status: **[x] Implemented**  
    - Backend: `/api/events/create/` route in `events` app.  
    - Frontend: `organiser/create-event.tsx` referenced in `requirements.todo.md`.

### O4 — View Event List and Details

- **As an organiser**, I want to view a list of my events and tap into an event to see its details so that I can manage them.
  - Acceptance criteria:
    - Organiser can see their events in a dashboard view.
    - Tapping an event navigates to a detailed view with title, dates, status, venue, and stats summary.
  - Status: **[x] Implemented**  
    - Backend: `/api/events/` and `/api/events/:event_id/` routes.  
    - Frontend: `organiser/organiserdashboard.tsx`, `organiser/organiserevent.tsx`.

### O5 — Edit Existing Events

- **As an organiser**, I want to update an existing event’s details so that I can correct mistakes or change plans.
  - Acceptance criteria:
    - Authenticated organiser-owner can call `PUT/PATCH /api/events/:event_id/update/`.
    - Frontend provides an edit form pre-populated with existing data.
    - Changes are persisted and visible on reload.
  - Status: **[~] Partially implemented**  
    - Backend: Update endpoint is implemented and documented.  
    - Frontend: `organiser/update-event.tsx` exists but `requirements.todo.md` marks “Event editing interface — UI … pending / partial”.

### O6 — Delete Events

- **As an organiser**, I want to delete an event so that I can remove cancelled or invalid events.
  - Acceptance criteria:
    - Authenticated organiser-owner can call `DELETE /api/events/:event_id/delete/`.
    - Frontend offers a clear “Delete” action with confirmation.
    - Deleted event disappears from organiser dashboard and public listing.
  - Status: **[~] Partially implemented**  
    - Backend: Delete endpoint is implemented.  
    - Frontend: delete UX is not clearly called out in `requirements.todo.md` (likely minimal or missing dedicated UI).

### O7 — Manage Promoters for an Event

- **As an organiser**, I want to add/remove promoters for my events so that trusted people can promote them.
  - Acceptance criteria:
    - Organiser can generate invitation tokens for promoters for a specific event.
    - There is a UI for viewing assigned promoters per event.
    - Organiser can revoke/remove a promoter from an event.
  - Status: **[~] Partially implemented**  
    - Backend: Promoter endpoints and token generation exist (`create_organiser_invitation_token`, promoter assignment endpoints).  
    - Frontend: `requirements.todo.md` marks “Promoter management per event” as **[ ]** (UI pending).

### O8 — View Event Analytics / Impact

- **As an organiser**, I want to see statistics about RSVPs and promoter performance so that I can understand event impact.
  - Acceptance criteria:
    - Stats endpoint returns total RSVPs, breakdown by status, promoter, and source.
    - Organiser-facing dashboard visualises key metrics.
  - Status: **[~] Partially implemented**  
    - Backend: Stats endpoint implemented with `by_promoter` and `by_source`.  
    - Frontend: Some impact views (e.g. `organiser/impactorganiser.tsx`) likely exist, but full “Statistics dashboard” is **[ ]** in `requirements.todo.md`.

### O9 — Role-based Secure Access

- **As an organiser**, I want my views and endpoints to be accessible only to organiser accounts so that sensitive management actions are protected.
  - Acceptance criteria:
    - Endpoints that mutate events are guarded by organiser-only permissions.
    - Frontend navigation only shows organiser routes when logged in as organiser.
  - Status: **[x] Implemented**  
    - Backend: Custom `Roles` model and DRF permission classes (e.g. `IsOrganiser`).  
    - Frontend: Role-based navigation and auth flows present (`auth/index.tsx`, layout files).

---

## Promoter User Stories

### P1 — Account Registration and Login

- **As a promoter**, I want to register and log in with my email and a promoter role so that I can access assigned events.
  - Acceptance criteria:
    - Registration endpoint accepts promoter role.
    - Frontend promoter signup/login screens are available from the auth entry point.
  - Status: **[x] Implemented**  
    - Backend: Same `/api/users/register/` and `/api/users/login/` with promoter role.  
    - Frontend: `auth/promoter-signup.tsx`, `auth/promoter-login.tsx`.

### P2 — View Promoter Dashboard and Assigned Events

- **As a promoter**, I want to see all events I am assigned to so that I know what I’m promoting.
  - Acceptance criteria:
    - Authenticated promoter can load assigned events via API (e.g. `fetchPromoterEvents`).
    - Dashboard lists events with titles, dates, and locations.
    - Errors are handled gracefully with retry options.
  - Status: **[x] Implemented**  
    - Backend: Promoter events listing endpoint implemented.  
    - Frontend: `promoter/index.tsx` implements dashboard with loading, error, refresh.

### P3 — Accept Invitation from Organiser

- **As a promoter**, I want to accept an invitation token from an organiser so that I can be assigned to an event.
  - Acceptance criteria:
    - There is an API to accept an invitation token and link promoter to event.
    - Promoter dashboard provides a modal where I can paste the token.
    - On success, the new event appears in my event list.
  - Status: **[x] Implemented**  
    - Backend: Invitation acceptance endpoint exists in `events`/`core` apps.  
    - Frontend: `acceptPromoterInvitation()` in `lib/api.ts` and modal in `promoter/index.tsx`.

### P4 — Share Event with Participants via QR/YAML

- **As a promoter**, I want to generate a shareable QR code or YAML payload so that participants can quickly register their interest.
  - Acceptance criteria:
    - Endpoint `/api/events/:event_id/share/participant/` returns signed YAML payload and share ID.
    - Frontend screen allows promoter to generate a QR for a chosen event.
    - QR encodes the signed YAML payload; participants can scan it in their app.
  - Status: **[~] Partially implemented**  
    - Backend: `promoter_share_participant` and Ed25519 signing fully implemented.  
    - Frontend: `promoter/generate-qr.tsx` and `QRCodeDisplay.tsx` exist, but `requirements.todo.md` notes QR parsing/offline flows as incomplete.

### P5 — View Promoter Impact

- **As a promoter**, I want to see how many participants I have reached and how many RSVPs I have generated so that I can understand my effectiveness.
  - Acceptance criteria:
    - Stats endpoint exposes breakdown by promoter ID.
    - Promoter dashboard includes an “Impact” view summarising RSVPs attributed to me.
  - Status: **[~] Partially implemented**  
    - Backend: Stats include `by_promoter`.  
    - Frontend: `promoter/promoterimpact.tsx` exists, but full analytics dashboard is **[ ]** in `requirements.todo.md`.

### P6 — Secure Access to Promoter-only Actions

- **As a promoter**, I want only promoters assigned to an event to be able to generate participant payloads so that events remain protected.
  - Acceptance criteria:
    - `/api/events/:event_id/share/participant/` requires authenticated promoter who is assigned to the event.
    - Unassigned users receive a 403 error.
  - Status: **[x] Implemented**  
    - Backend: Permission logic and 403 responses documented in `ROUTES.md`.

---

## Participant User Stories

### PA1 — Device / Participant Profile Creation

- **As a participant**, I want the app to recognise my device and create a participant profile so that my RSVPs can be tracked without a traditional login.
  - Acceptance criteria:
    - On first use, the app creates a `DeviceProfile` via `/api/participant/sync` or similar endpoint.
    - Subsequent requests reuse the same device identifier.
    - Basic participant profile fields (name, email, phone) can be stored locally and/or remotely.
  - Status: **[x] Implemented**  
    - Backend: `DeviceProfile` auto-created in participant sync endpoint.  
    - Frontend: `ParticipantContext` manages profile and device state.

### PA2 — Scan Event QR Code

- **As a participant**, I want to scan a QR code from a promoter so that I can quickly add an event to my list.
  - Acceptance criteria:
    - Participant UI exposes a QR scanner screen from the participant home (`/participant/qr-code-page` using `qr-scanner.tsx`).
    - Camera permissions and UI affordances are clear and persistent controls (e.g. back button) are present.
    - Successful scan extracts a YAML payload and stores event info locally.
  - Status: **[~] Partially implemented**  
    - Frontend: `components/qr-scanner.tsx` and QR code page are implemented.  
    - Backend: YAML format and signature verification exist.  
    - `requirements.todo.md` marks “QR code parsing — client-side YAML parsing and offline storage” as **[ ]** (parsing and storage incomplete).

### PA3 — See My Events and Attendance Status

- **As a participant**, I want to view all events I have scanned or registered for so that I can remember where and when I’m attending.
  - Acceptance criteria:
    - Participant home merges locally stored events and server-confirmed events.
    - Each event shows title, time, and location.
    - Status badges show whether an event is pending sync, registered, or has an error.
  - Status: **[x] Implemented**  
    - Frontend: `participant/index.tsx` implements merged event list and `EventCard` with pending/synced/error states.  
    - Backend: RSVP and event APIs support this list.

### PA4 — Offline RSVP Storage and Sync

- **As a participant**, I want my RSVPs to be stored offline and synced when I’m online so that I don’t lose them in areas with poor connectivity.
  - Acceptance criteria:
    - When offline, scanned events and RSVP choices are queued locally.
    - When connectivity returns, I can trigger sync and see progress.
    - Conflicts are handled sensibly and surfaced in the UI.
  - Status: **[~] Partially implemented**  
    - Backend: Offline sync endpoints and RSVP creation logic exist.  
    - Frontend: `ParticipantContext` tracks `localEvents`, `serverEvents`, `isOnline`, `isSyncing`, and exposes `syncEvents()`.  
    - `requirements.todo.md` marks “Offline participant sync” and “Offline event storage” as **[ ]** (storage/sync/queue logic not fully complete).

### PA5 — Choose and Update RSVP Status

- **As a participant**, I want to choose whether I am attending, interested, or cancelling so that organisers have accurate RSVP data.
  - Acceptance criteria:
    - UI allows selecting RSVP status for each event (attending/interested/cancelled).
    - Status changes sync to server and are reflected in organiser analytics.
  - Status: **[ ] Not implemented (UI)**  
    - Backend: RSVP model and statuses exist (`RSVPStatuses` FK).  
    - Frontend: `requirements.todo.md` marks “RSVP interface for participants” and its sub-items as **[ ]** (no dedicated UI yet).

### PA6 — Event Discovery (Public Events)

- **As a participant**, I want to browse public events without a code so that I can find opportunities near me.
  - Acceptance criteria:
    - Public events list is available via `GET /api/events/`.
    - Participant UI provides a browsable list (search/filter optional) with details views.
  - Status: **[ ] Not implemented (UI)**  
    - Backend: Public events endpoint implemented.  
    - Frontend: `requirements.todo.md` marks “Event discovery” features as **[ ]`.

### PA7 — Manage My Participant Profile

- **As a participant**, I want to review and update my basic profile information stored on the device so that my RSVPs carry the right contact details.
  - Acceptance criteria:
    - Participant home shows my stored name, email, and optional phone.
    - There is a way to update these details and persist them across app launches.
  - Status: **[~] Partially implemented**  
    - Frontend: `participant/index.tsx` displays profile info from `ParticipantContext`.  
    - Editing flows/persistence are not fully described in `requirements.todo.md`.

### PA8 — Clear Participant Profile from Device

- **As a participant**, I want to clear my profile and event history from this device so that I can hand it to someone else.
  - Acceptance criteria:
    - There is a “Sign Out” / “Clear Profile” action.
    - Local profile and event data are removed.
    - App returns to a welcome / initial state.
  - Status: **[x] Implemented**  
    - Frontend: `clearProfile()` used in `participant/index.tsx`, sign-out button navigates to `/welcome`.

---

## Anonymous / Device-based User Stories

### D1 — First-time App Launch and Device Identification

- **As an anonymous device user**, I want the app to silently associate the device with a backend profile so that future RSVPs can be linked even if I never log in.
  - Acceptance criteria:
    - On first relevant interaction, the app calls a sync endpoint that creates a `DeviceProfile` (if none exists).
    - Device ID is stored securely on-device and reused.
  - Status: **[x] Implemented**  
    - Backend: `/api/participant/sync` auto-creates `DeviceProfile` records.  
    - Frontend: `ParticipantContext` and device helpers (`lib/device.ts`) manage IDs.

### D2 — Minimal Welcome and Role Selection

- **As a new user**, I want a simple role selection screen so that I can choose whether I’m an organiser, promoter, or participant.
  - Acceptance criteria:
    - Welcome screen explains the app roles briefly.
    - Tapping a role sends me into the relevant auth or participant flows.
  - Status: **[x] Implemented**  
    - Frontend: `welcome.tsx`, `auth/index.tsx`, app layouts and `BottomNav` provide role-based navigation.

---

## Cross-cutting / System Stories

### S1 — Role-based Navigation and Permissions

- **As the NGO**, I want the app to clearly separate organiser, promoter, and participant experiences so that each audience only sees what they need.
  - Acceptance criteria:
    - Backend enforces role-based access on sensitive endpoints.
    - Frontend navigation only reveals screens relevant to the logged-in role.
    - Participant experience is available without traditional auth.
  - Status: **[x] Implemented**  
    - Backend: Custom roles and permission classes, token auth.  
    - Frontend: Role-specific stacks (`organiser/`, `promoter/`, `participant/`) and auth flows.

### S2 — Offline-first Participant Experience

- **As the NGO**, I want the participant app to tolerate poor or no connectivity so that RSVPs can still be collected in the field.
  - Acceptance criteria:
    - Scanning QR codes and queuing RSVPs works offline.
    - Sync resumes automatically or via a clear manual action when online.
    - UI explains pending vs. synced vs. error states.
  - Status: **[~] Partially implemented**  
    - Backend: Sync endpoints and RSVP attribution implemented.  
    - Frontend: `ParticipantContext`, offline-aware UI (`ParticipantHome`) implemented, but offline storage, sync queue management, and conflict resolution are **[ ]** in `requirements.todo.md`.

### S3 — Analytics and Reporting

- **As the NGO**, I want consolidated analytics across events, promoters, and sources so that I can report impact and make decisions.
  - Acceptance criteria:
    - Stats endpoint returns aggregated metrics per event, per promoter, and per RSVP source.
    - UI dashboards for organisers and promoters present these metrics clearly.
  - Status: **[~] Partially implemented**  
    - Backend: Event statistics endpoints implemented.  
    - Frontend: Some impact views exist, but “Statistics dashboard” and richer analytics UX are **[ ]** in `requirements.todo.md`.

