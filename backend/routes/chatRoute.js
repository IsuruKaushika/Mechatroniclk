import express from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { mongoIdToUUID } from "../utils/uuidConverter.js";

const router = express.Router();

// Middleware to verify user is authenticated using JWT (same as rest of app)
const authMiddleware = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // MongoDB user ID
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

/**
 * POST /api/chat/upload-token
 * Generate upload configuration for Cloudinary
 * Returns cloudName and uploadPreset for unsigned uploads
 */
router.post("/upload-token", authMiddleware, async (req, res) => {
  try {
    const cloudinaryCloudName = process.env.CLOUDINARY_CHAT_NAME;
    const cloudinaryUploadPreset =
      process.env.CLOUDINARY_CHAT_UPLOAD_PRESET || "mechatroniclk_chat";

    if (!cloudinaryCloudName) {
      console.error("  ❌ Cloudinary cloud name missing");
      return res.status(500).json({ error: "Cloudinary configuration missing" });
    }

    res.json({
      cloudName: cloudinaryCloudName,
      uploadPreset: cloudinaryUploadPreset,
      folder: `mechatroniclk/chat/${req.userId}`,
    });
  } catch (error) {
    console.error("❌ Error generating upload token:", error);
    res.status(500).json({ error: "Failed to generate upload token" });
  }
});

/**
 * POST /api/chat/messages
 * Send a chat message
 */
router.post("/messages", authMiddleware, async (req, res) => {
  try {
    const { conversation_id, content, media_url, media_type, file_name, file_size } = req.body;

    if (!conversation_id || (!content && !media_url)) {
      console.error("  ❌ Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Convert to UUID regardless of format (email or ObjectID)
    // This ensures consistency in the database
    const senderId = mongoIdToUUID(req.userId);

    // Verify user is part of this conversation
    const { data: conversation, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversation_id)
      .single();

    if (convError || !conversation) {
      console.error("  ❌ Conversation not found or error:", convError);
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.buyer_id !== senderId && conversation.seller_id !== senderId) {
      console.error("  ❌ User not authorized for this conversation");
      return res.status(403).json({ error: "Not authorized to message in this conversation" });
    }

    // Insert the message
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id,
        sender_id: senderId,
        content,
        media_url: media_url || null,
        media_type: media_type || null,
        file_name: file_name || null,
        file_size: file_size || null,
      })
      .select()
      .single();

    if (msgError) {
      console.error("  ❌ Message insert error:", msgError);
      return res.status(500).json({ error: "Failed to send message", details: msgError.message });
    }

    res.json({ success: true, message });
  } catch (error) {
    console.error("❌ Error sending message:", error);
    res.status(500).json({ error: "Failed to send message", details: error.message });
  }
});

/**
 * GET /api/chat/conversations/:userId
 * Get all conversations for a user (or admin)
 */
router.get("/conversations/:userId", authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Convert to UUID regardless of format (email or ObjectID)
    // This ensures consistency in the database
    let userUUID = mongoIdToUUID(req.userId);

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select(
        `
        *,
        messages(id, content, sender_id, created_at, is_read)
      `,
      )
      .or(`buyer_id.eq.${userUUID},seller_id.eq.${userUUID}`)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("  ❌ Supabase error:", error);
      throw error;
    }

    res.json(conversations);
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

/**
 * POST /api/chat/conversations
 * Create a new conversation with a seller
 */
router.post("/conversations", authMiddleware, async (req, res) => {
  try {
    const { sellerId, serviceId, serviceName } = req.body;

    if (!sellerId) {
      return res.status(400).json({ error: "Seller ID required" });
    }

    // Convert MongoDB ObjectID to UUID for Supabase
    const buyerIdUUID = mongoIdToUUID(req.userId);

    // Check if conversation already exists
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .eq("buyer_id", buyerIdUUID)
      .eq("seller_id", sellerId)
      .single();

    if (existing) {
      return res.json(existing);
    }

    // Create new conversation
    const { data: conversation, error } = await supabase
      .from("conversations")
      .insert({
        buyer_id: buyerIdUUID,
        seller_id: sellerId,
        service_id: serviceId,
        service_name: serviceName || "3D Design Service",
      })
      .select()
      .single();

    if (error) {
      console.error("  ❌ Error creating conversation:", error);
      throw error;
    }

    res.json(conversation);
  } catch (error) {
    console.error("❌ Error creating conversation:", error);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

/**
 * PUT /api/chat/messages/:messageId/read
 * Mark a message as read
 */
router.put("/messages/:messageId/read", authMiddleware, async (req, res) => {
  try {
    // Convert to UUID regardless of format (email or ObjectID)
    const userId = mongoIdToUUID(req.userId);

    const { data: message, error: msgError } = await supabase
      .from("messages")
      .select("conversation_id")
      .eq("id", req.params.messageId)
      .single();

    if (msgError || !message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Verify authorization
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", message.conversation_id)
      .single();

    if (!conversation || (conversation.buyer_id !== userId && conversation.seller_id !== userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { data: updated, error } = await supabase
      .from("messages")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", req.params.messageId)
      .select()
      .single();

    if (error) throw error;

    res.json(updated);
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

/**
 * POST /api/chat/typing
 * Set typing indicator for a conversation
 */
router.post("/typing", authMiddleware, async (req, res) => {
  try {
    const { conversation_id } = req.body;

    if (!conversation_id) {
      return res.status(400).json({ error: "Conversation ID required" });
    }

    // Convert to UUID regardless of format (email or ObjectID)
    const userId = mongoIdToUUID(req.userId);

    // Verify user is part of conversation
    const { data: conversation } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversation_id)
      .single();

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Upsert typing indicator (expires in 5 seconds)
    const { error } = await supabase.from("typing_indicators").insert({
      conversation_id,
      user_id: userId,
      expires_at: new Date(Date.now() + 5000).toISOString(),
    });

    // Ignore duplicate key errors (user is re-typing)
    if (error && !error.message.includes("duplicate")) {
      throw error;
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error setting typing indicator:", error);
    res.status(500).json({ error: "Failed to set typing indicator" });
  }
});

/**
 * DELETE /api/chat/typing
 * Clear typing indicator for a conversation
 */
router.delete("/typing", authMiddleware, async (req, res) => {
  try {
    const { conversation_id } = req.body;

    if (!conversation_id) {
      return res.status(400).json({ error: "Conversation ID required" });
    }

    // Convert to UUID regardless of format (email or ObjectID)
    const userId = mongoIdToUUID(req.userId);

    const { error } = await supabase
      .from("typing_indicators")
      .delete()
      .eq("conversation_id", conversation_id)
      .eq("user_id", userId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing typing indicator:", error);
    res.status(500).json({ error: "Failed to clear typing indicator" });
  }
});

export default router;
