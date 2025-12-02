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
Priority- (HIghest-Lowest)
-Enhanced endpoint protection
Developers
Make sure sensitive endpoints for staff and community leaders all require authentication and the correct role. Participants and anonymous users must not be able to hit staff or organiser routes even if they use Postman.

Input sanitisation and validation
Developers
Check key endpoints such as event creation, registration and RSVP. Validate all required fields, reject missing or badly formatted data and strip out obviously dangerous input. This reduces basic injection and broken data issues.

SQL injection prevention
Developers
Confirm that all database access uses Django ORM only and that no raw SQL queries are used. If any raw SQL exists, parameterise it properly or replace with ORM queries.

CSRF token validation
Developers
For any browser based staff interface, keep Django CSRF protection turned on. Ensure that forms and frontend requests are sending CSRF tokens correctly where needed.

XSS protection headers
Developers
Ensure Django security middleware is enabled so that headers such as X Content Type Options and X XSS Protection are set. If any custom HTML rendering exists, escape user input properly.

JWT or token expiry
Developers
Whatever auth approach you use, confirm that tokens or sessions expire after a sensible period rather than lasting forever. If you use JWT, set an expiry. If you use session auth, make sure session age is reasonable.

Brute force protection and rate limiting on sensitive endpoints
Developers
At minimum, add rate limiting or throttling on login endpoints and maybe RSVP endpoints. This can be DRF throttling classes or a simple check to slow down repeated failed login attempts.

Audit logging for key actions
Developers
Add simple logging for important security actions such as event deletion, role changes and possibly bulk RSVP imports. Log who did it, what they did and when, without logging passwords or full tokens.

These give you plenty of concrete things to test and write about.

Medium priority good to mention or partially implement

You can ask devs to do lighter versions or treat some as design level for future work.

CORS policy enforcement
Developers
In settings, restrict allowed origins so that only your real frontend domains are allowed in production. For coursework this can be a simple list but still worth mentioning.

Request size limits
Developers
Set a sensible maximum request size if you have any upload or large payload endpoints. This can stay as a short note in settings or as a future recommendation if time is tight.

Security logging for region or access violations
Developers
If someone repeatedly hits a forbidden endpoint, or tries to use an RSVP from the wrong place, log it as a warning. Even if region logic is not fully built, you can log repeated forbidden access.

Region based access control and event specific region restrictions
Developers
You can keep this mainly as a future design. For example store an allowed country code on the event and plan to link it to geolocation later. If they have time, they can stub the field and add a simple check.

Geographic location detection and IP based geolocation service integration
Developers
This is more expensive and probably too heavy to fully build. You can describe it as future work. For instance using a basic IP to country lookup service for RSVP requests if the NGO moves to full cloud deployment.

Region validation middleware
Developers
Again more future focused. You can say that in a full system, middleware would check location before allowing RSVP traffic through, but you are not building this fully now.

Lower priority mostly future recommendations for Log Task 4

These are nice extras you can describe as future improvements if the NGO had more time and budget.

User region profile management
Future
Describe that staff and community leaders could have a region attribute so that they only manage events in their own area. You do not need to build this.

Region based filtering for event discovery
Future
Explain that participants could be shown only events for their local region if the app later had more discovery features. Not essential now.

Admin override capabilities for region restrictions
Future
Mention that in a real deployment, senior staff could override region checks to handle exceptional cases. Again this is design level.

IP whitelisting for admin endpoints
Future
This is heavy for your use case. You can keep it as a short note saying that in a real environment, admin tools could be restricted to particular office networks.

API key authentication for sensitive operations
Future
You can mention this if you later add internal APIs or integrations. For the current coursework, standard Django auth is enough.

Request signature verification
Future
This is advanced and not needed for your project. At most, mention it as a possible future control for protecting webhooks or external callbacks.
- 
