/*
# EcoOctopus: avatar rotation angle preference

## Overview
Adds an `avatar_angle` integer column to `profiles` so users can tilt their
profile pet avatar to a custom angle (0-360 degrees). This lets people give
their pet photo a playful tilt, like the original profile photos.

## Modified Tables
- `profiles` — add `avatar_angle` (integer, default 0).

## Security
- `profiles` UPDATE policy already covers the new `avatar_angle` column.
- No new policies needed.

## Notes
1. `avatar_angle` defaults to 0 (upright) for all existing users.
2. The frontend clamps the value to 0-359 before saving.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_angle integer NOT NULL DEFAULT 0;
