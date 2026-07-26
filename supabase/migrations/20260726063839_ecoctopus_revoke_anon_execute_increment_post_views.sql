/*
# Fix "Public can execute security definer function" advisory

1. Functions
- `public.increment_post_views()` — SECURITY DEFINER trigger function.
  - The previous hardening migration revoked EXECUTE from PUBLIC and from the
    `authenticated` role, but an explicit EXECUTE grant to the `anon` role
    remained (visible in `pg_proc.proacl`). Because the frontend talks to
    Supabase with the anon key, every request runs as `anon`, so this grant
    meant unauthenticated callers could invoke the security-definer function
    directly — exactly the "Public can execute security definer function"
    advisory.
  - This migration revokes EXECUTE from `anon` (and re-revokes from PUBLIC
    and `authenticated` for idempotency). The function is only ever fired by
    its trigger on `post_views`, which runs with definer privileges and does
    not require EXECUTE grants on the function itself.
2. Security
- No table or column changes.
- No RLS policy changes.
- Only function EXECUTE privileges are tightened.
*/

REVOKE EXECUTE ON FUNCTION public.increment_post_views() FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_post_views() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_post_views() FROM authenticated;
