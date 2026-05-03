# WARDROBE AI Release Notes

## v1.1.0 - Production PWA Demo

Date: 2026-05-03

### Highlights

- Launched a fresh Render production service at `https://wardrobe-ai-pwa-v2.onrender.com`.
- Created and verified a fresh Supabase production database for the demo environment.
- Added a backend-only database role for server-side access through Supabase session pooler.
- Verified production homepage, health checks, database connectivity, and metadata endpoints.
- Updated mobile API configuration to target the new production Render URL.
- Updated README, mobile demo checklist, and infrastructure documentation for portfolio presentation.

### Verified Production Endpoints

```text
/                         200
/api/test                 200
/api/health/config        200
/api/health/db            200 database connected
/api/meta/seasons         200
/api/meta/occasions       200
/api/meta/materials       200
```

### Demo Guidance

The app can now be opened directly from a phone during interviews. Because the current Render service uses the Free plan, open the URL 5-10 minutes before a live demo to avoid cold-start delay.

## v1.0.0 - Portfolio Showcase Build

Date: 2026-05-01

### Highlights

- Repositioned WARDROBE AI as a phone-friendly PWA showcase instead of an APK-only demo.
- Added a Chinese GitHub README with product positioning, core features, architecture, and screenshots.
- Added showcase screenshots for outfit recommendation, cold-start color guidance, personal settings, and wardrobe state.
- Documented the recommendation engine around color season, occasion, season, and silhouette rules.
- Added backend and database readiness checks to make Render deployment issues easier to diagnose.
