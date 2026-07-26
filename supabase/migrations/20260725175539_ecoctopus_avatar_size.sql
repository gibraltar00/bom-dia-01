/*
# EcoOctopus: avatar size preference

## Overview
Adds an `avatar_size` integer column to `profiles` so users can scale their
profile pet avatar (50-200 percent of the default size). This lets people
make their pet bigger or smaller on their profile.

## Modified Tables
- `profiles` — add `avatar_size` (integer, default 100).

## Security
- `profiles` UPDATE policy already covers the new `avatar_size` column.
- No new policies needed.

## Notes
1. `avatar_size` defaults to 100 (normal size) for all existing users.
2. The frontend clamps the value to 50-200 before saving.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_size integer NOT NULL DEFAULT 100;
