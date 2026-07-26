/*
# Fix Supabase security advisories

1. Functions
- `increment_post_views()` — SECURITY DEFINER trigger function.
  - Now sets a fixed `search_path = public` so it is not mutable by the caller
    (resolves "Function search path mutable" advisory).
  - EXECUTE privilege revoked from PUBLIC and from authenticated roles so the
    security-definer function cannot be invoked directly by any client
    (resolves "Public can execute security definer function" and
    "Signed-in can execute security definer function" advisories). The function
    is only ever fired by its trigger on `post_views`, which runs with definer
    privileges and does not require EXECUTE grants on the function itself.
2. Storage
- `scans` bucket changed from public to private (resolves "Public bucket allows
  listing" advisory). Authenticated users can still read scan photos via the
  existing `scans_read_all` SELECT policy on `storage.objects`, which is used by
  the community feed.
*/

-- 1a. Harden the trigger function: fixed search_path + restricted execute.
CREATE OR REPLACE FUNCTION increment_post_views()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE community_posts
  SET views = views + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION increment_post_views() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION increment_post_views() FROM authenticated;

-- 1b. Make the scans bucket private so anonymous users cannot list its objects.
UPDATE storage.buckets SET public = false WHERE id = 'scans';
