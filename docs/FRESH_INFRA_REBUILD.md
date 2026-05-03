# WARDROBE AI Fresh Infra Rebuild

Status: database verified, Render service creation pending Render MCP/API access.

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

After Render deploys, verify these endpoints:

```text
https://<new-render-url>/
https://<new-render-url>/api/test
https://<new-render-url>/api/health/config
https://<new-render-url>/api/health/db
https://<new-render-url>/api/meta/seasons
https://<new-render-url>/api/meta/occasions
https://<new-render-url>/api/meta/materials
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

## Current Tooling Limitation

Supabase MCP is authorized and working.

Render MCP is visible as a plugin, but service-management tools such as `list_services`, `create_service`, env var editing, and deploy triggering are not currently exposed in this Codex session. Render CLI is also not installed locally.

To let Codex create the Render service directly, configure Render MCP with a Render API key and restart Codex:

```bash
codex mcp add render --url https://mcp.render.com/mcp --bearer-token-env-var RENDER_API_KEY
```

Then set:

```bash
RENDER_API_KEY=<your Render API key>
```

Until Render MCP/API access is available, create the service in the Render Dashboard using the settings above.
