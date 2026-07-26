/*
# EcoOctopus: Sleep tracking for XP

## Overview
Adds a `sleep_logs` table so users can log how many hours they slept and
earn XP based on sleep quality. Better sleep = more XP, encouraging
healthy habits alongside the eco mission.

## Schema
- `sleep_logs`:
  - `id` uuid PK
  - `user_id` uuid FK -> profiles.id (cascade delete)
  - `hours` numeric(3,1) — hours slept (0.0–24.0)
  - `xp_awarded` integer — XP granted for this log
  - `logged_date` date — the night the sleep is for
  - `created_at` timestamptz default now()

## Constraints
- UNIQUE (user_id, logged_date) — one log per user per night
- CHECK (hours >= 0 AND hours <= 24)

## RLS
- 4 CRUD policies, owner-scoped via auth.uid()
*/

CREATE TABLE IF NOT EXISTS sleep_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hours numeric(3,1) NOT NULL CHECK (hours >= 0 AND hours <= 24),
  xp_awarded integer NOT NULL DEFAULT 0,
  logged_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, logged_date)
);

ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_sleep_logs" ON sleep_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_sleep_logs" ON sleep_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_sleep_logs" ON sleep_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_sleep_logs" ON sleep_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
