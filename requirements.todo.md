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
- [ ] Login/register screens
  - [ ] User registration forms
  - [ ] Login interface
  - [ ] Role selection
- [ ] Event creation and management
  - [ ] Event creation form
  - [ ] Event listing and details
  - [ ] Event editing interface
- [ ] Promoter management per event
  - [ ] Add/remove promoters
  - [ ] Promoter listing
  - [ ] Permission assignment
- [ ] Promoter management interface
  - [ ] Promoter dashboard
  - [ ] Assigned events view
  - [ ] Promoter tools

## Sharing & Distribution
- [ ] Token-based sharing system
  - [ ] Organiser to promoter tokens
  - [ ] Promoter to participant tokens
  - [ ] Token validation
- [ ] QR/YAML payload generation
  - [ ] YAML schema design
  - [ ] Digital signatures
  - [ ] Payload validation
- [ ] QR code generation and scanning
  - [ ] QR code creation
  - [ ] Camera integration
  - [ ] QR code parsing

## Participant Experience
- [ ] Offline participant sync *(backend sync + RSVP creation done; client-side offline storage/sync logic still pending)*
  - [ ] Offline data storage
  - [ ] Sync queue management
  - [ ] Conflict resolution
- [ ] Offline event storage
  - [ ] Local event cache
  - [ ] Offline RSVP tracking
  - [ ] Data persistence
- [ ] RSVP tracking and attribution
  - [ ] RSVP status management
  - [ ] Promoter attribution
  - [ ] RSVP analytics
- [ ] RSVP interface for participants
  - [ ] RSVP selection (attending/interested/cancelled)
  - [ ] Status updates
  - [ ] Confirmation flow
- [ ] Event discovery
  - [ ] Public event browsing
  - [ ] Search and filtering
  - [ ] Event details view

## Analytics & Admin
- [ ] Event statistics and reporting
  - [ ] RSVP counts by status
  - [ ] Promoter performance metrics
  - [ ] Event engagement analytics
- [ ] Statistics dashboard
  - [ ] Visual analytics
  - [ ] Real-time updates
  - [ ] Export functionality
- [ ] Admin interface
  - [ ] User management
  - [ ] Event oversight
  - [ ] System configuration
- [ ] Role-based navigation
  - [ ] Custom navigation per role
  - [ ] Permission-based UI
  - [ ] Role switching

## Polish & Integration
- [ ] Offline sync handling
  - [ ] Robust sync logic
  - [ ] Network detection
  - [ ] Sync status indicators
- [ ] Error states and loading
  - [ ] Loading indicators
  - [ ] Error messages
  - [ ] Recovery flows
- [ ] Environment setup
  - [ ] Development configuration
  - [ ] Production deployment
  - [ ] Environment variables
- [ ] Testing coverage
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] End-to-end testing
- [ ] Documentation
  - [ ] API documentation
  - [ ] User guides
  - [ ] Deployment instructions

## Security - Required by Alvin on 30/11/2025
**High Priority (Develop now)**

1. Enhanced endpoint protection
Developers must ensure that all staff and community leader endpoints require authentication and the correct role.
Participants and anonymous users must not be able to access these endpoints even with tools like Postman.

2. Input sanitisation and validation
Check all endpoints that accept user input (event creation, registration, RSVP).
Reject missing fields, enforce correct formats, and strip out unsafe data to prevent broken or harmful requests.

3. SQL injection prevention
Confirm all database operations use Django ORM only.
If any raw SQL is present, replace it with ORM queries or add parameterisation.

4. CSRF token validation
For any browser based staff screens, ensure Django’s CSRF protection remains active and that the frontend passes CSRF tokens correctly.

5. XSS protection headers
Make sure Django Security Middleware is enabled so important headers such as X Content Type Options and X XSS Protection are automatically applied.
Escape any user provided text if it is ever rendered into HTML.

6. Token or session expiry
Ensure login tokens or sessions expire after a reasonable time instead of lasting forever.
If using JWT, set an expiry. If using sessions, set a clear session duration.

7. Brute force and rate limiting
Add rate limiting on sensitive endpoints such as login and possibly RSVP.
Use DRF throttling or a simple lockout after repeated failures.

8. Audit logging
Log important staff actions such as event deletion, role changes or bulk RSVP operations.
Log who performed the action, what happened, and when.
Do not log passwords or full tokens.

**Medium Priority (Implement or document as future work)**

9. CORS policy enforcement
Restrict allowed frontend origins in production.
For now, include a simple list, but tighten this when deploying.

10. Request size limits
Set a maximum request size to prevent abuse of upload or large payload endpoints.

11. Security logging for access or region violations
If someone repeatedly hits a forbidden endpoint or attempts an RSVP from an invalid region, record a warning log entry.

12. Region based access control (future extension)
Store an “allowed region” field on events and plan to validate it later.
Developers can add basic placeholders now if time allows.

13. Geolocation integration
Advanced future recommendation.
Would use an IP to country lookup if the NGO deploys to cloud.
Not required to implement fully now.

14. Region validation middleware
Future work.
Would check user region before allowing certain routes.

**Lower Priority (Future roadmap for Log Task 4)**

15. User region profile management
Future enhancement where staff or leaders would have assigned regions.

16. Region filtered event discovery
Participants could see only events in their area.

17. Admin override for region rules
Senior staff could bypass restrictions if needed.

18. IP whitelisting for admin areas
Limit admin access to trusted networks in a real deployment.

19. API key authentication for sensitive endpoints
Future extension for internal integrations.

20. Request signature verification
Advanced security for external callbacks or webhooks.
Not needed for this coursework.

Short summary for developers

Please focus on
proper role protection on endpoints
input validation
no raw SQL
CSRF + security middleware
real token/session expiry
basic rate limiting
and audit logs for key actions
