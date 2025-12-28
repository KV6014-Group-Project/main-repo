# API Endpoints Documentation

<!-- #region Signing Public Key -->
## **Signing Public Key**

<details>
<summary>GET /api/core/public-key/</summary>

**Description:** Get the Ed25519 public key for signature verification (used by frontend to verify YAML payloads offline).

**JSON Output:**

Status: 200:
```json
{
    "public_key": "base64url-encoded-public-key-here"
}
```
</details>
<!-- #endregion -->

<!-- #region User Routes -->
## **1. User Routes**

<details>
<summary>POST /api/users/register/</summary>

**Description:** Register a new user account.

**JSON Input (required):**
```json
{
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "role": "role-uuid"
}
```

**JSON Input (optional):**
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "07912345678"
}
```

**JSON Output (201 Created):**
```json
{
    "user": { ... },
    "token": "user-auth-token"
}
```

**JSON Output (400 Bad Request):**
```json
{
    "email": ["This field may not be blank."],
    "password": ["Password must be at least 8 characters long."],
    "role": ["Must be a valid UUID."]
}
```
</details>

<details>
<summary>POST /api/users/login/</summary>

**Description:** Login a user with email and password.

**JSON Input (required):**
```json
{
    "email": "user@example.com",
    "password": "StrongPassword123!"
}
```

**JSON Output (200 OK):**
```json
{
    "user": { ... },
    "token": "user-auth-token"
}
```

**JSON Output (401 Unauthorized):**
```json
{
    "error": "Invalid credentials"
}
```
</details>

<details>
<summary>POST /api/users/logout/</summary>

**Description:** Logout a user by deleting their authentication token.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```
</details>

<details>
<summary>GET /api/users/profile/</summary>

**Description:** Retrieve the currently authenticated user's profile.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "id": "user-uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "07912345678",
    "role": {
        "id": "role-uuid",
        "name": "organiser",
        "description": "The organisers for events."
    },
    "date_joined": "2025-11-28T12:34:56.789Z"
}
```
</details>

<details>
<summary>GET /api/users/roles/</summary>

**Description:** Get a list of all available user roles.

**JSON Output (200 OK):**
```json
[
    {
        "id": "role-uuid-1",
        "name": "organiser",
        "description": "The organisers for events."
    },
    {
        "id": "role-uuid-2",
        "name": "promoter",
        "description": "The promoters for events."
    }
]
```
</details>

<details>
<summary>DELETE /api/users/delete/</summary>

**Description:** Delete the authenticated user's account. Password is required.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Input:**
```json
{
    "password": "StrongPassword123!"
}
```

**JSON Output (200 OK):**
```json
{
    "message": "Account user@example.com has been permanently deleted"
}
```

**JSON Output (400/401 Bad Request):**
```json
{
    "error": "Password is required to delete account"
}
```
```json
{
    "error": "Incorrect password"
}
```
</details>
<!-- #endregion -->

<!-- #region Event Routes -->
## **2. Event Routes**

<details>
<summary>GET /api/events/</summary>

**Description:** List all events. Authenticated users see their own events; anonymous users see all public events.

**JSON Output (200 OK):**
```json
[
    {
        "id": "event-uuid",
        "title": "Event 1",
        "description": "...",
        "start_datetime": "...",
        "end_datetime": "...",
        "organiser": { ... },
        "status": { ... },
        "is_private": false
    }
]
```
</details>

<details>
<summary>POST /api/events/</summary>

**Description:** Create a new event. Organiser only.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Input (required):**
```json
{
    "title": "Event 1",
    "start_datetime": "...",
    "end_datetime": "...",
    "status": "status-uuid",
    "venue": {
        "name": "Venue Name",
        "room": "Room 1",
        "address": "123 Street"
    }
}
```

**JSON Input (optional):**
```json
{
    "description": "Event description",
    "is_private": false,
    "metadata": {}
}
```

**JSON Output (201 Created):**
```json
{
    "id": "event-uuid",
    "title": "Event 1",
    "organiser": { ... },
    "location": { ... },
    "status": { ... },
    "is_private": false
}
```
</details>

<details>
<summary>GET /api/events/:id/</summary>

**Description:** Retrieve a single event. Public events are visible to anyone; private events require authentication and ownership.

**Headers (private event):** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "id": "event-uuid",
    "title": "Event 1",
    "organiser": { ... },
    "status": { ... },
    "is_private": false
}
```

**JSON Output (403 Forbidden, private event):**
```json
{
    "error": "This event is private"
}
```
</details>

<details>
<summary>PUT /api/events/:id/</summary>
<summary>PATCH /api/events/:id/</summary>

**Description:** Update an event. Organiser only.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Input (partial update example):**
```json
{
    "title": "Updated Event Title",
    "is_private": true
}
```

**JSON Output (200 OK):**
```json
{
    "id": "event-uuid",
    "title": "Updated Event Title",
    "is_private": true,
    "organiser": { ... },
    "status": { ... }
}
```
</details>

<details>
<summary>DELETE /api/events/:id/</summary>

**Description:** Delete an event. Organiser only.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (204 No Content)**
```json
{}
```
</details>

<details>
<summary>GET /api/events/statuses/</summary>

**Description:** List all event statuses.

**JSON Output (200 OK):**
```json
[
    {"id": "status-uuid", "name": "draft", "description": "..."},
    {"id": "status-uuid", "name": "published", "description": "..."}
]
```
</details>

<details>
<summary>GET /api/events/:id/stats/</summary>

**Description:** Get event statistics (RSVP counts, by promoter, by source). Organiser only.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "total_rsvps": 10,
    "total_interested": 5,
    "total_cancelled": 2,
    "by_promoter": { "promoter@example.com": 4 },
    "by_source": { "email": 6, "social": 4 }
}
```
</details>

<details>
<summary>POST /api/events/:id/promoters/</summary>

**Description:** Add a promoter to an event.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Input:**
```json
{
    "promoter_id": "promoter-uuid"
}
```

**JSON Output (201 Created):**
```json
{
    "id": "event-promoter-uuid",
    "promoter": { ... },
    "event": { ... }
}
```
</details>

<details>
<summary>GET /api/events/:id/promoter_list/</summary>

**Description:** List active promoters for an event.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
[
    { "id": "promoter-uuid", "user": { ... } }
]
```
</details>

<details>
<summary>DELETE /api/events/:id/promoters/:promoter_id/</summary>

**Description:** Remove a promoter from an event.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "message": "Promoter has been removed from this event."
}
```
</details>

<details>
<summary>POST /api/events/:id/share/organiser/</summary>

**Description:** Generate organiser→promoter invitation token.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Input (optional):**
```json
{
    "promoter_id": "promoter-uuid"
}
```

**JSON Output (200 OK):**
```json
{
    "success": true,
    "event_id": "event-uuid",
    "token": "invitation-token",
    "share_id": "share-uuid"
}
```
</details>

<details>
<summary>POST /api/events/:id/share/qr/</summary>

**Description:** Generate QR code YAML payload for event (placeholder, Phase 2).

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (501 Not Implemented):**
```json
{
    "event_id": "event-uuid",
    "message": "QR code generation will be implemented in Phase 2"
}
```
</details>
<!-- #endregion -->

<!-- #region Promoter Event Routes -->
## **3. Promoter Event Routes**

<details>
<summary>GET /promoter/events/</summary>

**Description:** List events where the authenticated user is assigned as a promoter.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
[
    {
        "id": "event-uuid",
        "title": "Event 1",
        "description": "...",
        "start_datetime": "...",
        "end_datetime": "...",
        "organiser": { ... },
        "status": { ... },
        "is_private": false
    }
]
```
</details>

<details>
<summary>GET /promoter/events/:event_id/</summary>

**Description:** Retrieve a single event assigned to the authenticated promoter.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "id": "event-uuid",
    "title": "Event 1",
    "organiser": { ... },
    "status": { ... },
    "is_private": false
}
```

**JSON Output (403 Forbidden, not assigned):**
```json
{
    "error": "You are not assigned to this event"
}
```
</details>

<details>
<summary>POST /promoter/accept/</summary>

**Description:** Accept an organiser invitation token to join an event as a promoter.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Input:**
```json
{
    "token": "invitation-token"
}
```

**JSON Output (200 OK/201 Created):**
```json
{
    "success": true,
    "message": "Successfully joined event!",
    "created": true,
    "event": { ... },
    "link": { ... },
    "share_id": "share-uuid",
    "was_targeted": true
}
```
</details>

<details>
<summary>POST /promoter/events/:event_id/share/participant/</summary>

**Description:** Generate participant-facing share token / YAML payload for the promoter.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "event_id": "event-uuid",
    "promoter_id": "promoter-uuid",
    "yaml": "compact YAML payload",
    "share_id": "share-uuid"
}
```
</details>

<details>
<summary>GET /promoter/events/:event_id/stats/</summary>

**Description:** Get statistics for an event filtered to the promoter's attributed RSVPs.

**Headers:** Authorization: Token &lt;user-token&gt;

**JSON Output (200 OK):**
```json
{
    "total_rsvps": 10,
    "total_interested": 5,
    "total_cancelled": 2,
    "by_promoter": {},
    "by_source": { "email": 6, "social": 4 }
}
```
</details>
<!-- #endregion -->

<!-- #region Participant Routes -->
## **4. Participant Routes**

<details>
<summary>POST /api/participant/sync/</summary>

**Description:** Sync participant entries (YAML or token) and create/update RSVPs.

**JSON Input:**
```json
{
    "device_id": "device-uuid",
    "entries": [
        {
            "yaml": "compact YAML payload",
            "local_status": "rsvp",
            "scanned_at": 1700000000000
        }
    ]
}
```

**JSON Output (200 OK):**
```json
{
    "device_id": "device-uuid",
    "entries": [
        {
            "entry_index": 0,
            "success": true,
            "event_id": "event-uuid",
            "rsvp_id": "rsvp-uuid",
            "error": null
        }
    ],
    "events": [
        {
            "id": "event-uuid",
            "title": "Event 1",
            "start_datetime": "...",
            "end_datetime": "...",
            "organiser": { ... },
            "status": { ... },
            "is_private": false
        }
    ]
}
```
</details>

<details>
<summary>GET /api/participant/events/</summary>

**Description:** Retrieve all events associated with a given device_id.

**Query Parameters:**
```ini
device_id=&lt;device-uuid&gt;
```

**JSON Output (200 OK):**
```json
[
    {
        "id": "event-uuid",
        "title": "Event 1",
        "start_datetime": "...",
        "end_datetime": "...",
        "organiser": { ... },
        "status": { ... },
        "is_private": false
    }
]
```

**JSON Output (400/404):**
```json
{
    "error": "device_id parameter is required"
}
```
```json
{
    "error": "Device not found"
}
```
</details>

<details>
<summary>DELETE /api/participant/delete/</summary>

**Description:** Delete device profile and all associated RSVPs (deregistration).

**Query Parameters:**
```ini
device_id=&lt;device-uuid&gt;
```

**JSON Output (200 OK):**
```json
{
    "message": "Device data deleted successfully",
    "rsvps_deleted": 5
}
```

**JSON Output (400/200 if not found):**
```json
{
    "error": "device_id parameter is required"
}
```
```json
{
    "message": "Device not found, already deleted"
}
```
<details>
<!-- #endregion -->