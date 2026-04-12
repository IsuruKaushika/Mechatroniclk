import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../utils/supabase";

/**
 * Custom hook for admin chat functionality
 * Similar to useChat but adapted for admin use
 * Manages messages, typing indicators, and real-time subscriptions
 * @param {string} conversationId - The conversation ID
 * @param {string} adminId - The admin user ID
 * @param {string} token - Authentication token
 * @param {string} backendUrl - Backend API URL
 */
export const useAdminChat = (conversationId, adminId, token, backendUrl) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef(null);

  // Load initial message history
  const loadMessages = useCallback(async () => {
    if (!conversationId || !adminId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (err) {
        throw err;
      }

      setMessages(data || []);

      const unread = (data || []).filter((msg) => !msg.is_read && msg.sender_id !== adminId).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, adminId]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!conversationId || !adminId) return;

    // Load messages immediately
    loadMessages();

    // Create a unique channel name for this conversation
    const messageChannel = `msg_${conversationId}`;
    const typingChannel = `typ_${conversationId}`;

    let messageSubscription;
    let typingSubscription;
    let pollInterval;

    // Set up subscriptions with proper error handling
    try {
      // Subscribe to new messages - ensure all .on() calls before .subscribe()
      messageSubscription = supabase
        .channel(messageChannel, { config: { broadcast: { self: true } } })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            console.log("� Admin real-time event:", payload.eventType, {
              messageId: payload.new?.id || payload.old?.id,
              sender: payload.new?.sender_id || payload.old?.sender_id,
              content: payload.new?.content?.substring(0, 30) || "...",
            });

            if (payload.eventType === "INSERT") {
              setMessages((prev) => {
                // Check if message already exists to avoid duplicates
                if (prev.find((msg) => msg.id === payload.new.id)) {
                  return prev;
                }
                return [...prev, payload.new];
              });

              // Update unread count if message is from customer
              if (payload.new.sender_id !== adminId) {
                setUnreadCount((prev) => prev + 1);
              }
            } else if (payload.eventType === "UPDATE") {
              setMessages((prev) =>
                prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg)),
              );
            } else if (payload.eventType === "DELETE") {
              setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
            }
          },
        )
        .subscribe();

      // Subscribe to typing indicators - separate channel
      typingSubscription = supabase
        .channel(typingChannel, { config: { broadcast: { self: true } } })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "typing_indicators",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setTypingUsers((prev) => [
                ...prev.filter((u) => u !== payload.new.user_id),
                payload.new.user_id,
              ]);
            } else if (payload.eventType === "DELETE") {
              setTypingUsers((prev) => prev.filter((u) => u !== payload.old.user_id));
            }
          },
        )
        .subscribe();

      // Fallback polling mechanism - check for new messages every 300ms (faster)
      // Critical for catching customer messages when real-time subscription fails
      pollInterval = setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("conversation_id", conversationId)
            .order("created_at", { ascending: true });

          if (error) {
            throw error;
          }

          setMessages((prev) => {
            if (!data) {
              return prev;
            }

            if (data.length === 0) {
              return prev;
            }

            // Check if count changed
            if (data.length !== prev.length) {
              return data;
            }

            // Also check by comparing all IDs to catch modifications/deletes
            const prevIds = prev.map((m) => m.id);
            const newIds = data.map((m) => m.id);

            if (JSON.stringify(prevIds) !== JSON.stringify(newIds)) {
              return data;
            }

            // No changes detected
            return prev;
          });
        } catch (err) {
          // Polling error - silently continue
        }
      }, 300);
    } catch (err) {
      console.error("Error setting up subscriptions:", err);
    }

    return () => {
      if (messageSubscription) {
        messageSubscription.unsubscribe();
      }
      if (typingSubscription) {
        typingSubscription.unsubscribe();
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [conversationId, adminId]);

  // Send a message via backend API
  const sendMessage = useCallback(
    async (content, mediaUrl = null, mediaType = null, fileName = null, fileSize = null) => {
      if (!conversationId || !content.trim()) {
        setError("Message content is required");
        return null;
      }

      if (!token) {
        setError("Authentication required");
        return null;
      }

      try {
        setIsSending(true);

        const response = await fetch(`${backendUrl}/api/chat/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            content,
            media_url: mediaUrl,
            media_type: mediaType,
            file_name: fileName,
            file_size: fileSize,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const data = await response.json();

        // Immediately add message to state (optimistic update)
        if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }

        // Clear typing indicator
        setIsTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        return data.message;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, token, backendUrl],
  );

  // Mark all messages as read
  const markAllAsRead = useCallback(async () => {
    const unreadMessages = messages.filter((msg) => !msg.is_read && msg.sender_id !== adminId);

    if (unreadMessages.length === 0) return;

    try {
      await Promise.all(
        unreadMessages.map((msg) =>
          fetch(`${backendUrl}/api/chat/messages/${msg.id}/read`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }),
        ),
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [messages, adminId, token, backendUrl]);

  // Set typing indicator
  const setTypingIndicator = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      setIsTyping(true);

      await fetch(`${backendUrl}/api/chat/typing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
        }),
      });

      // Clear typing status after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
    } catch (err) {
      console.error("Error setting typing indicator:", err);
    }
  }, [conversationId, token, backendUrl]);

  return {
    messages,
    isLoading,
    error,
    isSending,
    isTyping,
    typingUsers,
    unreadCount,
    sendMessage,
    markAllAsRead,
    setTypingIndicator,
  };
};

export default useAdminChat;
