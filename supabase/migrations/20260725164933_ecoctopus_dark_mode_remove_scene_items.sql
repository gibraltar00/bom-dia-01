/*
# EcoOctopus: dark mode preference + remove scene items + remove recycle badge

## Overview
1. Adds a `dark_mode` boolean column to `profiles` so users can toggle
   between light and dark color tones in the profile screen.
2. Removes all scene items catalog rows and the "Recycle Badge" fox accessory
   so they no longer appear in the app. The tables themselves remain (no
   data loss risk to schema), but the catalog rows are deleted.

## Modified Tables
- `profiles` — add `dark_mode` (boolean, default false).

## Data Changes
- DELETE all rows from `scene_items_catalog` (scene items feature removed).
- DELETE the "Recycle Badge" row from `accessories_catalog`.
- DELETE all rows from `owned_scene_items` (orphaned ownership records).

## Security
- `profiles` UPDATE policy already covers the new `dark_mode` column.
- No new policies needed.

## Notes
1. `dark_mode` defaults to false (light mode) for all existing users.
2. The scene_items_catalog and owned_scene_items tables are kept in place
   to avoid schema migration complexity; only their data is cleared.
*/

-- profiles: add dark_mode column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dark_mode boolean NOT NULL DEFAULT false;

-- Remove all scene items catalog entries
DELETE FROM scene_items_catalog;

-- Remove owned scene items (orphaned after catalog cleanup)
DELETE FROM owned_scene_items;

-- Remove the fox "Recycle Badge" accessory
DELETE FROM accessories_catalog WHERE name = 'Recycle Badge' AND pet_key = 'fox';
