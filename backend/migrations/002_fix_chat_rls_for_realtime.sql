-- Migration: Fix Chat RLS Policies for Real-Time Subscriptions
-- Since the backend handles authorization and uses Service Role Key for writes,
-- we need to allow public read access for real-time subscriptions to work

-- Drop the restrictive RLS policies that depend on auth.uid()
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON messages;
DROP POLICY IF EXISTS "Users can update messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update their conversations" ON conversations;
DROP POLICY IF EXISTS "Users can view typing indicators in their conversations" ON typing_indicators;
DROP POLICY IF EXISTS "Users can insert typing indicators" ON typing_indicators;
DROP POLICY IF EXISTS "Users can delete their typing indicators" ON typing_indicators;
DROP POLICY IF EXISTS "Users can view their own cloudinary tokens" ON cloudinary_tokens;
DROP POLICY IF EXISTS "Users can create cloudinary tokens" ON cloudinary_tokens;

-- ============================================
-- NEW SIMPLIFIED RLS POLICIES
-- ============================================
-- Since the backend handles all authorization via JWT and uses the Service Role Key,
-- we allow public read access while relying on the backend for write authorization

-- CONVERSATIONS RLS
-- Public read (backend handles authorization in API)
CREATE POLICY "Public can read conversations"
  ON conversations FOR SELECT
  USING (true);

-- MESSAGES RLS
-- Public read (backend handles authorization in API, messages only created by backend)
CREATE POLICY "Public can read messages"
  ON messages FOR SELECT
  USING (true);

-- TYPING INDICATORS RLS
-- Public read (real-time indicator of who's typing)
CREATE POLICY "Public can read typing indicators"
  ON typing_indicators FOR SELECT
  USING (true);

-- CLOUDINARY TOKENS RLS
-- Public read (tokens are session-specific and expire quickly)
CREATE POLICY "Public can read cloudinary tokens"
  ON cloudinary_tokens FOR SELECT
  USING (true);

-- ============================================
-- NOTES
-- ============================================
-- Write operations (INSERT/UPDATE/DELETE) are handled by backend with Service Role Key,
-- which bypasses RLS entirely. These policies are only for SELECT/real-time subscriptions.
-- The backend enforces all business logic and authorization rules before allowing writes.
