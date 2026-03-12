# Alpha Cricket Live

## Current State
Website has registration form (team name, captain name, phone, tournament). Backend stores all registrations. No way for admin to view them.

## Requested Changes (Diff)

### Add
- Admin Panel page accessible at `#admin` hash
- Password-protected login screen (password: alpha2025)
- Table showing all registered teams: Team Name, Captain Name, Phone Number, Tournament, sorted by tournament
- Logout button

### Modify
- App.tsx: detect `#admin` hash in URL, render AdminPanel instead of main site

### Remove
- Nothing

## Implementation Plan
1. Add AdminPanel component to App.tsx
2. Use `useGetAllRegistrationsByTournament` hook to fetch data
3. Simple password gate (hardcoded: alpha2025)
4. Table with registration data
5. Hash-based routing: if window.location.hash === '#admin', show admin panel
