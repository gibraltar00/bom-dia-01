-- Fix 4 security issues: tables with incomplete RLS policies

-- 1. chat_conversations: missing UPDATE (needed for upsert) and DELETE
CREATE POLICY "chat_conversations_update_participants" ON chat_conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "chat_conversations_delete_participants" ON chat_conversations FOR DELETE
  TO authenticated USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 2. user_achievements: missing UPDATE and DELETE
CREATE POLICY "user_achievements_update_own" ON user_achievements FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_achievements_delete_own" ON user_achievements FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 3. post_views: missing DELETE and UPDATE
CREATE POLICY "post_views_update_own" ON post_views FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_views_delete_own" ON post_views FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- 4. post_likes: missing UPDATE
CREATE POLICY "post_likes_update_own" ON post_likes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
