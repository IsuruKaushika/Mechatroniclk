# Supabase Setup Guide for Chat Feature

## 📋 What Supabase Does for Chat

Supabase provides:

1. **Authentication** - Login/Signup system (required for chat)
2. **Database** - Store conversations, messages, typing indicators
3. **Real-Time Subscriptions** - Instant message sync (no polling)
4. **Row Level Security** - Only users see their own data

---

## ✅ Step 1: Create Database Tables

### Go to Supabase Dashboard:

1. Visit https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy & paste this SQL:

```sql
-- ============================================
-- CREATE CHAT TABLES
-- ============================================

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

  CONSTRAINT messages_valid_content CHECK (content IS NOT NULL OR media_url IS NOT NULL)
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- 3. Typing Indicators Table
CREATE TABLE IF NOT EXISTS typing_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 seconds'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_typing_indicators_conversation ON typing_indicators(conversation_id);

-- 4. Cloudinary Upload Tokens
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
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloudinary_tokens ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE RLS POLICIES
-- ============================================

-- CONVERSATIONS RLS POLICIES

CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id)
  WITH CHECK (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- MESSAGES RLS POLICIES

CREATE POLICY "Users can view messages from their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
  );

CREATE POLICY "Users can insert messages into their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
    AND auth.uid() = sender_id
  );

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

-- TYPING INDICATORS RLS POLICIES

CREATE POLICY "Users can view typing indicators in their conversations"
  ON typing_indicators FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
  );

CREATE POLICY "Users can insert typing indicators"
  ON typing_indicators FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE auth.uid() = buyer_id OR auth.uid() = seller_id
    )
    AND auth.uid() = user_id
  );

CREATE POLICY "Users can delete their typing indicators"
  ON typing_indicators FOR DELETE
  USING (auth.uid() = user_id);

-- CLOUDINARY TOKENS RLS POLICIES

CREATE POLICY "Users can view their own cloudinary tokens"
  ON cloudinary_tokens FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create cloudinary tokens"
  ON cloudinary_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CREATE HELPER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET updated_at = CURRENT_TIMESTAMP, last_message_at = CURRENT_TIMESTAMP
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();
```

6. Click **Run** button
7. Wait for completion (should see green checkmark)

---

## ✅ Step 2: Verify Tables Created

Go to **Table Editor** (left sidebar):

- ✅ Should see `conversations` table
- ✅ Should see `messages` table
- ✅ Should see `typing_indicators` table
- ✅ Should see `cloudinary_tokens` table

---

## ✅ Step 3: Check Authentication is Enabled

Go to **Authentication** (left sidebar):

1. Click **Providers**
2. Verify **Email** is enabled (should be by default)
3. Go to **Users** tab
4. You should see any existing users (or create test users here)

---

## ✅ Step 4: Get Your Supabase Credentials

Go to **Project Settings** (bottom of left sidebar):

1. Click **API**
2. Copy these values and add to `frontend/.env.local`:

```
VITE_SUPABASE_URL = [Copy "Project URL"]
VITE_SUPABASE_PUBLISHABLE_KEY = [Copy "anon public" key]
```

Example:

```
VITE_SUPABASE_URL = https://abcdefghijk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOiJIUzI1NiIsInR5...
```

---

## ✅ Step 5: Enable Realtime (Important!)

Go to **Database** → **Replication** (left sidebar under your project):

1. Click on `public` schema
2. Toggle ON these tables:
   - ✅ `messages`
   - ✅ `conversations`
   - ✅ `typing_indicators`

This enables real-time subscriptions for instant message sync.

---

## ✅ Step 6: Create Seller Account (Optional but Recommended)

Go to **Authentication** → **Users**:

1. Click **Add user**
2. Email: `seller@mechatroniclk.com`
3. Password: `seller123456`
4. Copy the User ID (UUID)
5. Update this in `frontend/src/components/Chat/ChatButton.jsx`:

```javascript
<ChatButton
  sellerId="your-seller-uuid-here" // ← Paste seller UUID
  sellerName="MechatronicLK Studio"
/>
```

---

## 📋 Checklist

- [ ] SQL migration executed successfully
- [ ] Tables visible in Table Editor
- [ ] Email auth enabled
- [ ] Realtime enabled for 3 tables
- [ ] Supabase credentials added to frontend/.env.local
- [ ] Frontend server restarted (to load new env vars)
- [ ] (Optional) Seller account created

---

## ❓ FAQ

### Q: Do users need to login to chat?

**A:** Yes. Chat requires authentication. Users must:

1. Create account (email + password)
2. Verify email (or skip in dev mode)
3. Then access chat button

The app already has login at `/login` route, chat integrates with that.

### Q: What if RLS policies fail?

**A:** Check:

1. Tables have RLS enabled (should see lock icon in Table Editor)
2. Policies are created correctly
3. User IDs match (seller_id, buyer_id in conversations table)
4. No typos in policy names

### Q: Why Realtime?

**A:** Without realtime:

- Messages would need "refresh" button
- Typing indicators wouldn't work
- No live updates

With realtime (< 100ms latency):

- Messages appear instantly
- "Typing..." appears instantly
- Professional experience

### Q: Can I test without a seller?

**A:** Yes. Any logged-in user can chat with any other user. Just change:

```javascript
<ChatButton
  sellerId={currentUserId} // Chat with yourself for testing
  sellerName="Test Seller"
/>
```

---

## 🚀 After Setup is Complete

1. Restart frontend: `npm run dev`
2. Restart backend: `npm run dev`
3. Go to http://localhost:5173
4. Sign up / Login
5. Navigate to 3D Design Service page
6. Scroll to "Custom Offer" section
7. Click **Chat** button
8. Send test message
9. Check Supabase **Table Editor** → `messages` table
10. Should see your message there ✅

---

## ⚠️ Common Issues

| Issue                          | Solution                                                  |
| ------------------------------ | --------------------------------------------------------- |
| "Realtime subscription failed" | Enable realtime for tables in Replication                 |
| "Permission denied"            | Check RLS policies - verify auth.uid() is working         |
| "No tables found"              | SQL migration didn't run - check for errors in SQL Editor |
| "Messages not syncing"         | Restart frontend server to load env vars                  |
| "Upload fails"                 | Cloudinary variables correct in backend .env              |
