-- Migration: Create Chat Tables for Real-Time Messaging
-- This migration sets up the database schema for the chat feature

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,
  service_id UUID,
  service_name TEXT DEFAULT '3D Design Service',
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT conversations_buyer_seller_unique UNIQUE(buyer_id, seller_id)
);

-- 2. Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'file', NULL)),
  file_name TEXT,
  file_size INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for performance
  CONSTRAINT messages_valid_content CHECK (content IS NOT NULL OR media_url IS NOT NULL)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- 3. Typing Indicators Table (ephemeral, auto-cleanup)
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 seconds'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_typing_indicators_conversation ON typing_indicators(conversation_id);

-- 4. Cloudinary Upload Tokens (cache for security)
CREATE TABLE IF NOT EXISTS cloudinary_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  token TEXT NOT NULL,
  signature TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cloudinary_tokens_user_id ON cloudinary_tokens(user_id);
CREATE INDEX idx_cloudinary_tokens_expires ON cloudinary_tokens(expires_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloudinary_tokens ENABLE ROW LEVEL SECURITY;

-- CONVERSATIONS RLS
-- Users can view conversations they participate in
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Users can create conversations
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Users can update their conversations
CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- MESSAGES RLS
-- Users can view messages from their conversations
CREATE POLICY "Users can view messages from their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
  );

-- Users can insert messages into their conversations
CREATE POLICY "Users can insert messages into their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
    AND auth.uid() = sender_id
  );

-- Users can update their own messages (mark as read)
CREATE POLICY "Users can update messages in their conversations"
  ON messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
  );

-- TYPING INDICATORS RLS
-- Users can view typing indicators in their conversations
CREATE POLICY "Users can view typing indicators in their conversations"
  ON typing_indicators FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
  );

-- Users can insert typing indicators
CREATE POLICY "Users can insert typing indicators"
  ON typing_indicators FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
    AND auth.uid() = user_id
  );

-- Users can delete their typing indicators
CREATE POLICY "Users can delete their typing indicators"
  ON typing_indicators FOR DELETE
  USING (auth.uid() = user_id);

-- CLOUDINARY TOKENS RLS
-- Users can view their own tokens
CREATE POLICY "Users can view their own cloudinary tokens"
  ON cloudinary_tokens FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create tokens
CREATE POLICY "Users can create cloudinary tokens"
  ON cloudinary_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update conversation's last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = CURRENT_TIMESTAMP, last_message_at = CURRENT_TIMESTAMP
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update last_message_at when new message is created
CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- END MIGRATION
-- ============================================
