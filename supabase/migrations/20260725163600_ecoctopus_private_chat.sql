/*
# EcoOctopus private 1-on-1 chat

## Overview
Replaces the global community chat with private conversations between
exactly two users. Each conversation has two participants; only they can
see and send messages in it.

## New Tables
1. `chat_conversations`
   - `id` (uuid, primary key)
   - `user1_id` (uuid, not null, references auth.users)
   - `user2_id` (uuid, not null, references auth.users)
   - `created_at` (timestamptz, defaults to now())
   - Unique constraint on (user1_id, user2_id) prevents duplicate conversations.

## Modified Tables
1. `chat_messages` — adds nullable `conversation_id` column referencing
   `chat_conversations(id)`. Old global messages remain (conversation_id
   is null); new private messages set this column.

## Security
- `chat_conversations`: RLS enabled. SELECT only for participants
  (user1_id or user2_id = auth.uid()). INSERT only if auth.uid() is one of
  the two participants.
- `chat_messages`: UPDATE existing SELECT policy to also allow reading
  messages where the user is a participant in the conversation. New INSERT
  policy requires the sender to be a participant in the conversation.
  DELETE stays owner-scoped.

## Notes
1. Conversation participants are stored with the smaller user id as user1_id
   to simplify uniqueness checks (enforced in app layer).
2. The old global chat_messages SELECT policy is replaced.
*/

CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user1_id, user2_id),
  CHECK (user1_id <> user2_id)
);

ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_conversations_select_participants" ON chat_conversations;
CREATE POLICY "chat_conversations_select_participants" ON chat_conversations FOR SELECT
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "chat_conversations_insert_participants" ON chat_conversations;
CREATE POLICY "chat_conversations_insert_participants" ON chat_conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Add conversation_id column to chat_messages
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chat_messages' AND column_name = 'conversation_id'
  ) THEN
    ALTER TABLE chat_messages ADD COLUMN conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON chat_messages(conversation_id, created_at);

-- Replace the chat_messages SELECT policy to only allow reading messages
-- in conversations the user participates in (or old global messages they sent)
DROP POLICY IF EXISTS "chat_messages_select_all" ON chat_messages;
CREATE POLICY "chat_messages_select_participant" ON chat_messages FOR SELECT
  TO authenticated USING (
    conversation_id IS NULL AND user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = chat_messages.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

-- Replace INSERT policy: sender must be a participant in the conversation
DROP POLICY IF EXISTS "chat_messages_insert_own" ON chat_messages;
CREATE POLICY "chat_messages_insert_participant" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM chat_conversations c
      WHERE c.id = chat_messages.conversation_id
      AND (c.user1_id = auth.uid() OR c.user2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "chat_messages_delete_own" ON chat_messages;
CREATE POLICY "chat_messages_delete_own" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
