import React, { forwardRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = forwardRef(({ messages, isLoading, currentUserId }, ref) => {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="space-y-3 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-sm text-gray-500">No messages yet</p>
          <p className="text-xs text-gray-400">Start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50 px-6 py-4"
      style={{ scrollBehavior: "smooth" }}
    >
      <div className="flex flex-col gap-3">
        {messages.map((message, index) => {
          const isOwnMessage = message.sender_id === currentUserId;
          const showAvatar =
            index === 0 ||
            messages[index - 1].sender_id !== message.sender_id ||
            new Date(messages[index - 1].created_at).getTime() -
              new Date(message.created_at).getTime() >
              3600000;

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwnMessage}
              showAvatar={showAvatar}
            />
          );
        })}
      </div>
    </div>
  );
});

MessageList.displayName = "MessageList";

export default MessageList;
