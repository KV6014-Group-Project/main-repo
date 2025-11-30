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
- [ ] Region-based access control
  - [ ] Geographic location detection
  - [ ] Region validation middleware
  - [ ] IP-based geolocation service integration
  - [ ] Event-specific region restrictions
  - [ ] User region profile management
  - [ ] Region-based filtering for event discovery
  - [ ] Security logging for region violations
  - [ ] Admin override capabilities for region restrictions 
- [ ] Enhanced endpoint protection
  - [ ] Rate limiting per endpoint
  - [ ] API key authentication for sensitive operations
  - [ ] CORS policy enforcement
  - [ ] Request size limits
  - [ ] Input sanitization and validation
  - [ ] SQL injection prevention
  - [ ] XSS protection headers
  - [ ] CSRF token validation
  - [ ] JWT token expiration and refresh
  - [ ] IP whitelisting for admin endpoints
  - [ ] Request signature verification
  - [ ] Brute force protection
  - [ ] Audit logging for all API calls 
- 