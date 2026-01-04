# Event Management App

A mobile application for creating, managing, and RSVPing to events with a focus on Offline-first and QR code based attendance tracking. Built with **React Native (Expo)** and **Django REST Framework**.

## Tech Stack

| Layer    | Technology                     |
|----------|-------------------------------|
| Frontend | React Native, Expo, NativeWind |
| Backend  | Django, Django REST Framework  |
| Database | SQLite                         |

## Prerequisites

- **Python** 3.13+
- **Node.js** 18+
- **Bun** (recommended) or npm

## Getting Started

### Backend

```bash
cd backend

# Install UV package manager (if not installed)
pip install uv

# Install dependencies
uv sync

# Run development server
uv run python manage.py runserver
```

> **Mobile Development & ngrok**: The backend includes an integrated ngrok tunnel to make your local API accessible to physical mobile devices. 
> To enable it:
> 1. Set `USE_NGROK=true` in your `backend/.env` file.
> 2. (Optional) Add your `NGROK_AUTHTOKEN=` for longer sessions and custom domains.
> 3. Running `manage.py runserver` will automatically start the tunnel and update your frontend's environment configuration.


### Frontend

```bash
cd frontend

# Install dependencies
bun install  # or: npm install

# Start Expo development server
bun run dev  # or: npm run dev
```

## Dependencies

### Backend (Python)
- django >= 5.2.7
- djangorestframework >= 3.15.0
- django-cors-headers >= 4.3.0
- django-environ >= 0.11.0
- drf-spectacular >= 0.29.0
- geoip2 >= 5.2.0
- pyngrok >= 7.5.0
- cryptography >= 42.0.0
- pyyaml >= 6.0.1

### Frontend (Node.js)
- expo ~54.0
- react 19.1.0
- react-native 0.81.5
- expo-router ~6.0
- expo-camera ~17.0
- nativewind ^4.1
- react-native-qrcode-svg ^6.3
- react-native-reanimated ~4.1

## Attribution

This product includes GeoLite2 data created by MaxMind, available from [maxmind.com](https://www.maxmind.com).