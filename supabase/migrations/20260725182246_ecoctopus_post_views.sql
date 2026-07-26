/*
# Add post view tracking to community posts

1. New Tables
- `post_views` — tracks unique post views per user.
  - `id` (uuid, primary key)
  - `post_id` (uuid, references community_posts, cascade delete)
  - `user_id` (uuid, references auth.users, cascade delete)
  - `created_at` (timestamptz)
  - Unique constraint on (post_id, user_id) so each user counts once per post.
2. Modified Tables
- `community_posts` — add `views` integer column defaulting to 0.
3. Security
- Enable RLS on `post_views`.
- Authenticated users can insert their own view records.
- Anyone can read view counts (for display).
*/

ALTER TABLE community_posts
  ADD COLUMN IF NOT EXISTS views integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS post_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE post_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "insert_own_view" ON post_views;
CREATE POLICY "insert_own_view"
ON post_views FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "read_views" ON post_views;
CREATE POLICY "read_views"
ON post_views FOR SELECT
TO authenticated USING (true);
