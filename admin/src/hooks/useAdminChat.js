import { useEffect, useState, useCallback, useRef } from "react";

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
  const [isPageVisible, setIsPageVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible",
  );
  const typingTimeoutRef = useRef(null);
  const lastSyncRef = useRef(null);
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const mergeMessages = useCallback((existing, incoming) => {
    const byId = new Map((existing || []).map((message) => [message.id, message]));

    for (const message of incoming || []) {
      if (message?.id) {
        byId.set(message.id, message);
      }
    }

    return Array.from(byId.values()).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, []);

  const updateLastSync = useCallback((incomingMessages) => {
    if (!incomingMessages || incomingMessages.length === 0) return;

    const latest = incomingMessages.reduce((latestSoFar, message) => {
      const value = message.updated_at || message.created_at;
      if (!value) return latestSoFar;
      if (!latestSoFar) return value;
      return new Date(value).getTime() > new Date(latestSoFar).getTime() ? value : latestSoFar;
    }, null);

    if (latest) {
      lastSyncRef.current = latest;
    }
  }, []);

  useEffect(() => {
    if (!conversationId || !adminId) return;
    lastSyncRef.current = null;
    setMessages([]);
  }, [conversationId, adminId]);

  // Load initial message history
  const loadMessages = useCallback(
    async (options = {}) => {
      const { silent = false } = options;

      if (!conversationId || !adminId || !token) {
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }
        setError(null);

        const url = new URL(`${backendUrl}/api/chat/conversations/${conversationId}/messages`);
        if (silent && lastSyncRef.current) {
          url.searchParams.set("since", lastSyncRef.current);
        }

        const response = await fetch(url.toString(), {
          headers: {
            token,
          },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || payload.message || "Failed to load messages");
        }

        setMessages((previousMessages) =>
          silent ? mergeMessages(previousMessages, payload.messages || []) : payload.messages || [],
        );

        updateLastSync(payload.messages || []);
        setTypingUsers(payload.typingUsers || []);
        setUnreadCount(
          typeof payload.unreadCount === "number"
            ? payload.unreadCount
            : (payload.messages || []).filter((msg) => !msg.is_read && msg.sender_id !== adminId)
                .length,
        );
      } catch (err) {
        console.error("Error loading messages:", err);
        setError(err.message);
      } finally {
        if (!silent) {
          setIsLoading(false);
        }
      }
    },
    [conversationId, adminId, token, backendUrl, mergeMessages, updateLastSync],
  );

  // Poll message history through the backend so the browser never reads Supabase directly
  useEffect(() => {
    if (!conversationId || !adminId || !token) return;

    // Load messages immediately
    loadMessages();

    const pollInterval = setInterval(
      () => {
        loadMessages({ silent: true });
      },
      isPageVisible ? 2000 : 10000,
    );

    return () => {
      clearInterval(pollInterval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversationId, adminId, token, loadMessages, isPageVisible]);

  // Send a message via backend API
  const sendMessage = useCallback(
    async (content, mediaUrl = null, mediaType = null, fileName = null, fileSize = null) => {
      const hasText = Boolean(content?.trim());
      const hasAttachment = Boolean(mediaUrl);

      if (!conversationId || (!hasText && !hasAttachment)) {
        setError("Message content or attachment is required");
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
    if (!conversationId || !token) return;

    try {
      const response = await fetch(`${backendUrl}/api/chat/conversations/${conversationId}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to mark conversation as read: ${response.statusText}`);
      }

      await loadMessages({ silent: true });
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  }, [conversationId, token, backendUrl, loadMessages]);

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

      // Clear typing status after 2 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
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
