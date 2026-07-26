/*
# Achievements system

## Overview
Adds an achievements catalog and per-user unlocked-achievements tracking.
Achievements award coins (eco_points) and XP when unlocked.

## New Tables
1. `achievements_catalog` — seed catalog of achievements (key, title,
   description, emoji, coin_reward, xp_reward). Seeded with starter rows.
2. `user_achievements` — records which achievements each user has unlocked.
   Unique on (user_id, achievement_key) so each achievement unlocks once.

## Security
- `achievements_catalog`: SELECT open to all authenticated (read-only catalog).
- `user_achievements`: owner-scoped SELECT and INSERT. No UPDATE/DELETE needed
  (achievements are permanent once unlocked).

## Notes
1. Owner column defaults to auth.uid() so client inserts that omit user_id
   still satisfy WITH CHECK policies.
2. Achievement keys are stable text identifiers (not UUIDs) so the frontend
   can reference them by constant.
*/

-- ACHIEVEMENTS CATALOG (seeded) ---------------------------------------
CREATE TABLE IF NOT EXISTS achievements_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  emoji text NOT NULL DEFAULT '🏆',
  coin_reward integer NOT NULL DEFAULT 0 CHECK (coin_reward >= 0),
  xp_reward integer NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE achievements_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "achievements_catalog_select_all" ON achievements_catalog;
CREATE POLICY "achievements_catalog_select_all" ON achievements_catalog FOR SELECT
  TO authenticated USING (true);

INSERT INTO achievements_catalog (key, title, description, emoji, coin_reward, xp_reward)
VALUES
  ('first_scan', 'First Scan', 'Complete your very first item scan.', '📸', 10, 20),
  ('five_scans', 'Eco Collector', 'Scan 5 different items.', '🔍', 25, 50),
  ('ten_scans', 'Scan Master', 'Scan 10 items in total.', '🔬', 50, 100),
  ('first_post', 'Community Builder', 'Share your first creation to the community.', '🌍', 15, 30),
  ('five_posts', 'Prolific Creator', 'Share 5 creations to the community.', '🎨', 40, 80),
  ('first_like', 'Well Liked', 'Receive your first like from the community.', '❤️', 10, 20),
  ('ten_likes', 'Popular', 'Receive 10 total likes across your posts.', '⭐', 50, 100),
  ('level_5', 'Eco Warrior', 'Reach level 5.', '⚔️', 100, 0),
  ('level_10', 'Eco Octopus Master', 'Reach level 10.', '👑', 200, 0),
  ('well_rested', 'Well Rested', 'Log a night of 7+ hours of sleep.', '😴', 15, 25),
  ('pet_collector', 'Pet Collector', 'Own 3 or more pets.', '🐾', 30, 60),
  ('first_idea', 'Idea Explorer', 'Mark yourself satisfied with an idea for the first time.', '💡', 10, 15)
ON CONFLICT (key) DO NOTHING;

-- USER ACHIEVEMENTS ---------------------------------------------------
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE (user_id, achievement_key)
);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_achievements_select_own" ON user_achievements;
CREATE POLICY "user_achievements_select_own" ON user_achievements FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_achievements_insert_own" ON user_achievements;
CREATE POLICY "user_achievements_insert_own" ON user_achievements FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
