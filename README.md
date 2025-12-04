# Event Management App
### Overview
Built with React Native and Django REST Framework. This app allows users to create, manage, and RSVP to events. 

### Contribution
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Frameworks/Tools
### Frontend
- **React Native** – Mobile application for participant registration and community leader tracking.

### Backend
- **Django** – Handles authentication and API endpoints.

### Database
- **SQLite** – Lightweight relational database for storing RSVPs, events, and leader information.
## Django Backend

This product includes GeoLite2 data created by MaxMind, available from
https://www.maxmind.com

The backend is built using Django REST Framework. I would recommend using the UV package manager for managing dependencies and virtual environments.
to install UV, run the following command:
```
pip install uv
```

Then to update dependencies, use:
```
uv update
```

Then to run the development server, use:
```
uv run python manage.py runserver
```

