# ROSE Event Management App

Offline-first mobile app for creating, managing, and checking in to events via QR codes. Tech stack: **React Native + Expo** frontend, **Django REST Framework** backend, **SQLite** storage.

---

## 1. Requirements
- Python 3.13+
- Node.js 18+
- Bun (recommended) or npm

---

## 2. Setup at a Glance

Backend quickstart:
1. `cd backend`
2. `pip install uv` (first run only)
3. `uv sync`
4. `uv run python manage.py makemigrations`
5. `uv run python manage.py migrate`
6. `uv run python manage.py runserver`

Frontend quickstart:
1. `cd frontend`
2. `bun install` (or `npm install`)
3. `bun run dev` (or `npm run dev`)

Ngrok for real devices: set `USE_NGROK=true` (and optionally `NGROK_AUTHTOKEN=...`) inside `backend/.env`. The custom `runserver` command will start a tunnel and write the public API URL into `frontend/.env.local`.

---

## 3. Test Accounts & Admin Access

- Promoter account: `promoter@gmail.com` / `Password12345`
- Organiser account: `organiser@gmail.com` / `Password12345`

Running migrations seeds these users and the default roles automatically.

Admin panel: `http://localhost:8000/admin/`.  
Create a superuser with `cd backend && uv run python manage.py createsuperuser`.

---

## 4. API Surface

- **Docs**: Swagger UI at `http://localhost:8000/api/docs/`, OpenAPI schema at `http://localhost:8000/api/schema/`.
- **Base paths**:
  - `/api/users/` – auth & profiles
  - `/api/events/` – event CRUD
  - `/api/organiser/`, `/api/promoter/`, `/api/participant/` – role-specific operations
  - `/api/core/` – shared utilities (e.g., signing key)

---

## 5. Environment Reference

- `USE_NGROK`: enables the ngrok tunnel integration (defaults to `false`).
- `NGROK_AUTHTOKEN`: optional token for longer ngrok sessions and custom domains.

GeoIP-based filtering allows only Malaysia (`'MY'`) by default. Edit `ALLOWED_COUNTRIES` in `backend/backend/settings.py` to permit other regions, e.g. `['MY', 'SG', 'US']`.

---

## 6. Dependency Snapshot

Backend stack:
- django ≥ 5.2.7
- djangorestframework ≥ 3.15.0
- django-cors-headers ≥ 4.3.0
- django-environ ≥ 0.11.0
- drf-spectacular ≥ 0.29.0
- geoip2 ≥ 5.2.0
- pyngrok ≥ 7.5.0
- cryptography ≥ 42.0.0
- pyyaml ≥ 6.0.1

Frontend stack:
- expo ~54.0
- react 19.1.0
- react-native 0.81.5
- expo-router ~6.0
- expo-camera ~17.0
- nativewind ^4.1
- react-native-qrcode-svg ^6.3
- react-native-reanimated ~4.1

---

## 7. Attribution

Includes GeoLite2 data created by MaxMind, available from [maxmind.com](https://www.maxmind.com).