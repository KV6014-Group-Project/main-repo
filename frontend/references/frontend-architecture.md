# Frontend architecture notes

## Routing and auth

- Role and routing rules are centralized in [`frontend/app/_layout.tsx:60`](frontend/app/_layout.tsx:60) via:
  - `ROLE_CONFIG`
  - `getRedirectPath`
  - `AuthGuard` using a single `useEffect` to resolve redirects
- Behaviour:
  - Unauthenticated:
    - Allowed on `/welcome` and `/auth` routes
    - Any other route redirects to `/welcome`
  - Authenticated:
    - Visiting `/welcome` or `/auth*` redirects to the role home
    - `/`:
      - Participant stays on `/`
      - Organiser/promoter redirected to their dashboards
    - Role-specific segments:
      - Organiser: `/organiser*`
      - Promoter: `/promoter*`
      - Participant: `/` and neutral routes
    - Mis-matched role/segment redirects to the role home

This keeps auth/route rules declarative and testable instead of scattering conditional logic across screens.

## Layout and navigation

- Root layout:
  - Declared in [`frontend/app/_layout.tsx:120`](frontend/app/_layout.tsx:120)
  - Single `ThemeProvider` for navigation theme
  - `SessionProvider` wrapping the app
  - `RootLayoutContent`:
    - Shows a centered loading state while session is initializing
    - Renders the main `Stack` inside `AuthGuard`
  - `ThemeToggle` rendered in the header via `screenOptions.headerRight`

## Participant home

- Implemented in [`frontend/app/index.tsx:19`](frontend/app/index.tsx:19)
- Key behaviour:
  - Uses `ScreenLayout` with:
    - Title: "Your events"
    - Subtitle adapted based on whether there are active events
  - Primary CTA section:
    - Dominant "Scan event QR code" button
    - Secondary "Use event link instead" toggle
    - Link flow:
      - Accepts URL-like input
      - Disables submit until non-empty
      - Delegates parsing/handling to `handleSubmitLink`
  - States:
    - When the user has events:
      - Shows "Your active events" header
      - Renders `EventCard` list with check-in and leave hooks
    - When empty:
      - Shows a guided empty state:
        - What to do
        - Single CTA to scan QR
  - A subtle "Sign out" action as a ghost button at the bottom to avoid competing with core flows

## Buttons

- Implementation in [`frontend/components/ui/button.tsx:1`](frontend/components/ui/button.tsx:1)
- Features:
  - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
  - Sizes: `default`, `sm`, `lg`, `icon`
  - `loading` state:
    - `loading?: boolean` prop
    - Disables interaction when loading
    - Shares disabled styling
    - Shows an inline `ActivityIndicator` before children
  - `link` variant:
    - Zero/minimal chrome for textual actions
    - Underline on web, consistent tap target on native
- All components consuming buttons should rely on this shared behaviour for consistent UX.

## Semantic colors

- Defined in [`frontend/tailwind.config.js:40`](frontend/tailwind.config.js:40) under `theme.extend.colors`:
  - `role`:
    - `role.participant`: blue used for participant-focused accents
    - `role.organiser`: green for organiser surfaces
    - `role.promoter`: amber for promoter actions and labels
  - `event`:
    - `event.live`: green for live/ongoing events
    - `event.upcoming`: blue for scheduled events
    - `event.past`: neutral grey for completed events

Usage guidance:
- Prefer these semantic tokens over arbitrary hex values when styling:
  - Role labels/badges
  - Event status indicators
  - Contextual CTAs tied to a specific role or event state

## Event cards

- Implemented in [`frontend/components/events/EventCard.tsx:1`](frontend/components/events/EventCard.tsx:1)
- Responsibilities:
  - Display event metadata (date, time, location, attendees, description)
  - Provide hooks for:
    - `onCheckIn`
    - `onLeave`
    - `onShare`
    - `onViewDetails`
- Future alignment:
  - Use `role.*` and `event.*` colors for badges or labels:
    - Example:
      - Live badge using `bg-[color:var(--tw-event-live)]` via Tailwind/nativewind mapping
      - Participant/organiser/promoter tags tied to `role.*` tokens

## Principles

- Keep route and role logic centralized.
- Keep primary user flows visually obvious:
  - One primary CTA per key screen.
- Use semantic tokens instead of magic colors.
- Extend these patterns for organiser/promoter dashboards for consistency.