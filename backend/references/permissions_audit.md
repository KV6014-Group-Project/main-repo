# Permissions audit (quick scan)

This document is an automated, high-level scan of API views and whether they
declare explicit permission controls. The project defaults to `IsAuthenticated`
in `REST_FRAMEWORK` settings so views will require auth by default; controllers
that are intentionally public set `AllowAny`.

Summary (findings):

- `users.views` — several endpoints: login/register use `AllowAny` as expected; other user endpoints use `IsAuthenticated`.
- `sharing.views.RSVPView` — explicitly `AllowAny` (public RSVP link) — this view now enforces token checks and region checks.
- `events.views.EventViewSet` — sets `permission_classes = [IsAuthenticated, IsOrganiser]` and uses `IsOrganiserOfEvent` for sensitive actions.
- `events.promoter_views` — promoter endpoints use `IsAuthenticated, IsPromoter`.
- `participants.views` — some endpoints are `AllowAny` (device registration/lookup), review if these should be restricted.
- `core.views.BaseAPIView` — base class for APIViews; does not itself set permissions (relies on defaults).

Notes / recommended follow-ups:

- Scan each view that is `AllowAny` and confirm it is intentionally public (login, registration, RSVP, device registration). Add a comment above such views explaining why `AllowAny` is used.
- For endpoints that perform sensitive writes (user role changes, event deletes, CSV exports), ensure they use appropriate permission classes (organiser/staff/promoter) — the `events` app appears to have these protections.
- Consider adding unit tests that attempt unauthorized access to sensitive endpoints to ensure they return `403/401` as expected.

If you want, I can produce a more detailed per-file/per-endpoint CSV report listing each route (URL), view, and permission state. Reply with `detailed report` and I'll generate it.
