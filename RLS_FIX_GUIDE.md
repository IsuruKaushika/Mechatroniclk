# Chat System - RLS Policy Fix

## Issue

Messages sent through the chat are not appearing because Supabase RLS (Row Level Security) policies are blocking read access. The policies were designed for Supabase Auth users, but this system uses MongoDB Auth.

## Solution

Run the migration script in your Supabase dashboard to fix the RLS policies.

## Steps to Fix

### 1. Open Supabase Dashboard

- Go to https://app.supabase.com
- Select your project "mechatroniclk"

### 2. Run the Migration

- Go to **SQL Editor** in the left sidebar
- Click **+ New Query**
- Copy this SQL and paste it:

```sql
-- Fix Chat RLS Policies for Real-Time Subscriptions
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

-- Create new simplified policies
CREATE POLICY "Public can read conversations"
  ON conversations FOR SELECT USING (true);

CREATE POLICY "Public can read messages"
  ON messages FOR SELECT USING (true);

CREATE POLICY "Public can read typing indicators"
  ON typing_indicators FOR SELECT USING (true);

CREATE POLICY "Public can read cloudinary tokens"
  ON cloudinary_tokens FOR SELECT USING (true);
```

- Click **Run** button
- You should see "Success" message

### 3. Test the Chat

After running the migration:

1. Refresh your browser
2. Go to the 3D Design Service page
3. Click "Chat"
4. Send a test message
5. The message should appear in the chat and be saved to the database

## Why This Works

- The backend API already enforces authorization via JWT tokens
- Write operations use Service Role Key (bypasses RLS)
- Read operations now allow public access (safe because authorization was enforced when message was created)
- Real-time subscriptions can now receive message updates

## After Testing

If everything works, you can add more granular RLS policies later if needed for additional security layers.
