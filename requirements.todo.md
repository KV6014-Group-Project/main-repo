# Event Management System — Todo List
When features are merged, keep this updated.

## Core Foundation
- [x] User authentication (Organiser/Promoter roles)
  - [x] Registration and login endpoints — implemented via `/api/users/register` and `/api/users/login`
  - [x] Token-based session management — DRF token issuance handled on register/login and `/logout` deletes tokens
  - [x] Role-based permissions — custom `Roles` model plus DRF permission classes (e.g. `IsOrganiser`, `IsPromoter`)
- [x] Device-based participant identification
  - [x] Device profile creation — `/api/participant/sync` auto-creates `DeviceProfile` records
  - [x] Anonymous participant tracking — RSVPs stored against `device_id` without requiring accounts
- [x] Event CRUD operations
  - [x] Create, read, update, delete events — organiser-scoped endpoints under `/api/events/`
  - [x] Event validation and constraints — serializer validation enforces title/venue rules and status/venue FK integrity
- [x] API endpoint configuration
  - [x] Base API structure — versioned routes under `/api/*` with per-app URL modules wired in `backend/urls.py`
  - [x] Response formatting — DRF serializers provide consistent JSON payloads
  - [x] Error handling — standardised HTTP status codes and serializer validation responses

## Basic UI & Management
- [x] Login/register screens
  - [x] User registration forms — `organiser-signup.tsx` and `promoter-signup.tsx`
  - [x] Login interface — `organiser-login.tsx` and `promoter-login.tsx`
  - [x] Role selection — separate auth flows for organiser vs promoter
- [x] Event creation and management
  - [x] Event creation form — `create-event.tsx` with title, dates, venue, capacity
  - [x] Event listing and details — `organiserdashboard.tsx` lists events, `organiserevent.tsx` shows details
  - [x] Event editing interface — `update-event.tsx` with full form for editing existing events
- [ ] Promoter management per event
  - [ ] Add/remove promoters — backend endpoints exist, UI pending
  - [ ] Promoter listing — backend `promoter_list` endpoint exists
  - [ ] Permission assignment
- [x] Promoter management interface
  - [x] Promoter dashboard — `promoter/index.tsx`
  - [x] Assigned events view — `fetchPromoterEvents()` API and events list
  - [x] Promoter tools — QR generation via `generate-qr.tsx`

## Sharing & Distribution
- [x] Token-based sharing system
  - [x] Organiser to promoter tokens — `create_organiser_invitation_token()` in `core/utils.py`
  - [x] Promoter to participant tokens — `promoter_share_participant` generates signed YAML
  - [x] Token validation — `parse_organiser_invitation_token()` with Ed25519 signature verification
- [x] QR/YAML payload generation
  - [x] YAML schema design — compact format with event ID, title, start, promoter, share ID
  - [x] Digital signatures — Ed25519 signing via `compute_signature()` and `verify_signature()`
  - [x] Payload validation — `verify_yaml_payload()` checks signature integrity
- [x] QR code generation and scanning
  - [x] QR code creation — `QRCodeDisplay.tsx` component
  - [x] Camera integration — `qr-scanner.tsx` with expo-camera
  - [x] QR code parsing — `offlineParser.ts` parses YAML/JSON payloads, stores in `ParticipantContext`

## Participant Experience
- [x] Offline participant sync — `ParticipantContext.tsx` handles full offline-first flow
  - [x] Offline data storage — AsyncStorage persistence via `LOCAL_EVENTS_KEY`
  - [x] Sync queue management — `syncEvents()` batches pending events to backend
  - [x] Conflict resolution — deduplication by eventId, status tracking (pending/synced/error)
- [x] Offline event storage — `ParticipantContext.tsx` with AsyncStorage
  - [x] Local event cache — `localEvents` state persisted to `LOCAL_EVENTS_KEY`
  - [x] Offline RSVP tracking — `LocalEvent` type tracks status, scannedAt, syncedAt
  - [x] Data persistence — AsyncStorage hydration on mount, auto-persist on change
- [x] RSVP tracking and attribution
  - [x] RSVP status management — RSVPStatuses FK (rsvp, interested, cancelled)
  - [x] Promoter attribution — RSVP model stores promoter FK from QR scan
  - [ ] RSVP analytics — frontend display pending
- [ ] RSVP interface for participants
  - [ ] RSVP selection (attending/interested/cancelled)
  - [ ] Status updates
  - [ ] Confirmation flow
- [ ] Event discovery
  - [ ] Public event browsing
  - [ ] Search and filtering
  - [ ] Event details view

## Analytics & Admin
- [x] Event statistics and reporting
  - [x] RSVP counts by status — `stats` endpoint returns total_rsvps, total_interested, total_cancelled
  - [x] Promoter performance metrics — `by_promoter` dict in stats response
  - [x] Event engagement analytics — `by_source` breakdown (qr, link, offline_sync)
- [x] Statistics dashboard
  - [x] Visual analytics — `organiser-analytics.tsx` with BarChart components
  - [x] Real-time updates — pull-to-refresh, data from `fetchEventStats()` API
  - [ ] Export functionality
- [ ] Admin interface
  - [ ] User management
  - [ ] Event oversight
  - [ ] System configuration
- [x] Role-based navigation
  - [x] Custom navigation per role
  - [x] Permission-based UI
  - [ ] Role switching

## Polish & Integration
- [x] Offline sync handling — `ParticipantContext.tsx` with full offline-first architecture
  - [x] Robust sync logic — `syncEvents()` with error handling, status tracking per entry
  - [x] Network detection — `checkServerConnection()` API, `isOnline` state, periodic checks
  - [x] Sync status indicators — connection dot in participant UI, `isSyncing` state, pending count badge
- [x] Error states and loading
  - [x] Loading indicators — ActivityIndicator in dashboard screens
  - [x] Error messages — error state handling with retry options
  - [x] Recovery flows — retry buttons on error states, pull-to-refresh throughout
- [ ] Environment setup
  - [x] Development configuration — `.env.example` for frontend, `settings.py` configured
  - [ ] Production deployment
  - [x] Environment variables — `EXPO_PUBLIC_API_BASE_URL` documented in `.env.example`
- [ ] Testing coverage
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] End-to-end testing
- [ ] Documentation
  - [x] API documentation — `ROUTES.md` with endpoint details
  - [ ] User guides
  - [ ] Deployment instructions

## Security 

### High Priority (Develop now)

- [x] Enhanced endpoint protection
  - Developers must ensure that all staff and community leader endpoints require authentication and the correct role.
  - Participants and anonymous users must not be able to access these endpoints even with tools like Postman.
- [x] Input sanitisation and validation
  - Check all endpoints that accept user input (event creation, registration, RSVP).
  - Reject missing fields, enforce correct formats, and strip out unsafe data to prevent broken or harmful requests.
- [x] SQL injection prevention
  - Confirm all database operations use Django ORM only.
  - If any raw SQL is present, replace it with ORM queries or add parameterisation.
- [ ] CSRF token validation
  - For any browser based staff screens, ensure Django's CSRF protection remains active and that the frontend passes CSRF tokens correctly.
  - Note: This may not matter for our mobile-first system using token auth.
- [x] XSS protection headers
  - Make sure Django Security Middleware is enabled so important headers such as X-Content-Type-Options and X-XSS-Protection are automatically applied.
  - Escape any user provided text if it is ever rendered into HTML.
- [ ] Token or session expiry
  - Ensure login tokens or sessions expire after a reasonable time instead of lasting forever.
  - If using JWT, set an expiry. If using sessions, set a clear session duration.
- [x] Brute force and rate limiting
  - Add rate limiting on sensitive endpoints such as login and possibly RSVP.
  - Use DRF throttling or a simple lockout after repeated failures.
- [ ] Audit logging (partial)
  - Log important staff actions such as event deletion, role changes or bulk RSVP operations.
  - Log who performed the action, what happened, and when.
  - Do not log passwords or full tokens.

### Medium Priority (Implement or document as future work)

- [x] CORS policy enforcement
  - Restrict allowed frontend origins in production.
  - For now, include a simple list, but tighten this when deploying.
- [x] Request size limits
  - Set a maximum request size to prevent abuse of upload or large payload endpoints.
- [ ] Security logging for access or region violations
  - If someone repeatedly hits a forbidden endpoint or attempts an RSVP from an invalid region, record a warning log entry.
- [ ] Region based access control (future extension)
  - Store an "allowed region" field on events and plan to validate it later.
  - Developers can add basic placeholders now if time allows.
- [ ] Geolocation integration
  - Advanced future recommendation.
  - Would use an IP to country lookup if the NGO deploys to cloud.
  - Not required to implement fully now.
- [ ] Region validation middleware
  - Future work.
  - Would check user region before allowing certain routes.

### Lower Priority (Future roadmap for Log Task 4)

- [ ] User region profile management
  - Future enhancement where staff or leaders would have assigned regions.
- [ ] Region filtered event discovery
  - Participants could see only events in their area.
- [ ] Admin override for region rules
  - Senior staff could bypass restrictions if needed.
- [ ] IP whitelisting for admin areas
  - Limit admin access to trusted networks in a real deployment.
- [ ] API key authentication for sensitive endpoints
  - Future extension for internal integrations.
- [ ] Request signature verification
  - Advanced security for external callbacks or webhooks.
  - Not needed for this coursework.
