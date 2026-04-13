-- Migration: Add Chat Performance Indexes
-- Optimizes incremental message sync and unread count queries.

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_updated
  ON messages(conversation_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_read_sender
  ON messages(conversation_id, is_read, sender_id);

CREATE INDEX IF NOT EXISTS idx_conversations_participants_updated
  ON conversations(buyer_id, seller_id, updated_at DESC);
