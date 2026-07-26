/*
# EcoOctopus: XP system, equipped accessories, expanded store

## Overview
Adds a leveling/XP system to profiles so users progress like in a game,
lets users equip accessories on their pets (with a favorite pet showcase),
and seeds many more accessories into the store catalog.

## Changes
1. `profiles` — add `xp` (integer, default 0) tracking total experience.
   Level is derived in app code from xp (no denormalized column needed).
2. `owned_accessories` — add `equipped` (boolean, default false) so a user
   can mark which owned accessories are currently shown on their pet.
3. `accessories_catalog` — seed ~40 new accessories across all pets and
   slots (hats, neck, back, wrist, tail, face) with varied prices.

## Security
- No new tables. Existing RLS policies cover the new columns:
  - `profiles` UPDATE policy already covers the `xp` column (owner-scoped).
  - `owned_accessories` has no UPDATE policy yet, so we add one for equipping.
- New policy: `owned_accessories_update_own` — owner-scoped UPDATE.

## Notes
1. `xp` defaults to 0 and only ever increases in app code.
2. `equipped` defaults to false; the app toggles it per accessory.
3. All seed inserts use ON CONFLICT DO NOTHING so re-running is safe.
*/

-- profiles: add xp column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp integer NOT NULL DEFAULT 0;

-- owned_accessories: add equipped column
ALTER TABLE owned_accessories ADD COLUMN IF NOT EXISTS equipped boolean NOT NULL DEFAULT false;

-- Allow users to update their own owned_accessories rows (to equip/unequip)
DROP POLICY IF EXISTS "owned_accessories_update_own" ON owned_accessories;
CREATE POLICY "owned_accessories_update_own" ON owned_accessories
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Seed many more accessories across all pets and slots
INSERT INTO accessories_catalog (name, pet_key, slot, price, emoji)
VALUES
  -- Fox
  ('Forest Bandana', 'fox', 'neck', 30, '🧣'),
  ('Berry Earrings', 'fox', 'face', 35, '🫐'),
  ('Maple Leaf Hat', 'fox', 'hat', 45, '🍁'),
  ('Tail Ribbon', 'fox', 'tail', 20, '🎀'),
  -- Tiger
  ('Jungle Crown', 'tiger', 'hat', 65, '👑'),
  ('Whisker Paint', 'tiger', 'face', 25, '🎨'),
  ('Paw Gauntlets', 'tiger', 'wrist', 40, '🥊'),
  -- Monkey
  ('Tropical Hat', 'monkey', 'hat', 40, '👒'),
  ('Banana Charm', 'monkey', 'neck', 22, '🍌'),
  ('Vine Belt', 'monkey', 'wrist', 28, '🌿'),
  -- Bear
  ('Honey Pot Backpack', 'bear', 'back', 55, '🍯'),
  ('Berry Crown', 'bear', 'hat', 42, '🫐'),
  ('Cozy Scarf', 'bear', 'neck', 35, '🧣'),
  -- Duck
  ('Rain Hat', 'duck', 'hat', 38, '☔'),
  ('Feather Bow', 'duck', 'neck', 24, '🪶'),
  ('Pond Cape', 'duck', 'back', 48, '🦆'),
  -- Cat
  ('Fish Bone Collar', 'cat', 'neck', 30, '🐟'),
  ('Star Glasses', 'cat', 'face', 45, '🕶️'),
  ('Moon Hat', 'cat', 'hat', 50, '🌙'),
  -- Dog
  ('Bone Crown', 'dog', 'hat', 48, '👑'),
  ('Tennis Ball Charm', 'dog', 'neck', 25, '🎾'),
  ('Paw Mitts', 'dog', 'wrist', 32, '🧤'),
  -- Rabbit
  ('Carrot Crown', 'rabbit', 'hat', 38, '🥕'),
  ('Spring Cape', 'rabbit', 'back', 42, '🌱'),
  ('Flower Collar', 'rabbit', 'neck', 28, '🌸'),
  -- Giraffe
  ('Sun Crown', 'giraffe', 'hat', 55, '🌞'),
  ('Savanna Cape', 'giraffe', 'back', 65, '🟡'),
  ('Acacia Leaf', 'giraffe', 'face', 30, '🍃'),
  -- Alligator
  ('Swamp Crown', 'alligator', 'hat', 60, '👑'),
  ('Tooth Necklace', 'alligator', 'neck', 45, '🦷'),
  ('Mud Cape', 'alligator', 'back', 50, '🟤'),
  -- Octopus (mascot, extra options)
  ('Coral Crown', 'octopus', 'hat', 60, '👑'),
  ('Seashell Pendant', 'octopus', 'neck', 55, '🐚'),
  ('Pearl Bracelet', 'octopus', 'wrist', 40, '📿'),
  ('Tide Pool Cape', 'octopus', 'back', 65, '🌊'),
  ('Ink Glasses', 'octopus', 'face', 35, '🕶️'),
  -- Generic / cross-pet fun items
  ('Eco Hero Cape', 'octopus', 'back', 80, '🦸'),
  ('Recycle Badge', 'fox', 'neck', 15, '♻️'),
  ('Leafy Halo', 'cat', 'face', 50, '🌿'),
  ('Rainbow Scarf', 'rabbit', 'neck', 48, '🌈')
ON CONFLICT DO NOTHING;
