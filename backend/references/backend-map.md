# Backend Architecture Map

**Project:** Event Management System  
**Framework:** Django 5.2.7  
**Python Version:** >=3.13  
**Database:** SQLite3  
**Generated:** November 10, 2025

---

## 📁 Project Structure

```
backend/
├── manage.py                    # Django management script
├── main.py                      # Standalone hello world script
├── db.sqlite3                   # SQLite database file
├── pyproject.toml              # Project dependencies & metadata
├── README.md                   # Django development guide
├── backend/                    # Main Django project configuration
│   ├── __init__.py
│   ├── settings.py             # Django settings & configuration
│   ├── urls.py                 # Root URL routing
│   ├── wsgi.py                 # WSGI server entry point
│   └── asgi.py                 # ASGI server entry point (async)
├── main_app/                   # Primary Django application (empty)
│   ├── __init__.py
│   ├── models.py               # Database models (empty)
│   ├── views.py                # Request handlers (empty)
│   ├── admin.py                # Admin panel config (empty)
│   ├── apps.py                 # App configuration
│   ├── tests.py                # Unit tests
│   └── migrations/
│       └── __init__.py
├── accounts/                   # User accounts app (structure only)
│   └── migrations/
└── references/                 # Documentation & guides
    └── unique-identifier.md    # Expo device ID implementation guide
```

---

## ⚙️ Configuration & Settings

### Django Settings (`backend/settings.py`)

**Security:**
- `DEBUG = True` ⚠️ (Development mode)
- Secret key is hardcoded (insecure for production)
- `ALLOWED_HOSTS = []` (empty - only localhost allowed)

**Installed Apps:**
```python
INSTALLED_APPS = [
    'django.contrib.admin',      # Admin interface
    'django.contrib.auth',       # Authentication
    'django.contrib.contenttypes',
    'django.contrib.sessions',   # Session management
    'django.contrib.messages',   # Flash messages
    'django.contrib.staticfiles', # Static file serving
]
```
⚠️ **Note:** `main_app` and `accounts` apps are NOT registered in `INSTALLED_APPS`

**Database:**
- SQLite3 database at `db.sqlite3`
- Default Django configuration

**Middleware Stack:**
- Security middleware
- Session middleware
- CSRF protection
- Authentication middleware
- Message middleware
- Clickjacking protection

**Authentication:**
- Using Django's default auth system
- Password validators enabled (similarity, minimum length, common passwords, numeric)

**Internationalization:**
- Language: English (en-us)
- Timezone: UTC
- i18n enabled

---

## 🌐 URL Routing

### Root URLs (`backend/urls.py`)

```python
urlpatterns = [
    path('admin/', admin.site.urls),  # Only admin panel configured
]
```

**Available Endpoints:**
- `/admin/` - Django admin interface

**Missing:**
- No API endpoints defined
- No custom app routes included
- No frontend integration routes

---

## 📦 Applications

### 1. `main_app` (Primary Application)

**Status:** ⚠️ Scaffolded but empty

**Components:**
- **Models** (`models.py`): No models defined
- **Views** (`views.py`): No views defined
- **Admin** (`admin.py`): No admin registrations
- **URLs**: No URL configuration file
- **Migrations**: Only initial `__init__.py`

**Issues:**
- Not registered in `INSTALLED_APPS`
- No functionality implemented

---

### 2. `accounts` (User Management)

**Status:** ⚠️ Directory structure only

**Contents:**
- `migrations/` directory (empty except cache)
- No Python files (no models, views, urls, etc.)

**Issues:**
- Not registered in `INSTALLED_APPS`
- No implementation files

---

## 🗄️ Database Schema

**Current State:** Empty (no custom models)

**Django Default Tables:**
- `auth_user` - User accounts
- `auth_group` - User groups
- `auth_permission` - Permissions
- `django_session` - Session data
- `django_admin_log` - Admin action logs
- `django_content_type` - Content types registry

**Custom Models:** None defined

---

## 📚 Dependencies

From `pyproject.toml`:

```toml
[project]
name = "backend"
version = "0.1.0"
requires-python = ">=3.13"
dependencies = [
    "django>=5.2.7",
]
```

**Installed Packages:**
- Django 5.2.7+

**Missing (for full functionality):**
- Django REST Framework (for API development)
- CORS headers package (for frontend integration)
- Authentication packages (JWT, OAuth, etc.)
- Database connectors (PostgreSQL, MySQL if needed)
- Testing frameworks (pytest-django)

---

## 🔑 Key Files

### `manage.py`
Standard Django management utility for:
- `runserver` - Start development server
- `migrate` - Apply database migrations
- `makemigrations` - Create migration files
- `createsuperuser` - Create admin user
- `shell` - Interactive Python shell

### `main.py`
Standalone script (not part of Django):
```python
def main():
    print("Hello from backend!")
```
Purpose unclear - may be leftover from initial setup.

---

## 📖 Documentation

### `README.md`
Comprehensive Django development guide covering:
- Models, Views, Templates, URLs
- Development workflow
- Running the server
- Admin panel usage
- Common tasks

### `references/unique-identifier.md`
Guide for implementing device UUID in Expo frontend:
- Using `expo-secure-store`
- UUID generation with `uuidv4`
- Persistent device identification

---

## ⚠️ Current Limitations & Missing Features

### Critical Issues:
1. **No API Endpoints** - Backend has no routes for frontend communication
2. **Apps Not Registered** - `main_app` and `accounts` not in `INSTALLED_APPS`
3. **No Models** - No data schema defined for events, users, etc.
4. **No Views/Controllers** - No business logic implemented
5. **No Authentication API** - No login/register endpoints
6. **No CORS Configuration** - Cannot accept requests from frontend
7. **No REST Framework** - No API serialization layer

### Security Issues:
1. Hardcoded secret key
2. Debug mode enabled
3. No environment variable configuration
4. Empty `ALLOWED_HOSTS`

### Missing Components:
- User authentication endpoints (register, login, logout)
- Event models (based on frontend `events.json`)
- Organiser/Participant/Promoter role system
- API for event CRUD operations
- File upload handling (for event images)
- Share link generation
- Session management API

---

## 🎯 Expected Features (Based on Frontend)

From frontend structure, backend should support:

### User Roles:
- Organisers
- Participants
- Promoters

### Event Management:
- Event CRUD operations
- Event discovery/listing
- Event registration
- Event sharing

### Authentication:
- Role-based registration
- Login/logout
- Session management
- Token-based auth (likely needed for mobile)

### Data Models Needed:
- User (with role field)
- Event (title, description, date, location, etc.)
- Registration/Attendance
- Promoter links
- Event sharing tokens

---

## 🚀 Next Steps for Development

### Immediate:
1. Register `main_app` in `INSTALLED_APPS`
2. Install Django REST Framework
3. Install django-cors-headers
4. Create User model with roles
5. Create Event model
6. Set up URL routing structure

### Short-term:
1. Implement authentication API
2. Create event CRUD endpoints
3. Add user role permissions
4. Configure CORS for frontend
5. Create serializers for API responses

### Long-term:
1. Move to PostgreSQL for production
2. Implement file uploads (S3/local)
3. Add email functionality
4. Implement sharing/referral system
5. Set up environment-based configuration
6. Add comprehensive testing
7. Deploy to production server

---

## 💡 Recommended Architecture

```
API Routes:
/api/auth/
    POST /register       # User registration
    POST /login          # User login
    POST /logout         # User logout
    GET  /profile        # Get user profile

/api/events/
    GET    /             # List all events
    POST   /             # Create event (organiser only)
    GET    /:id          # Get event details
    PUT    /:id          # Update event (organiser only)
    DELETE /:id          # Delete event (organiser only)
    POST   /:id/register # Register for event (participant)

/api/organiser/
    GET /events          # Organiser's events

/api/participant/
    GET /events          # Registered events

/api/promoter/
    GET /events          # Events to promote
    POST /share/:id      # Generate share link
```

---

**End of Backend Map**
