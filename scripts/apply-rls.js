const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const expectedTables = [
  'users',
  'clothing_items',
  'outfit_records',
  'color_rules',
  'color_seasons',
  'occasion_strategies',
  'color_combos',
  'trend_colors',
  'user_color_preferences',
  'material_types',
  'material_color_laws',
  'hue_material_sensitivity',
  'occasion_material_strategy',
  'silhouette_body_rules',
  'silhouette_occasion_rules',
  'silhouette_combo_rules',
  'material_body_rules',
  'pattern_rules',
];

const supabasePoolerRegions = [
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ca-central-1',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'sa-east-1',
  'us-east-1',
  'us-west-1',
  'us-west-2',
];

function parseSupabaseConnection(url) {
  const parsed = new URL(url);
  const match = parsed.hostname.match(/^db\.([a-z0-9]+)\.supabase\.co$/);
  if (!match) return null;

  return {
    ref: match[1],
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
  };
}

function createDirectClient() {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('supabase')
      ? { rejectUnauthorized: false }
      : false,
  });
}

function createPoolerClient(region, config) {
  return new Client({
    host: `aws-0-${region}.pooler.supabase.com`,
    port: 6543,
    user: `postgres.${config.ref}`,
    password: config.password,
    database: config.database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
}

async function connectClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is missing');
  }

  const directClient = createDirectClient();
  try {
    await directClient.connect();
    console.log('Connected with DATABASE_URL.');
    return directClient;
  } catch (err) {
    console.warn(`Direct connection failed: ${err.message}`);
    try {
      await directClient.end();
    } catch {}
  }

  const supabaseConfig = parseSupabaseConnection(process.env.DATABASE_URL);
  if (!supabaseConfig) {
    throw new Error('Direct connection failed and DATABASE_URL is not a Supabase direct URL');
  }

  for (const region of supabasePoolerRegions) {
    const poolerClient = createPoolerClient(region, supabaseConfig);
    try {
      await poolerClient.connect();
      console.log(`Connected with Supabase pooler region ${region}.`);
      return poolerClient;
    } catch (err) {
      console.warn(`Pooler ${region} failed: ${err.message}`);
      try {
        await poolerClient.end();
      } catch {}
    }
  }

  throw new Error('Unable to connect using DATABASE_URL or Supabase pooler fallbacks');
}

async function main() {
  const client = await connectClient();

  const sql = fs.readFileSync(
    path.join(__dirname, '..', 'db', 'rls_supabase_fix.sql'),
    'utf8'
  );
  await client.query(sql);

  const { rows } = await client.query(
    `SELECT tablename, rowsecurity
     FROM pg_tables
     WHERE schemaname = 'public'
       AND tablename = ANY($1::text[])
     ORDER BY tablename`,
    [expectedTables]
  );

  const missing = expectedTables.filter(
    (table) => !rows.some((row) => row.tablename === table)
  );
  const disabled = rows.filter((row) => !row.rowsecurity);

  console.table(rows);

  if (missing.length > 0) {
    throw new Error(`Missing expected tables: ${missing.join(', ')}`);
  }
  if (disabled.length > 0) {
    throw new Error(
      `RLS still disabled: ${disabled.map((row) => row.tablename).join(', ')}`
    );
  }

  await client.end();
  console.log('RLS enabled on all expected public tables.');
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
