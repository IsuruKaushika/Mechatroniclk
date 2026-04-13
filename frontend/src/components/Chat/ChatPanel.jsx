import React, { useState, useEffect, useRef } from "react";
import useChat from "../../hooks/useChat";
import ChatHeader from "./ChatHeader";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";
import MessageList from "./MessageList";

const ChatPanel = ({ conversationId, sellerId, sellerName, onClose, currentUserId, token }) => {
  const {
    messages,
    isLoading,
    isSending,
    unreadCount,
    typingUsers,
    sendMessage,
    markAllAsRead,
    setTypingIndicator,
  } = useChat(conversationId, currentUserId, token);

  const messageListRef = useRef(null);
  const isMarkingReadRef = useRef(false);
  const hasInitialScrollRef = useRef(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [scrollUnreadCount, setScrollUnreadCount] = useState(0);

  // Reset initial scroll state when opening a different conversation
  useEffect(() => {
    hasInitialScrollRef.current = false;
  }, [conversationId]);

  // On first load, always open at the latest message (bottom)
  useEffect(() => {
    if (!messageListRef.current || isLoading || hasInitialScrollRef.current) return;

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    setShowScrollButton(false);
    hasInitialScrollRef.current = true;
  }, [isLoading, messages]);

  // Auto-scroll only if user is already near the bottom.
  useEffect(() => {
    if (!hasInitialScrollRef.current) return;
    if (!messageListRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const isNearBottom = distanceFromBottom < 120;

    if (isNearBottom) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Track scroll position for scroll button visibility
  const handleScroll = () => {
    if (!messageListRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const isNearBottom = distanceFromBottom < 120;

    if (!isNearBottom) {
      const unread = messages.filter(
        (msg) => !msg.is_read && msg.sender_id !== currentUserId,
      ).length;
      setScrollUnreadCount(unread);
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      setShowScrollButton(false);
    }
  };

  // Mark messages as read when chat opens
  useEffect(() => {
    markAllAsRead();
  }, [conversationId, markAllAsRead]);

  // Keep unread state in sync while the panel stays open.
  useEffect(() => {
    if (!unreadCount || isMarkingReadRef.current) return;

    isMarkingReadRef.current = true;
    Promise.resolve(markAllAsRead()).finally(() => {
      isMarkingReadRef.current = false;
    });
  }, [unreadCount, markAllAsRead]);

  const handleSendMessage = async (content, mediaUrl, mediaType, fileName, fileSize) => {
    await sendMessage(content, mediaUrl, mediaType, fileName, fileSize);
  };

  const handleTyping = async () => {
    await setTypingIndicator();
  };

  const isSellerTyping = typingUsers.some((userId) => userId === sellerId);

  return (
    <>
      {/* Mobile backdrop - closes chat when clicked */}
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Chat Panel */}
      <div className="fixed inset-0 z-50 flex flex-col bg-white lg:fixed md:inset-auto md:w-96 md:h-5/6 md:left-6 md:top-[96px] md:border-l md:border-slate-200 md:shadow-lg md:rounded-lg">
        {/* Header */}
        <ChatHeader sellerName={sellerName} onClose={onClose} />

        {/* Message List */}
        <MessageList
          ref={messageListRef}
          messages={messages}
          isLoading={isLoading}
          currentUserId={currentUserId}
          onScroll={handleScroll}
        />

        {/* Scroll to Bottom Button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 right-4 flex items-center justify-center gap-1 rounded-full bg-[#1dbf73] text-white shadow-lg hover:bg-[#19a463] p-3 transition md:bottom-28"
            aria-label="Scroll to bottom"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            {scrollUnreadCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-bold text-white">
                {scrollUnreadCount > 99 ? "99+" : scrollUnreadCount}
              </span>
            )}
          </button>
        )}

        {/* Typing Indicator */}
        {isSellerTyping && <TypingIndicator sellerName={sellerName} />}

        {/* Input Area */}
        <InputArea
          onSendMessage={handleSendMessage}
          isSending={isSending}
          onTyping={handleTyping}
          token={token}
        />
      </div>
    </>
  );
};

export default ChatPanel;
