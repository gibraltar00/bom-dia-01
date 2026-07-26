/*
# EcoOctopus community chat

## Overview
Adds a global community chat so users can talk to each other in real time
inside the Community tab. Messages are public to all authenticated users;
each user can only delete their own messages.

## New Tables
1. `chat_messages`
   - `id` (uuid, primary key)
   - `user_id` (uuid, not null, defaults to auth.uid(), references auth.users)
   - `body` (text, not null, max 500 chars via app validation)
   - `created_at` (timestamptz, defaults to now())

## Security
- RLS enabled on `chat_messages`.
- SELECT open to all authenticated (public chat room).
- INSERT owner-scoped (only your own messages).
- DELETE owner-scoped (only your own messages).
- No UPDATE policy — messages are immutable once sent.

## Notes
1. `user_id` defaults to `auth.uid()` so client inserts that omit `user_id`
   still satisfy the INSERT WITH CHECK policy.
2. Index on `created_at` for efficient chronological loading.
3. Messages are capped at 500 characters in the app layer; the DB does not
   enforce length to keep the schema flexible.
*/

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_messages_select_all" ON chat_messages;
CREATE POLICY "chat_messages_select_all" ON chat_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "chat_messages_insert_own" ON chat_messages;
CREATE POLICY "chat_messages_insert_own" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "chat_messages_delete_own" ON chat_messages;
CREATE POLICY "chat_messages_delete_own" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at DESC);
