# Cloudinary Upload Preset Setup

## Error: Upload preset not found

Your Cloudinary account doesn't have the `mechatroniclk_chat` upload preset configured.

## Step-by-Step: Create Unsigned Upload Preset

### 1. Go to Cloudinary Dashboard
- Open: https://cloudinary.com/console
- Log in with your account
- Click on your cloud name: **dgoqpqgda**

### 2. Navigate to Upload Presets
- Left sidebar: Click **Settings** ⚙️
- Click **Upload** tab
- Scroll down to **Upload presets** section

### 3. Create New Preset
- Click **Add upload preset** button

### 4. Fill in the Details

**Name:** `mechatroniclk_chat`

**Settings to enable:**
- ✅ Unsigned (REQUIRED for browser uploads)
- Folder: `mechatroniclk/chat` (optional but recommended)
- Resource type: Auto
- Quality: Auto (or your preference)

**Optional (recommended):**
- File size limit: 10 MB
- Allowed file types: Images and files (or specific types)

### 5. Save
- Click **Save** button
- You should see success confirmation

### 6. Test Upload
1. Refresh your browser: `http://localhost:5173`
2. Navigate to Service3D page
3. Open chat and attach a file
4. Upload should now work! ✅

---

## If You Already Have an Upload Preset

If you have another unsigned upload preset already configured, update your `.env` file:

```env
# Change this line to your existing preset name:
CLOUDINARY_CHAT_UPLOAD_PRESET=your_existing_preset_name
```

Then restart the backend server.

---

## Verification Checklist

After creating the preset:

- [ ] Preset name is exactly `mechatroniclk_chat` (case matters!)
- [ ] **Unsigned** is enabled (required for browser uploads)
- [ ] Saved successfully in Cloudinary
- [ ] Backend restarted (or just refresh, it reads from env on each request)
- [ ] Browser refreshed (Ctrl+F5)

---

## Still Having Issues?

**Common problems:**

1. **Preset name mismatch** - Check spelling in Cloudinary and in `.env`
   - Preset name: `mechatroniclk_chat`
   - In file: `CLOUDINARY_CHAT_UPLOAD_PRESET=mechatroniclk_chat`

2. **Unsigned not enabled** - It MUST be set to Unsigned for these browser uploads

3. **Cloud name mismatch** - Your cloud name is `dgoqpqgda`
   - Check: `CLOUDINARY_CHAT_NAME=dgoqpqgda` in `.env`

4. **Capitalization** - Cloudinary keys are usually lowercase

Try uploading a file from your Cloudinary account settings page to verify the preset works, then test in chat.

---

## For Production

Before going to production:
- Limit file types (only allow images/documents you want)
- Set file size limits (currently 10MB in frontend)
- Add access controls if needed
- Monitor uploads in Cloudinary Media Library
