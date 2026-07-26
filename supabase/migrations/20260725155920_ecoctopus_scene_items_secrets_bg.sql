/*
# Scene items, secret achievements, and background color preference

## Overview
Adds three new features:
1. Scene items catalog — decorative items users can buy in the store and
   equip to change the appearance of their pet's habitat scene.
2. Secret achievements — special hidden achievements with a `is_secret` flag
   so the frontend can show them as mystery tiles until unlocked.
3. Background color preference — a `bg_theme` column on profiles so users can
   pick the app's background color.

## New Tables
- `scene_items_catalog` — catalog of decorative scene items (id, key, name,
  pet_key, price, emoji, scene_layer). `scene_layer` controls where the item
  appears in the rendered scene (e.g. 'sky', 'ground', 'foreground').
- `owned_scene_items` — per-user ownership of scene items, with an `equipped`
  boolean so users can toggle which scene items are active.

## Modified Tables
- `profiles` — add `bg_theme` (text, default 'emerald') storing the user's
  chosen background color theme key.
- `achievements_catalog` — add `is_secret` (boolean, default false) so secret
  achievements are hidden until unlocked. Existing achievements stay public.

## Security
- `scene_items_catalog`: SELECT open to all authenticated (read-only catalog).
- `owned_scene_items`: owner-scoped CRUD (select/insert/update/delete).
- `profiles` UPDATE policy already covers the new `bg_theme` column.
- `achievements_catalog` SELECT policy already covers the new `is_secret` column.

## Notes
1. Owner columns default to `auth.uid()` so client inserts omitting `user_id`
   still satisfy WITH CHECK policies.
2. Scene item keys are stable text identifiers so the frontend can reference
   them by constant.
3. Secret achievements show as "???" mystery tiles in the UI until unlocked.
*/

-- SCENE ITEMS CATALOG --------------------------------------------------
CREATE TABLE IF NOT EXISTS scene_items_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  pet_key text NOT NULL,
  price integer NOT NULL DEFAULT 20 CHECK (price >= 0),
  emoji text NOT NULL,
  scene_layer text NOT NULL DEFAULT 'ground',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE scene_items_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scene_items_select_all" ON scene_items_catalog;
CREATE POLICY "scene_items_select_all" ON scene_items_catalog FOR SELECT
  TO authenticated USING (true);

INSERT INTO scene_items_catalog (key, name, pet_key, price, emoji, scene_layer)
VALUES
  ('reef_treasure', 'Treasure Chest', 'octopus', 30, '🧰', 'ground'),
  ('reef_starfish', 'Starfish', 'octopus', 20, '⭐', 'ground'),
  ('reef_seaweed', 'Tall Seaweed', 'octopus', 15, '🌾', 'ground'),
  ('reef_jellyfish', 'Jellyfish', 'octopus', 40, '🪼', 'sky'),
  ('reef_anchor', 'Old Anchor', 'octopus', 25, '⚓', 'ground'),
  ('forest_lantern', 'Lantern', 'fox', 30, '🏮', 'foreground'),
  ('forest_mushroom', 'Magic Mushroom', 'fox', 25, '🍄', 'ground'),
  ('forest_bonfire', 'Cozy Bonfire', 'fox', 45, '🔥', 'ground'),
  ('forest_owl', 'Owl Perch', 'fox', 35, '🦉', 'sky'),
  ('bamboo_fountain', 'Water Fountain', 'tiger', 40, '⛲', 'ground'),
  ('bamboo_windchime', 'Wind Chime', 'tiger', 25, '🎐', 'sky'),
  ('bamboo_lotus', 'Lotus Flower', 'tiger', 20, '🪷', 'ground'),
  ('jungle_vine', 'Hanging Vine', 'monkey', 15, '🌿', 'foreground'),
  ('jungle_toucan', 'Toucan', 'monkey', 45, '🦜', 'sky'),
  ('jungle_banana', 'Banana Bunch', 'monkey', 20, '🍌', 'ground'),
  ('honey_hive', 'Honey Hive', 'bear', 35, '🍯', 'ground'),
  ('honey_sunflower', 'Sunflower', 'bear', 20, '🌻', 'ground'),
  ('honey_bee', 'Busy Bee', 'bear', 25, '🐝', 'sky'),
  ('pond_lily', 'Lily Pad', 'duck', 20, '🪷', 'ground'),
  ('pond_reed', 'Tall Reed', 'duck', 15, '🌾', 'ground'),
  ('pond_dragonfly', 'Dragonfly', 'duck', 30, '🪿', 'sky'),
  ('cozy_rug', 'Cozy Rug', 'cat', 30, '🟥', 'ground'),
  ('cozy_yarn', 'Yarn Ball', 'cat', 15, '🧶', 'ground'),
  ('cozy_window', 'Window View', 'cat', 40, '🪟', 'foreground'),
  ('yard_fence', 'White Fence', 'dog', 25, '🚧', 'ground'),
  ('yard_ball', 'Tennis Ball', 'dog', 15, '🎾', 'ground'),
  ('yard_doghouse', 'Dog House', 'dog', 45, '🏠', 'ground'),
  ('garden_carrot', 'Giant Carrot', 'rabbit', 15, '🥕', 'ground'),
  ('garden_tulip', 'Tulip Patch', 'rabbit', 20, '🌷', 'ground'),
  ('garden_butterfly', 'Butterfly', 'rabbit', 30, '🦋', 'sky'),
  ('savanna_acacia', 'Acacia Tree', 'giraffe', 35, '🌳', 'ground'),
  ('savanna_sun', 'Bright Sun', 'giraffe', 25, '☀️', 'sky'),
  ('savanna_grass', 'Tall Grass', 'giraffe', 15, '🌾', 'ground'),
  ('swamp_lily', 'Swamp Lily', 'alligator', 20, '🪻', 'ground'),
  ('swamp_log', 'Mossy Log', 'alligator', 25, '🪵', 'ground'),
  ('swamp_firefly', 'Firefly', 'alligator', 35, '✨', 'sky')
ON CONFLICT (key) DO NOTHING;

-- OWNED SCENE ITEMS ----------------------------------------------------
CREATE TABLE IF NOT EXISTS owned_scene_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scene_item_id uuid NOT NULL REFERENCES scene_items_catalog(id) ON DELETE CASCADE,
  equipped boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, scene_item_id)
);
ALTER TABLE owned_scene_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owned_scene_items_select_own" ON owned_scene_items;
CREATE POLICY "owned_scene_items_select_own" ON owned_scene_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owned_scene_items_insert_own" ON owned_scene_items;
CREATE POLICY "owned_scene_items_insert_own" ON owned_scene_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owned_scene_items_update_own" ON owned_scene_items;
CREATE POLICY "owned_scene_items_update_own" ON owned_scene_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owned_scene_items_delete_own" ON owned_scene_items;
CREATE POLICY "owned_scene_items_delete_own" ON owned_scene_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_owned_scene_items_user ON owned_scene_items(user_id);

-- PROFILES: background theme ------------------------------------------
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bg_theme text NOT NULL DEFAULT 'emerald';

-- ACHIEVEMENTS: secret flag + secret achievements ----------------------
ALTER TABLE achievements_catalog ADD COLUMN IF NOT EXISTS is_secret boolean NOT NULL DEFAULT false;

INSERT INTO achievements_catalog (key, title, description, emoji, coin_reward, xp_reward, is_secret)
VALUES
  ('night_owl', 'Night Owl', 'Log a night with less than 3 hours of sleep.', '🦉', 20, 30, true),
  ('marathon', 'Marathon Scrapper', 'Scan 20 items in a single day.', '🏃', 60, 120, true),
  ('fashionista', 'Fashionista', 'Own 5 or more accessories.', '👗', 40, 80, true),
  ('interior_designer', 'Interior Designer', 'Own 3 or more scene items.', '🛋️', 40, 80, true),
  ('social_butterfly', 'Social Butterfly', 'Like 10 different posts from other users.', '🦋', 30, 60, true),
  ('eco_legend', 'Eco Legend', 'Reach level 20.', '🌟', 300, 0, true)
ON CONFLICT (key) DO NOTHING;
