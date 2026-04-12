import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../utils/supabase";

/**
 * Custom hook for real-time chat functionality
 * Manages messages, typing indicators, and real-time subscriptions
 * Backend handles MongoDB to UUID conversion
 */
export const useChat = (conversationId, userId, token) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const typingTimeoutRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Load initial message history
  const loadMessages = useCallback(async () => {
    if (!conversationId || !userId) return;

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      // NOTE: Removed .limit(50) to load ALL messages in conversation

      if (err) throw err;

      setMessages(data || []);

      // Count unread messages for current user (messages sent by other person)
      // Backend converts userId to UUID, so we compare UUIDs from Supabase
      const unread = (data || []).filter((msg) => !msg.is_read && msg.sender_id !== userId).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error loading messages:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, userId]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!conversationId || !userId) return;

    // Load messages immediately
    loadMessages();

    // Create unique channel names
    const messageChannel = `msg_${conversationId}`;
    const typingChannel = `typ_${conversationId}`;

    let messageSubscription;
    let typingSubscription;
    let pollInterval;
    let isActive = true;

    // Set up subscriptions with proper error handling
    const setupSubscriptions = async () => {
      try {
        // Remove any stale channels for this conversation before creating new ones.
        // This avoids duplicate postgres_changes registration when the hook remounts.
        const staleChannels = supabase
          .getChannels()
          .filter((channel) => channel.topic === messageChannel || channel.topic === typingChannel);

        await Promise.all(staleChannels.map((channel) => supabase.removeChannel(channel)));

        if (!isActive) return;

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
              if (payload.eventType === "INSERT") {
                setMessages((prev) => {
                  // Check if message already exists to avoid duplicates
                  if (prev.find((msg) => msg.id === payload.new.id)) {
                    return prev;
                  }
                  return [...prev, payload.new];
                });

                // Update unread count if message is from other user
                if (payload.new.sender_id !== userId) {
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

        // Fallback polling mechanism - check for new messages every 300ms
        pollInterval = setInterval(async () => {
          try {
            const { data, error } = await supabase
              .from("messages")
              .select("*")
              .eq("conversation_id", conversationId)
              .order("created_at", { ascending: true });

            if (error) throw error;

            setMessages((prev) => {
              if (!data || data.length === 0) return prev;

              // Simply check if we have a different number of messages
              if (data.length !== prev.length) {
                return data;
              }

              // Also check by comparing all IDs to catch modifications/deletes
              const prevIds = prev.map((m) => m.id);
              const newIds = data.map((m) => m.id);

              if (JSON.stringify(prevIds) !== JSON.stringify(newIds)) {
                return data;
              }

              return prev;
            });
          } catch (err) {
            // Silently continue polling even on errors
          }
        }, 300);
      } catch (err) {
        console.error("Error setting up subscriptions:", err);
      }
    };

    setupSubscriptions();

    return () => {
      isActive = false;
      if (messageSubscription) {
        messageSubscription.unsubscribe();
        supabase.removeChannel(messageSubscription);
      }
      if (typingSubscription) {
        typingSubscription.unsubscribe();
        supabase.removeChannel(typingSubscription);
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [conversationId, userId]);

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
        await clearTypingIndicator();

        return data;
      } catch (err) {
        console.error("Error sending message:", err);
        setError(err.message);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, token, backendUrl],
  );

  // Mark message as read via backend API
  const markAsRead = useCallback(
    async (messageId) => {
      if (!token) return;

      try {
        const response = await fetch(`${backendUrl}/api/chat/messages/${messageId}/read`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to mark as read: ${response.statusText}`);
        }

        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Error marking message as read:", err);
      }
    },
    [token, backendUrl],
  );

  // Mark all messages as read in conversation
  const markAllAsRead = useCallback(async () => {
    try {
      const unreadMessages = messages.filter((msg) => !msg.is_read && msg.sender_id !== userId);

      for (const msg of unreadMessages) {
        await markAsRead(msg.id);
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  }, [messages, userId, markAsRead]);

  // Set typing indicator via backend API
  const setTypingIndicator = useCallback(async () => {
    try {
      if (isTyping) return; // Already set

      if (!token) return;

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

      // Clear after 4 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        clearTypingIndicator();
      }, 4000);
    } catch (err) {
      console.error("Error setting typing indicator:", err);
    }
  }, [conversationId, token, backendUrl, isTyping]);

  // Clear typing indicator via backend API
  const clearTypingIndicator = useCallback(async () => {
    try {
      if (!token) return;

      setIsTyping(false);

      await fetch(`${backendUrl}/api/chat/typing`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          conversation_id: conversationId,
        }),
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    } catch (err) {
      console.error("Error clearing typing indicator:", err);
    }
  }, [conversationId, token, backendUrl]);

  return {
    messages,
    isLoading,
    error,
    isSending,
    unreadCount,
    typingUsers,
    sendMessage,
    markAsRead,
    markAllAsRead,
    setTypingIndicator,
    clearTypingIndicator,
    loadMessages,
  };
};

export default useChat;
