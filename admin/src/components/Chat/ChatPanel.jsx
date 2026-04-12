import React, { useState, useEffect, useRef } from "react";
import { useAdminChat } from "../../hooks/useAdminChat";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";

const ChatPanel = ({
  conversationId,
  customerId,
  customerName,
  currentUserId,
  token,
  backendUrl,
  onClose,
}) => {
  const {
    messages,
    isLoading,
    isSending,
    typingUsers,
    sendMessage,
    markAllAsRead,
    setTypingIndicator,
  } = useAdminChat(conversationId, currentUserId, token, backendUrl);

  const messageListRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark messages as read when chat opens
  useEffect(() => {
    markAllAsRead();
  }, [conversationId, markAllAsRead]);

  const handleSendMessage = async (content, mediaUrl, mediaType, fileName, fileSize) => {
    await sendMessage(content, mediaUrl, mediaType, fileName, fileSize);
  };

  const handleTyping = async () => {
    await setTypingIndicator();
  };

  const isCustomerTyping = typingUsers.some((userId) => userId === customerId);

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{customerName}</h3>
          <p className="text-xs text-gray-500">Customer ID: {customerId.substring(0, 8)}...</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close chat"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Message List */}
      <MessageList
        ref={messageListRef}
        messages={messages}
        isLoading={isLoading}
        currentUserId={currentUserId}
      />

      {/* Typing Indicator */}
      {isCustomerTyping && <TypingIndicator sellerName={customerName} />}

      {/* Input Area */}
      <InputArea
        onSendMessage={handleSendMessage}
        isSending={isSending}
        onTyping={handleTyping}
        token={token}
      />
    </div>
  );
};

export default ChatPanel;
