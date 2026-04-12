import React, { useState, useEffect, useRef } from 'react'
import useChat from '../../hooks/useChat'
import ChatHeader from './ChatHeader'
import InputArea from './InputArea'
import TypingIndicator from './TypingIndicator'
import MessageList from './MessageList'

const ChatPanel = ({ conversationId, sellerId, sellerName, onClose, currentUserId, token }) => {
  const { messages, isLoading, isSending, typingUsers, sendMessage, markAllAsRead, setTypingIndicator } =
    useChat(conversationId, currentUserId, token)

  const messageListRef = useRef(null)

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  // Mark messages as read when chat opens
  useEffect(() => {
    markAllAsRead()
  }, [conversationId, markAllAsRead])

  const handleSendMessage = async (content, mediaUrl, mediaType, fileName, fileSize) => {
    await sendMessage(content, mediaUrl, mediaType, fileName, fileSize)
  }

  const handleTyping = async () => {
    await setTypingIndicator()
  }

  const isSellerTyping = typingUsers.some((userId) => userId === sellerId)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white md:w-96 md:h-5/6 md:border-l md:top-[96px] md:border-slate-200 md:shadow-lg md:rounded-lg md:left-6">
      {/* Header */}
      <ChatHeader sellerName={sellerName} onClose={onClose} />

      {/* Message List */}
      <MessageList ref={messageListRef} messages={messages} isLoading={isLoading} currentUserId={currentUserId} />

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
  )
}

export default ChatPanel
