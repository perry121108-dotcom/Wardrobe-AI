# WARDROBE AI Fresh Infra Rebuild

Status: complete. Fresh Supabase database and fresh Render service are verified.

## New Supabase Database

Project:

```text
wardrobe-ai-prod-v2
```

Project ref:

```text
neoydhdvaealtsicwvzg
```

Region:

```text
ap-northeast-1
```

Verified schema:

```text
users
clothing_items
outfit_records
user_color_preferences
color_seasons
occasion_strategies
material_types
```

Seed data verified:

```text
color_seasons: 12
occasion_strategies: 10
material_types: 20
```

Security and access:

```text
RLS enabled on all public tables.
Backend role created: wardrobe_app_v2
Backend role login: enabled
Backend role BYPASSRLS: enabled
```

Connection verified with Node/pg through Supavisor session pooler:

```text
host: aws-1-ap-northeast-1.pooler.supabase.com
port: 5432
database: postgres
username: wardrobe_app_v2.neoydhdvaealtsicwvzg
```

The full `DATABASE_URL` is a server secret. Put it only in Render environment variables, never in frontend code or a public repo.

## Database Verification Completed

Verified from local Node/pg against the new Supabase pooler:

```json
{"crud":"ok","seasons":12,"occasions":10,"materials":20}
```

This check covered:

```text
connect to new pooler
read color_seasons
insert users
insert clothing_items
upsert user_color_preferences via ON CONFLICT
insert outfit_records
rollback test data
```

## New Render Web Service

Target service name:

```text
wardrobe-ai-pwa-v2
```

Production URL:

```text
https://wardrobe-ai-pwa-v2.onrender.com
```

GitHub repo:

```text
https://github.com/perry121108-dotcom/Wardrobe-AI
```

Branch:

```text
master
```

Runtime:

```text
Node
```

Build command:

```bash
npm ci && cd mobile && npm ci && npm run build:web
```

Start command:

```bash
npm start
```

Health check path:

```text
/api/test
```

Environment variables:

```text
NODE_ENV=production
DATABASE_URL=<new Supabase pooler connection string>
JWT_SECRET=<new random server secret>
JWT_REFRESH_SECRET=<new random refresh secret>
```

## Post-Deploy Verification

Verified endpoints:

```text
https://wardrobe-ai-pwa-v2.onrender.com/
https://wardrobe-ai-pwa-v2.onrender.com/api/test
https://wardrobe-ai-pwa-v2.onrender.com/api/health/config
https://wardrobe-ai-pwa-v2.onrender.com/api/health/db
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/seasons
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/occasions
https://wardrobe-ai-pwa-v2.onrender.com/api/meta/materials
```

Expected result:

```text
/ => 200
/api/test => 200
/api/health/config => 200
/api/health/db => 200, database connected
/api/meta/seasons => 200, 12 records
/api/meta/occasions => 200, 10 records
/api/meta/materials => 200, 20 records
```

## Final Verification

Render deployed commit:

```text
883009d9ab92abe1657753a1716b94653cc81180
```

Production database health:

```text
database: connected
databaseHost: aws-1-ap-northeast-1.pooler.supabase.com
databaseUser: wardrobe_app_v2.neoydhdvaealtsicwvzg
databaseName: postgres
```
