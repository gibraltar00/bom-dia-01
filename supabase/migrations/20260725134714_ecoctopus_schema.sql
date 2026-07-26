/*
# EcoOctopus core schema

## Overview
EcoOctopus lets users photograph trash/objects, get 3 upcycling suggestions
(daily-use, decoration, toy) with difficulty levels, mark satisfaction,
share creations in a community feed with likes (hearts), collect pets to
decorate their profile, and spend "eco points" on pet accessories in a store.

## Tables (in creation order)
1. `accessories_catalog` — seed catalog of buyable accessories (name, price,
   which pet it belongs to, emoji). Seeded with starter rows. Created first
   because owned_accessories references it.
2. `profiles` — per-user display name, avatar pet, eco_points balance.
3. `owned_pets` — pets the user has unlocked.
4. `owned_accessories` — accessories the user has purchased.
5. `scans` — a user's scan of a trash object: photo url, material tag, the 3
   generated suggestions (stored as JSONB), chosen suggestion, satisfaction flag.
6. `community_posts` — a published creation: image url, caption, the upcycled
   idea, author reference.
7. `post_likes` — a like (heart) on a community post by a user.

## Security
- RLS enabled on every table.
- `profiles`: SELECT open to all authenticated (so community can show author
  info); INSERT/UPDATE owner-scoped.
- `owned_pets`, `owned_accessories`, `scans`: owner-scoped CRUD.
- `community_posts`: SELECT open to all authenticated (public feed);
  INSERT/UPDATE/DELETE owner-scoped.
- `post_likes`: SELECT open to all authenticated; INSERT/DELETE owner-scoped
  (one like per user per post via unique constraint).
- `accessories_catalog`: SELECT open to all authenticated; no app writes.

## Notes
1. Owner columns default to auth.uid() so client inserts that omit user_id
   still satisfy WITH CHECK policies.
2. eco_points has a CHECK (>= 0) to prevent negative balances.
3. Unique constraint on post_likes (post_id, user_id) prevents double-likes.
*/

-- ACCESSORIES CATALOG (seeded) ---------------------------------------
CREATE TABLE IF NOT EXISTS accessories_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  pet_key text NOT NULL,
  slot text NOT NULL DEFAULT 'hat',
  price integer NOT NULL CHECK (price >= 0),
  emoji text NOT NULL DEFAULT '✨',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE accessories_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "accessories_catalog_select_all" ON accessories_catalog;
CREATE POLICY "accessories_catalog_select_all" ON accessories_catalog FOR SELECT
  TO authenticated USING (true);

-- Seed the catalog with starter accessories across pets/slots.
INSERT INTO accessories_catalog (name, pet_key, slot, price, emoji)
VALUES
  ('Leaf Crown', 'fox', 'hat', 40, '🍂'),
  ('Acorn Necklace', 'fox', 'neck', 25, '🌰'),
  ('Tiger Stripe Cape', 'tiger', 'back', 60, '🦺'),
  ('Bamboo Hat', 'tiger', 'hat', 35, '🎋'),
  ('Banana Backpack', 'monkey', 'back', 50, '🎒'),
  ('Vine Bracelet', 'monkey', 'wrist', 20, '🌿'),
  ('Honey Scarf', 'bear', 'neck', 45, '🧣'),
  ('Forest Beret', 'bear', 'hat', 38, '🎩'),
  ('Pond Lily', 'duck', 'hat', 30, '🪷'),
  ('Reed Necklace', 'duck', 'neck', 22, '🌾'),
  ('Yarn Bow', 'cat', 'neck', 28, '🎀'),
  ('Whisker Charm', 'cat', 'wrist', 18, '✨'),
  ('Bone Collar', 'dog', 'neck', 32, '🦴'),
  ('Paw Print Bandana', 'dog', 'back', 26, '🧣'),
  ('Carrot Backpack', 'rabbit', 'back', 48, '🥕'),
  ('Cotton Tail Bow', 'rabbit', 'tail', 24, '☁️'),
  ('Savanna Sun Hat', 'giraffe', 'hat', 42, '🌞'),
  ('Spotted Scarf', 'giraffe', 'neck', 36, '🦒'),
  ('Swamp Crown', 'alligator', 'hat', 55, '👑'),
  ('Reed Armband', 'alligator', 'wrist', 30, '🍃'),
  ('Tentacle Beanie', 'octopus', 'hat', 50, '🧢'),
  ('Pearl Pendant', 'octopus', 'neck', 70, '📿')
ON CONFLICT DO NOTHING;

-- PROFILES -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Eco Explorer',
  bio text DEFAULT '',
  active_pet text DEFAULT 'octopus',
  eco_points integer NOT NULL DEFAULT 0 CHECK (eco_points >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- OWNED PETS ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS owned_pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_key text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (user_id, pet_key)
);
ALTER TABLE owned_pets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owned_pets_select_own" ON owned_pets;
CREATE POLICY "owned_pets_select_own" ON owned_pets FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owned_pets_insert_own" ON owned_pets;
CREATE POLICY "owned_pets_insert_own" ON owned_pets FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owned_pets_delete_own" ON owned_pets;
CREATE POLICY "owned_pets_delete_own" ON owned_pets FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- OWNED ACCESSORIES --------------------------------------------------
CREATE TABLE IF NOT EXISTS owned_accessories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  accessory_id uuid NOT NULL REFERENCES accessories_catalog(id) ON DELETE CASCADE,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE (user_id, accessory_id)
);
ALTER TABLE owned_accessories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owned_accessories_select_own" ON owned_accessories;
CREATE POLICY "owned_accessories_select_own" ON owned_accessories FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owned_accessories_insert_own" ON owned_accessories;
CREATE POLICY "owned_accessories_insert_own" ON owned_accessories FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- SCANS --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  material_tag text NOT NULL DEFAULT 'mixed',
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  chosen_index integer,
  satisfied boolean,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scans_select_own" ON scans;
CREATE POLICY "scans_select_own" ON scans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "scans_insert_own" ON scans;
CREATE POLICY "scans_insert_own" ON scans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "scans_update_own" ON scans;
CREATE POLICY "scans_update_own" ON scans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "scans_delete_own" ON scans;
CREATE POLICY "scans_delete_own" ON scans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- COMMUNITY POSTS ----------------------------------------------------
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text NOT NULL DEFAULT '',
  idea_title text NOT NULL DEFAULT '',
  idea_category text NOT NULL DEFAULT 'daily',
  idea_difficulty text NOT NULL DEFAULT 'easy',
  material_tag text NOT NULL DEFAULT 'mixed',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "community_posts_select_all" ON community_posts;
CREATE POLICY "community_posts_select_all" ON community_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "community_posts_insert_own" ON community_posts;
CREATE POLICY "community_posts_insert_own" ON community_posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "community_posts_update_own" ON community_posts;
CREATE POLICY "community_posts_update_own" ON community_posts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "community_posts_delete_own" ON community_posts;
CREATE POLICY "community_posts_delete_own" ON community_posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- POST LIKES ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (post_id, user_id)
);
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_likes_select_all" ON post_likes;
CREATE POLICY "post_likes_select_all" ON post_likes FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "post_likes_insert_own" ON post_likes;
CREATE POLICY "post_likes_insert_own" ON post_likes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "post_likes_delete_own" ON post_likes;
CREATE POLICY "post_likes_delete_own" ON post_likes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_scans_user ON scans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_owned_pets_user ON owned_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_owned_accessories_user ON owned_accessories(user_id);
