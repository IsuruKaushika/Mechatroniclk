#!/bin/bash
# Chat Feature Quick Setup Checklist
# Follow these steps in order

echo "🚀 Real-Time Chat Setup Checklist"
echo "=================================="
echo ""

# Step 1
echo "✅ Step 1: Add Chat Route to Backend"
echo "   File: backend/server.js"
echo "   Add: import chatRoute from './routes/chatRoute.js'"
echo "   Add: app.use('/api/chat', chatRoute)"
echo ""

# Step 2
echo "✅ Step 2: Create Supabase Tables"
echo "   - Go to: https://supabase.com/dashboard"
echo "   - Select your project"
echo "   - Go to: SQL Editor"
echo "   - Run SQL from: backend/migrations/001_create_chat_schema.sql"
echo "   - Verify tables created: conversations, messages, typing_indicators, cloudinary_tokens"
echo ""

# Step 3
echo "✅ Step 3: Create Cloudinary Upload Preset"
echo "   - Go to: https://cloudinary.com/console"
echo "   - Settings → Upload → Upload presets"
echo "   - Create preset named: mechatroniclk_chat"
echo "   - Settings: Unsigned upload (ON), Folder: mechatroniclk/chat"
echo ""

# Step 4
echo "✅ Step 4: Configure Environment Variables"
echo ""
echo "   Frontend (.env.local in frontend/ folder):"
echo "   VITE_SUPABASE_URL=your_supabase_url"
echo "   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key"
echo "   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name"
echo "   VITE_CLOUDINARY_API_KEY=your_api_key"
echo ""
echo "   Backend (.env in backend/ folder):"
echo "   CLOUDINARY_API_SECRET=your_api_secret"
echo "   CLOUDINARY_UPLOAD_PRESET=mechatroniclk_chat"
echo ""

# Step 5
echo "✅ Step 5: Create Seller Account"
echo "   Go to Supabase Auth, create user or note seller ID:"
echo "   - Email: seller@mechatroniclk.com"
echo "   - ID: mechatroniclk-studio (or update ChatButton component)"
echo ""

# Step 6
echo "✅ Step 6: Start Services"
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""

# Step 7
echo "✅ Step 7: Test Chat"
echo "   1. Go to http://localhost:5173"
echo "   2. Sign in/Create account"
echo "   3. Navigate to '3D Design Service' page"
echo "   4. Scroll to bottom section 'Need a custom offer'"
echo "   5. Click 'Chat' button"
echo "   6. Send test message"
echo ""

echo "✅ All done! Chat feature is now live!"
echo ""
echo "📚 For detailed setup guide, see: CHAT_IMPLEMENTATION_GUIDE.md"
