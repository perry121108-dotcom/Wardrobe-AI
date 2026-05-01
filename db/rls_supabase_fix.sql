-- ============================================================
-- WARDROBE AI - Supabase RLS emergency fix
-- Fixes Supabase Advisor issue: rls_disabled_in_public
--
-- This project uses Express + pg + app-managed JWT auth.
-- Do not add broad anon/authenticated policies here; the mobile app
-- should access data through the Express API, not Supabase direct table APIs.
-- ============================================================

BEGIN;

-- User-owned/private data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_color_preferences ENABLE ROW LEVEL SECURITY;

-- Rule/reference tables
ALTER TABLE public.color_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasion_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.color_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_color_laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hue_material_sensitivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occasion_material_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silhouette_body_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silhouette_occasion_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.silhouette_combo_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_body_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_rules ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Verification query:
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
