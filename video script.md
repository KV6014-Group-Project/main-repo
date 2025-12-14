# Event Management App - Project Demo Video Script
**Duration: ~6 minutes**

---

## INTRO (0:00 - 0:30)

**[Show app welcome screen with rose logo]**

"Welcome to our Event Management App demo. This mobile application was built to help NGOs and community organisations solve four key challenges: **advertising events effectively**, **supporting attendance tracking**, **balancing supply and demand**, and **operating in low-resource settings**.

The app serves three distinct user roles: **Organisers** who create and manage events, **Promoters** who help spread the word in their communities, and **Participants** who attend events. Let me walk you through each role and show you exactly how we tackle these challenges."

---

## SECTION 1: PARTICIPANT EXPERIENCE (0:30 - 2:00)

**[Navigate to Auth screen → Continue as Participant]**

"Let's start with the Participant experience, as this is the most common user type.

### Registration
When a participant opens the app for the first time, they're greeted with a simple registration form. They enter their first name, last name, email, and phone number. **This addresses Challenge 2** - no account creation needed, just basic information, making it frictionless for community members with limited digital literacy. The app identifies them by their device, eliminating complex registration barriers.

**[Fill in participant details and continue]**

### Participant Dashboard
Once registered, participants see their profile with all their information and a list of events they've signed up for. Notice the connection status indicator at the top—this shows whether they're online or offline.

### Adding Events via QR Code
The key feature here is QR code scanning. Participants tap 'Add Event with QR' and scan a code shared by a promoter. 

**[Demonstrate QR scanning]**

What makes this special is the **offline-first architecture**. When a participant scans a QR code, the event is stored locally on their device immediately. They can see it in their events list with a 'Pending' status. When they regain internet connectivity, the app automatically syncs their registration to the server—the status changes to 'Registered'. **This solves Challenge 4** - QR codes work completely offline, perfect for rural areas with limited connectivity, while the sync system ensures no data is lost.

### Sync Functionality
If there are pending events, a sync button appears allowing manual sync. The app also shows exactly how many events are waiting to be synced. This syncing system ensures that even offline registrations eventually flow into the central system, giving organisers a complete picture of demand.

### Data Management
Participants can delete their device data at any time, which removes their profile and deregisters them from all events—giving them full control over their information."

---

## SECTION 2: PROMOTER EXPERIENCE (2:00 - 3:30)

**[Navigate back → Login as Promoter]**

"Now let's look at the Promoter role. Promoters are community leaders who help spread awareness about events. **This is where we solve Challenge 1 - Supporting Advertisement of Events.**

### Authentication
Promoters need an account. They can sign up with email and password, or log in if they already have one.

**[Log in as promoter]**

### Promoter Dashboard
The dashboard shows a personalised greeting and an impact summary—how many participants they've brought in and how many events they're promoting. Below that are their upcoming and recent events. This performance tracking allows organisers to see which promoters are most effective, helping them refine outreach strategies.

### Accepting Event Invitations
Promoters join events through invitation tokens from organisers. They tap 'Add Event', paste the token they received, and accept the invitation. This links them to that specific event.

**[Show accept invitation modal]**

### Event Details
Tapping an event shows full details: date, time, location, and description. Importantly, it shows how many people have registered through this promoter's link—their personal impact metric.

### QR Code Generation
The core promoter function is generating QR codes. They tap 'Generate QR Code' and the app creates a unique, digitally signed QR code for that event.

**[Generate a QR code]**

This QR code contains the event information and the promoter's ID embedded in it. When participants scan it, even offline, the registration is attributed back to this specific promoter. The promoter can show this QR code on their phone screen to community members, print it out, or share it however works best for their community. **This provides multi-channel reach** - QR codes work offline (posters, flyers, community centres) while links work online (social media, WhatsApp, SMS).

### Copy Link
Promoters can also copy event information to share via messaging apps, supporting both online and offline distribution channels."

---

## SECTION 3: ORGANISER EXPERIENCE (3:30 - 5:00)

**[Navigate back → Login as Organiser]**

"Finally, the Organiser role—the administrators who create and manage everything. **This is where we solve Challenge 3 - Balancing Supply and Demand.**

### Organiser Dashboard
After logging in, organisers see a comprehensive dashboard with a quick overview showing total events, published events, and drafts. They also see their upcoming and recent events at a glance.

### Creating Events
Tapping 'Create Event' opens a full event creation form:
- **Event title** and **description**
- **Start and end date/time**
- **Capacity** limit - this helps manage demand by setting registration caps
- **Location details**: venue name, room, and address
- **Event status**: Draft, Published, or Cancelled
- **Privacy toggle**: Public or private events

**[Fill in event creation form]**

All fields have validation—the app ensures dates are in the correct format, titles meet minimum length, and required fields are filled.

### Event Management
Once created, organisers can view full event details. From here they can:

**Update Event** - Edit any event details after creation, including capacity adjustments

**Delete Event** - Remove events with a confirmation prompt

### Inviting Promoters
The key organiser function is inviting promoters. They tap 'Generate Invitation Token' and receive a secure, time-limited token. This token can be copied and shared with promoters via any channel—email, messaging, even verbally.

**[Generate invitation token]**

The token expires after 7 days for security.

### Analytics Dashboard
Organisers have access to detailed analytics. The analytics screen shows:
- **Total participants signed up** across all events
- **Events created** count
- **Monthly charts** showing participants registered per month and events held per month

**[Show analytics screen with charts]**

For individual events, they can see:
- Total RSVPs, interested, and cancelled counts - **this provides real-time RSVP data** to help allocate resources
- Breakdown by source (QR code, link, offline sync)
- Performance by promoter—seeing which community leaders are most effective

**This analytics data helps organisers balance supply and demand:** if demand is too low, they can push promoters to intensify outreach; if demand is too high, they can cap registrations or adjust resources."

---

## SECTION 4: LOW RESOURCE SETTINGS SOLUTIONS (5:00 - 5:30)

**[Show offline QR code functionality]**

"Let me highlight how we specifically address **Challenge 4 - Supporting Advertisement in Low Resource Settings.**

### Offline-First Architecture
The entire participant experience works without internet connectivity. QR codes can be printed and distributed in rural areas where internet is scarce. Participants scan codes, register offline, and the app stores everything locally until connectivity is restored.

### Minimal Technology Requirements
Participants only need a basic phone with a camera—no smartphone required. Registration needs just name, email, and phone number, making it accessible for users with limited digital literacy.

### Promoter-Driven Outreach
Local promoters become the distribution network. They can physically share QR codes in community spaces—markets, religious centers, schools—reaching people who may not have internet access or social media accounts.

### Data Persistence
Even if a participant's phone dies or they lose connectivity for days, their registration data is safely stored locally and will sync when they return online. No data is lost.

### Resource-Efficient Design
The app uses minimal data and battery. QR codes are compact and load instantly. The sync process is efficient, working even on slow 2G connections.

This design ensures that even in the most remote areas, communities can participate in events and have their voices heard."

---

## SECTION 5: SECURITY FEATURES (5:30 - 5:45)

**[Show relevant screens while discussing]**

"Security was a priority throughout development. Here's how we protected the app:

### Authentication & Authorisation
- **Token-based authentication** using Django REST Framework tokens
- **Role-based permissions**—organisers can't access promoter endpoints and vice versa
- **Password validation** enforcing minimum length and complexity

### Data Protection
- **Ed25519 digital signatures** on all QR codes and invitation tokens. This cryptographic signing means QR codes cannot be forged or tampered with—the app verifies the signature before accepting any scanned data
- **Input sanitisation** on all forms preventing injection attacks
- **Django ORM exclusively**—no raw SQL queries, preventing SQL injection

### Rate Limiting & Abuse Prevention
- **API throttling**: Anonymous users limited to 100 requests per minute, authenticated users to 200
- **Request size limits** preventing payload abuse
- **CORS policy** restricting which origins can access the API

### Security Headers
- **XSS protection headers** enabled
- **Django Security Middleware** applying best-practice headers automatically

### Offline Security
Even offline QR scanning is secure—the digital signature is verified locally using the public key, ensuring only legitimate event data is accepted."

---

## CONCLUSION (5:45 - 6:00)

**[Return to welcome screen]**

"To summarise: we've built a comprehensive event management solution that directly addresses all four key challenges:

**Challenge 1 - Advertisement:** Our promoter system with multi-channel reach through QR codes and digital links
**Challenge 2 - Attendance:** Simple registration with offline RSVP and sync capabilities  
**Challenge 3 - Supply/Demand Balance:** Real-time analytics and capacity management tools
**Challenge 4 - Low Resource Settings:** Offline-first architecture that works without internet

The app serves three distinct user roles with tailored functionality, while the security measures ensure data integrity and user privacy. This is more than just an event app—it's a community engagement platform designed for the real-world constraints of NGOs and grassroots organisations.

Thank you for watching this demo."

---

# FEATURE CHECKLIST BY ROLE

## Participant Features
- [ ] Device-based registration (no account needed)
- [ ] Profile management (name, email, phone)
- [ ] QR code scanning to join events
- [ ] Offline event storage with pending/synced status
- [ ] Automatic sync when online
- [ ] Manual sync button
- [ ] Connection status indicator
- [ ] View registered events list
- [ ] Delete device data and deregister from all events

## Promoter Features
- [ ] Account registration and login
- [ ] Dashboard with impact metrics (participants, events, shares)
- [ ] Accept organiser invitation tokens
- [ ] View assigned events (upcoming and recent)
- [ ] View individual event details
- [ ] Generate unique QR codes for events
- [ ] Copy event link to clipboard
- [ ] Track registrations attributed to them
- [ ] Sign out

## Organiser Features
- [ ] Account registration and login
- [ ] Dashboard with event overview (total, published, drafts)
- [ ] Create new events with full details
- [ ] Edit existing events
- [ ] Delete events
- [ ] Set event status (draft, published, cancelled)
- [ ] Set event privacy (public/private)
- [ ] Generate promoter invitation tokens
- [ ] Copy invitation tokens
- [ ] View event statistics (RSVPs, interested, cancelled)
- [ ] View breakdown by source
- [ ] View breakdown by promoter
- [ ] Analytics dashboard with charts
- [ ] Monthly participant trends
- [ ] Monthly events held trends
- [ ] Sign out

## Security Features Implemented
- [x] Token-based authentication (DRF TokenAuthentication)
- [x] Role-based permissions (IsOrganiser, IsPromoter)
- [x] Ed25519 digital signatures on QR codes
- [x] Ed25519 digital signatures on invitation tokens
- [x] Signature verification (server and client-side)
- [x] Input validation on all forms
- [x] Django ORM only (SQL injection prevention)
- [x] API rate limiting (100/min anon, 200/min user)
- [x] Request size limits (2MB max)
- [x] CORS policy configuration
- [x] XSS protection headers
- [x] Django Security Middleware
- [x] Password validation rules
- [x] Token expiration (7 days for invitations)
