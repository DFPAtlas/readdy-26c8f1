-- ============================================================================
-- Synqoro Security 04 — Unsafe Database Privilege Lockdown
-- Versioned, reversible migration
-- ----------------------------------------------------------------------------
-- Purpose: Remove whole-table / schema-level privileges that bypass RLS:
--   TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
-- from the anon and authenticated roles on every table in the public schema.
--
-- Preserved (required for RLS-controlled app access):
--   SELECT, INSERT, UPDATE, DELETE
--
-- NOT changed: RLS enabled state, RLS policies, rows, table structures,
--              functions, triggers, auth users, service_role, storage,
--              edge functions.
--
-- PostgreSQL version: 17.x (MAINTAIN privilege is grantable since PG 16).
-- Object owner: postgres (all public tables).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Revoke unsafe privileges on every EXISTING table in the public schema.
-- ----------------------------------------------------------------------------
REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
  ON ALL TABLES IN SCHEMA public
  FROM anon, authenticated;

-- ----------------------------------------------------------------------------
-- 2. Update default privileges so FUTURE tables are not over-granted.
--    (Covers both table-owning roles with default privileges in public.)
-- ----------------------------------------------------------------------------
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLES
  FROM anon, authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLES
  FROM anon, authenticated;

-- ============================================================================
-- ROLLBACK (DO NOT RUN unless reverting this migration)
-- Restores the exact pre-change privilege state (arwdDxtm).
-- ----------------------------------------------------------------------------
-- GRANT TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
--   ON ALL TABLES IN SCHEMA public
--   TO anon, authenticated;
--
-- ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
--   GRANT TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLES
--   TO anon, authenticated;
--
-- ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public
--   GRANT TRUNCATE, REFERENCES, TRIGGER, MAINTAIN ON TABLES
--   TO anon, authenticated;
-- ============================================================================