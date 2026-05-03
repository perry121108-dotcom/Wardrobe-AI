# Render Production Fix Record

Status: fixed and verified on 2026-05-03.

Production URL:

```text
https://wardrobe-ai-pwa-v2.onrender.com
```

## What Was Fixed

The old Render service could serve part of the app, but database-backed endpoints were unreliable because the deployment and Supabase connection path were tangled with old environment settings.

The fix was to create a clean production path:

1. Create a fresh Supabase project.
2. Apply the WARDROBE AI core schema.
3. Seed reference tables.
4. Create a backend-only database role.
5. Verify Supabase session pooler connectivity with Node/pg.
6. Create a fresh Render web service.
7. Set production environment variables in Render.
8. Verify homepage, health checks, database connection, and metadata endpoints.

## Render Service

```text
name: wardrobe-ai-pwa-v2
url: https://wardrobe-ai-pwa-v2.onrender.com
branch: master
build: npm ci && cd mobile && npm ci && npm run build:web
start: npm start
health check: /api/test
```

## Verified Endpoints

```text
/                         200
/api/test                 200
/api/health/config        200
/api/health/db            200 database connected
/api/meta/seasons         200
/api/meta/occasions       200
/api/meta/materials       200
```

## Notes For Future Deploys

- Keep `DATABASE_URL`, `JWT_SECRET`, and `JWT_REFRESH_SECRET` only in Render environment variables.
- Do not commit database passwords or JWT secrets.
- Use the Supabase session pooler for Render instead of the direct database host.
- If the app is slow on first load, it is likely Render Free cold start. Open it 5-10 minutes before an interview demo.
