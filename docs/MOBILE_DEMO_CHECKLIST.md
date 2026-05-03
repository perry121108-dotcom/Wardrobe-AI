# Mobile Demo Checklist

Production demo URL:

```text
https://wardrobe-ai-pwa-v2.onrender.com/
```

Production API base URL:

```text
https://wardrobe-ai-pwa-v2.onrender.com/api
```

## Pre-Interview Warmup

Render Free services can cold start after inactivity. Before an interview or live demo:

1. Open the production URL on the phone 5-10 minutes early.
2. Confirm the PWA loads.
3. Visit `/api/test` once if the page feels slow.
4. Keep the browser tab open before presenting.

## Verified Backend Checks

These endpoints were verified on 2026-05-03:

```text
https://wardrobe-ai-pwa-v2.onrender.com/api/test
https://wardrobe-ai-pwa-v2.onrender.com/api/health/config
https://wardrobe-ai-pwa-v2.onrender.com/api/health/db
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/seasons
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/occasions
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/materials
```

Expected result:

```text
/api/test                 200
/api/health/config        200
/api/health/db            200 database connected
/api/meta/seasons         200
/api/meta/occasions       200
/api/meta/materials       200
```

## Demo Flow

1. Open the production URL on a phone.
2. Show that the app is a PWA and does not require APK installation.
3. Enter the recommendation flow and show occasion / season selection.
4. Show the color-season and styling logic behind the recommendations.
5. Open personal settings to explain color season, skin tone, and body type.
6. Open wardrobe state to explain how uploaded wardrobe items can feed future recommendations.
7. Mention that the backend is connected to a fresh Supabase production database and verified through Render health endpoints.

## Current Production Infrastructure

- Render service: `wardrobe-ai-pwa-v2`
- Render URL: `https://wardrobe-ai-pwa-v2.onrender.com`
- Supabase project: `wardrobe-ai-prod-v2`
- Supabase project ref: `neoydhdvaealtsicwvzg`
- Database connection: Supabase session pooler
- GitHub branch: `master`
- Deployed commit verified: `883009d9ab92abe1657753a1716b94653cc81180`
