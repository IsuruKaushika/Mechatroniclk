-- Migration: Harden Chat RLS Policies for Real-Time Subscriptions
-- Keep chat data private at the database layer. Backend APIs (service role + JWT checks)
-- are responsible for authorized reads/writes.

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

-- Remove insecure public-read policies if they exist
DROP POLICY IF EXISTS "Public can read conversations" ON conversations;
DROP POLICY IF EXISTS "Public can read messages" ON messages;
DROP POLICY IF EXISTS "Public can read typing indicators" ON typing_indicators;
DROP POLICY IF EXISTS "Public can read cloudinary tokens" ON cloudinary_tokens;

-- ============================================
-- NOTES
-- ============================================
-- With no public SELECT policies, anon clients cannot read all chat data directly.
-- Backend endpoints must proxy reads and enforce authorization rules.
