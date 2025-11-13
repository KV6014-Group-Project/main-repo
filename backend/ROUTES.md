# API Endpoints Documentation

## **1. Register User**

**Endpoint:**  
`POST /api/users/register/`  
*Ensure the trailing slash exists on POST requests.*

**JSON Input:**

Required:
```json
{
    "email": "test@gmail.com",
    "password": "ThisIsAStrongPassword123!",
    "role": "promoter" // organiser, promoter
}
```

Optional:
```json
{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "07912345678",
}
```

JSON Success Response (201)
```json
{
    "user": {
        "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
        "email": "test1@gmail.com",
        "role": "organiser", // organiser, promoter
        "first_name": "John",
        "last_name": "Doe",
        "phone": "07912345678",
        "date_joined": "2025-11-13T07:35:10.945262Z"
    },
    "token": "b0909b15bd3a6fb7c9d37f448512f12c05a783cb"
}
```

JSON Error Response (400)
```json
{
    "email": [
        "Email domain 'test.com' isn't supported. Please use a common provider."
    ],
    "password": [
        "Password must contain at least one special character."
    ],
    "role": [
        "\"test\" is not a valid choice."
    ]
}
```

## **2. Login User**

**Endpoint:**  
`POST /api/users/login/`  
*Ensure the trailing slash exists on POST requests.*

**JSON Input:**

Required:
```json
{
  "email": "test1@gmail.com",
  "password": "ThisIsAStrongPassword123!"
}
```

JSON Success Response (200):
```json
{
    "user": {
        "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
        "email": "test1@gmail.com",
        "role": "organiser",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "",
        "date_joined": "2025-11-13T07:35:10.945262Z"
    },
    "token": "b0909b15bd3a6fb7c9d37f448512f12c05a783cb"
}
```

JSON Error Response (401):
```json
{
    "error": "Invalid credentials"
}
```

## **3. View Profile**

**Endpoint:**  
`GET /api/users/profile`  
*pass in Authorization Token in header, the one you get from the login that you store in the frontend.*

**JSON Output:**

JSON Success Response (200):
```json
{
    "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
    "email": "test1@gmail.com",
    "role": "organiser",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "",
    "date_joined": "2025-11-13T07:35:10.945262Z"
}
```

JSON Error Response (403):
```json
{
    "detail": "Invalid token."
}
```

## **4. Register Event**

**Endpoint:**  
`POST /api/events/`

**JSON Input:**

Required:
```json
{
    "title": "This is a title",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
}
```

Optional:
```json
{
    "description": "This is a description",
    "location_venue": "The Crystal Str",
    "location_room": "14",
    "location_address": "ZX47PQ",
    "status": "draft", // draft, published, cancelled, completed
    "visibility": "public", // public, private
    "metadata": {
        "tags": ["screening", "medical check", "available"]
    }
}
```

JSON Success Response (201):
```json
{
    "id": "08cbd7b7-2007-41e5-b0cf-5087ce4b416b",
    "title": "This is a title",
    "description": "This is a description",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
    "location_venue": "The Crystal Str",
    "location_room": "14",
    "location_address": "ZX47PQ",
    "status": "draft",
    "visibility": "public",
    "metadata": {
        "tags": [
            "screening",
            "medical check",
            "available"
        ]
    }
}
```

JSON Error Response (400):
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

## **5. View Events**

**Endpoint:**  
`GET /api/events/`

**JSON Output:**

JSON Success Response (200):
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "08cbd7b7-2007-41e5-b0cf-5087ce4b416b",
            "organiser": {
                "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
                "email": "test1@gmail.com",
                "role": "organiser",
                "first_name": "John",
                "last_name": "Doe",
                "phone": "",
                "date_joined": "2025-11-13T07:35:10.945262Z"
            },
            "title": "This is a title",
            "description": "This is a description",
            "start_datetime": "2025-11-29T09:00:00Z",
            "end_datetime": "2025-11-30T18:00:00Z",
            "location_venue": "The Crystal Str",
            "location_room": "14",
            "location_address": "ZX47PQ",
            "location": {
                "venue": "The Crystal Str",
                "room": "14",
                "address": "ZX47PQ"
            },
            "status": "draft",
            "visibility": "public",
            "metadata": {
                "tags": [
                    "screening",
                    "medical check",
                    "available"
                ]
            },
            "created_at": "2025-11-13T11:44:18.075754Z",
            "updated_at": "2025-11-13T11:44:18.075764Z"
        },
        {
            "id": "3f3f1876-749c-4f36-b3a2-5da362395b42",
            "organiser": {
                "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
                "email": "test1@gmail.com",
                "role": "organiser",
                "first_name": "John",
                "last_name": "Doe",
                "phone": "",
                "date_joined": "2025-11-13T07:35:10.945262Z"
            },
            "title": "This is a title",
            "description": "This is a description",
            "start_datetime": "2025-11-29T09:00:00Z",
            "end_datetime": "2025-11-30T18:00:00Z",
            "location_venue": "The Crystal Str",
            "location_room": "14",
            "location_address": "ZX47PQ",
            "location": {
                "venue": "The Crystal Str",
                "room": "14",
                "address": "ZX47PQ"
            },
            "status": "draft",
            "visibility": "public",
            "metadata": {
                "tags": [
                    "screening",
                    "medical check",
                    "available"
                ]
            },
            "created_at": "2025-11-13T11:42:48.058374Z",
            "updated_at": "2025-11-13T11:42:48.058384Z"
        }
    ]
}
```

JSON Error Response (403):
```json
{
    "detail": "Invalid token."
}
```

## **5. View Events**

**Endpoint:**  
`GET /api/events/:id`

**JSON Output:**

JSON Success Response (200):
```json
{
    "id": "08cbd7b7-2007-41e5-b0cf-5087ce4b416b",
    "organiser": {
        "id": "587d15b5-ff06-42d9-9aed-18b849dcb3c2",
        "email": "test1@gmail.com",
        "role": "organiser",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "",
        "date_joined": "2025-11-13T07:35:10.945262Z"
    },
    "title": "This is a title",
    "description": "This is a description",
    "start_datetime": "2025-11-29T09:00:00Z",
    "end_datetime": "2025-11-30T18:00:00Z",
    "location_venue": "The Crystal Str",
    "location_room": "14",
    "location_address": "ZX47PQ",
    "location": {
        "venue": "The Crystal Str",
        "room": "14",
        "address": "ZX47PQ"
    },
    "status": "draft",
    "visibility": "public",
    "metadata": {
        "tags": [
            "screening",
            "medical check",
            "available"
        ]
    },
    "created_at": "2025-11-13T11:44:18.075754Z",
    "updated_at": "2025-11-13T11:44:18.075764Z"
}
```

JSON Error Response (404):
```json
{
    "detail": "Not found."
}
```