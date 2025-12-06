# USERS
POST   /api/users/register/

POST   /api/users/login/

POST   /api/users/logout/

DELETE /api/users/delete/

GET    /api/users/profile/

GET    /api/users/roles/

# EVENTS
POST   /api/events/

GET    /api/events/

GET    /api/events/:id/

PUT    /api/events/:id/

PATCH  /api/events/:id/

DELETE /api/events/:id/

GET    /api/events/:id/stats/

POST   /api/events/:id/promoters/

GET    /api/events/:id/promoter_list/

DELETE /api/events/:id/promoters/:promoter_id/

POST   /api/events/:id/share/organiser/

GET    /api/events/public/

GET    /api/events/statuses/

# PARTICIPANTS
GET    /api/participant/events/

POST   /api/participant/sync/