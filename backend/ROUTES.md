# API Endpoints Documentation

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

## **1. User Routes**

<details>
<summary>GET /api/users/roles/</summary>

**Description:** Get all available user roles.

**JSON Output:**
```json
[
    {
        "id": "db8a2c13-e296-45bf-94c0-d44718812dba",
        "name": "organiser",
        "description": "The organisers for events."
    },
    {
        "id": "78b1d6c9-52ce-4819-9ca0-959be7e693d6",
        "name": "promoter",
        "description": "The promoters for events."
    }
]
```
</details>

<details>
<summary>POST /api/users/register/</summary>

**Description:** Register a new user account.

**JSON Input:**

Required:
```json
{
    "email": "test@gmail.com",
    "password": "ThisIsAStrongPassword123!",
    "role": "db8a2c13-e296-45bf-94c0-d44718812dba"
}
```

Optional:
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "07912345678"
}
```

**JSON Output:**

Status: 201:
```json
{
    "user": {
        "id": "0b21c840-42af-40f9-a6ab-8aaa385eb161",
        "email": "test@gmail.com",
        "role": {
            "id": "db8a2c13-e296-45bf-94c0-d44718812dba",
            "name": "organiser",
            "description": "The organisers for events."
        },
        "first_name": "John",
        "last_name": "Doe",
        "phone": "",
        "date_joined": "2025-11-21T09:56:34.393684Z"
    },
    "token": "6bedf24ae3ddb81565df1d99c04598551e6b54a3"
}
```

Status: 400:
```json
{
    "email": [
        "This field may not be blank."
    ],
    "password": [
        "Password must be at least 8 characters long."
    ],
    "role": [
        "Must be a valid UUID."
    ]
}
```
</details>

<details>
<summary>POST /api/users/login/</summary>

**Description:** Login with email and password.

**JSON Input:**

Required:
```json
{
    "email": "test@gmail.com",
    "password": "ThisIsAStrongPassword123!"
}
```

**JSON Output:**

Status: 200:
```json
{
    "user": {
        "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
        "email": "test1@gmail.com",
        "role": {
            "id": "db8a2c13-e296-45bf-94c0-d44718812dba",
            "name": "organiser",
            "description": "The organisers for events."
        },
        "first_name": "John",
        "last_name": "Doe",
        "phone": "",
        "date_joined": "2025-11-13T07:35:10.945262Z"
    },
    "token": "b0909b15bd3a6fb7c9d37f448512f12c05a783cb"
}
```

Status: 401:
```json
{
    "error": "Invalid credentials"
}
```
</details>

<details>
<summary>GET /api/users/profile/</summary>

**Description:** Get current user profile.

**Headers:** `Authorization: Token <your-token>`

**JSON Output:**

Status: 200:
```json
{
    "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
    "email": "test1@gmail.com",
    "role": {
        "id": "db8a2c13-e296-45bf-94c0-d44718812dba",
        "name": "organiser",
        "description": "The organisers for events."
    },
    "first_name": "John",
    "last_name": "Doe",
    "phone": "",
    "date_joined": "2025-11-13T07:35:10.945262Z"
}
```

Status: 403:
```json
{
    "detail": "Invalid token."
}
```
</details>

## **2. Events Routes**

<details>
<summary>GET /api/events/statuses/</summary>

**Description:** Get all event statuses (draft, published, cancelled, etc.).

**JSON Output:**

Status: 200:
```json
[
    {
        "id": "0932d594-96d5-44a6-9695-c74236a53381",
        "name": "draft",
        "description": "Event is in draft status"
    },
    {
        "id": "3dcfe1b8-0549-48b0-84e4-6680a03343f4",
        "name": "published",
        "description": "Event is live and visible"
    },
    {
        "id": "7a8d2e4f-1234-5678-abcd-ef1234567890",
        "name": "cancelled",
        "description": "Event has been cancelled"
    }
]
```
</details>

<details>
<summary>GET /api/events/</summary>

**Description:** List all public events (no authentication required).

**JSON Output:**

Status: 200:
```json
[
    {
        "id": "d8bca38a-8f7b-41a2-9686-4a9311a1f8ca",
        "organiser": {
            "id": "2df54594-b3dc-449d-b291-d7489693dd4e",
            "email": "test@gmail.com",
            "role": {
                "id": "62e356ba-a6b7-47da-b3dc-2a78be8560f9",
                "name": "organiser",
                "description": "The organisers for events."
            },
            "first_name": "",
            "last_name": "",
            "phone": "",
            "date_joined": "2025-11-25T04:09:49.657551Z"
        },
        "title": "Event 1",
        "description": "",
        "start_datetime": "2025-11-29T09:00:00Z",
        "end_datetime": "2025-11-30T18:00:00Z",
        "location": {
            "name": "Name 1",
            "room": "Room 1",
            "address": "Address 1"
        },
        "status": {
            "id": "3dcfe1b8-0549-48b0-84e4-6680a03343f4",
            "name": "published",
            "description": "Event is live and visible"
        },
        "is_private": false,
        "metadata": {},
        "created_at": "2025-11-25T04:53:34.960756Z",
        "updated_at": "2025-11-25T04:53:34.960767Z"
    }
]
```

Status: 200 (empty):
```json
[]
```
</details>

<details>
<summary>POST /api/events/create/</summary>

**Description:** Create a new event (organisers only).

**Headers:** `Authorization: Token <your-token>`

**JSON Input:**

Required:
```json
{
    "title": "Event 1",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
    "status": "3dcfe1b8-0549-48b0-84e4-6680a03343f4",
    "venue": {
        "name": "Convention Center",
        "room": "Main Hall",
        "address": "123 Main St"
    }
}
```

Optional:
```json
{
    "description": "Event description",
    "is_private": false,
    "metadata": {}
}
```

**JSON Output:**

Status: 201:
```json
{
    "id": "919b9feb-bf37-4aca-9813-7e22c09519cb",
    "organiser": {
        "id": "2df54594-b3dc-449d-b291-d7489693dd4e",
        "email": "test@gmail.com",
        "role": {
            "id": "62e356ba-a6b7-47da-b3dc-2a78be8560f9",
            "name": "organiser",
            "description": "The organisers for events."
        },
        "first_name": "",
        "last_name": "",
        "phone": "",
        "date_joined": "2025-11-25T04:09:49.657551Z"
    },
    "title": "Event 1",
    "description": "",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
    "location": {
        "name": "Convention Center",
        "room": "Main Hall",
        "address": "123 Main St"
    },
    "status": {
        "id": "3dcfe1b8-0549-48b0-84e4-6680a03343f4",
        "name": "published",
        "description": "Event is live and visible"
    },
    "is_private": false,
    "metadata": {},
    "created_at": "2025-11-25T05:46:36.658632Z",
    "updated_at": "2025-11-25T05:46:36.658642Z"
}
```

Status: 400:
```json
{
    "title": [
        "This field is required."
    ],
    "start_datetime": [
        "This field is required."
    ],
    "end_datetime": [
        "This field is required."
    ]
}
```
</details>

<details>
<summary>GET /api/events/:event_id/</summary>

**Description:** Get a single event by ID. Public events can be viewed by anyone. Private events require authentication and ownership.

**JSON Output:**

Status: 200:
```json
{
    "id": "919b9feb-bf37-4aca-9813-7e22c09519cb",
    "organiser": {
        "id": "2df54594-b3dc-449d-b291-d7489693dd4e",
        "email": "test@gmail.com",
        "role": {
            "id": "62e356ba-a6b7-47da-b3dc-2a78be8560f9",
            "name": "organiser",
            "description": "The organisers for events."
        },
        "first_name": "",
        "last_name": "",
        "phone": "",
        "date_joined": "2025-11-25T04:09:49.657551Z"
    },
    "title": "Event 2",
    "description": "",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
    "location": {
        "name": "Convention Center",
        "room": "Main Hall",
        "address": "123 Main St"
    },
    "status": {
        "id": "3dcfe1b8-0549-48b0-84e4-6680a03343f4",
        "name": "published",
        "description": "Event is live and visible"
    },
    "is_private": false,
    "metadata": {},
    "created_at": "2025-11-25T05:46:36.658632Z",
    "updated_at": "2025-11-25T05:46:36.658642Z"
}
```

Status: 403 (private event):
```json
{
    "error": "This event is private"
}
```

Status: 404:
```json
{
    "detail": "Not found."
}
```
</details>

<details>
<summary>PUT/PATCH /api/events/:event_id/update/</summary>

**Description:** Update an event (owner only). PUT for full update, PATCH for partial update.

**Headers:** `Authorization: Token <your-token>`

**JSON Input (partial update example):**
```json
{
    "title": "Updated Event Title",
    "is_private": true
}
```

**JSON Output:**

Status: 200:
```json
{
    "id": "919b9feb-bf37-4aca-9813-7e22c09519cb",
    "organiser": {...},
    "title": "Updated Event Title",
    "description": "",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
    "location": {...},
    "status": {...},
    "is_private": true,
    "metadata": {},
    "created_at": "2025-11-25T05:46:36.658632Z",
    "updated_at": "2025-11-25T07:30:12.123456Z"
}
```

Status: 400:
```json
{
    "title": [
        "Title must be at least 3 characters long!"
    ]
}
```

Status: 404 (not owner):
```json
{
    "detail": "Not found."
}
```
</details>

<details>
<summary>DELETE /api/events/:event_id/delete/</summary>

**Description:** Delete an event (owner only).

**Headers:** `Authorization: Token <your-token>`

**JSON Output:**

Status: 204 (no content)

Status: 404 (not owner):
```json
{
    "detail": "Not found."
}
```
</details>

## **3. Promoter Routes**

<details>
<summary>POST /api/events/:event_id/share/participant/</summary>

**Description:** Generate a signed YAML payload for participants to scan (promoters only, must be assigned to event).

**Headers:** `Authorization: Token <your-token>`

**JSON Output:**

Status: 200:
```json
{
    "event_id": "919b9feb-bf37-4aca-9813-7e22c09519cb",
    "promoter_id": "abc123-promoter-uuid",
    "yaml": "v: 1\nevent:\n  id: '919b9feb-bf37-4aca-9813-7e22c09519cb'\n  title: 'Event 1'\n  ...",
    "share_id": "def456-share-uuid"
}
```

Status: 403:
```json
{
    "error": "Promoter is not assigned to this event"
}
```
</details>