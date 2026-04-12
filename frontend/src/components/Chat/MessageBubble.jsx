import React from "react";

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  // Add 5 hours and 30 minutes offset
  const adjustedDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);

  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / 86400000);

  // Format time using browser's timezone
  const timeStr = adjustedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // For today, show just time
  if (diffDays === 0) {
    return timeStr;
  }

  // For messages from yesterday or older, show date and time
  const dateStr = adjustedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: adjustedDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });

  return `${dateStr} ${timeStr}`;
};

const MessageBubble = ({ message, isOwn, showAvatar }) => {
  const isImage = message.media_type === "image" && message.media_url;

  return (
    <div className={`flex items-start gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar (reserve space so message alignment doesn't jump) */}
      {!isOwn && (
        <div
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            showAvatar ? "visible" : "invisible"
          }`}
          aria-hidden={!showAvatar}
        >
          <img
            src={`../src/assets/logo.png`}
            alt="Avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex max-w-xs flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwn ? "bg-[#1dbf73] text-white" : "bg-slate-100 text-slate-900"
          }`}
        >
          {/* Text Content */}
          {message.content && <p className="text-sm leading-[1.4]">{message.content}</p>}

          {/* Image Content */}
          {isImage && (
            <div className="mt-2">
              <img
                src={message.media_url}
                alt="Shared media"
                className="max-h-48 max-w-xs rounded-md"
              />
            </div>
          )}

          {/* File Content */}
          {message.media_type === "file" && message.media_url && (
            <a
              href={message.media_url}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                isOwn
                  ? "bg-white bg-opacity-20 hover:bg-opacity-30"
                  : "bg-slate-200 hover:bg-slate-300"
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-4l-8 8m0 0l4-4m-4 4h8"
                />
              </svg>
              {message.file_name || "Download file"}
            </a>
          )}
        </div>

        {/* Timestamp + Read Status */}
        <div
          className={`mt-1 flex items-center gap-1 text-xs ${isOwn ? "flex-row-reverse" : "flex-row"} text-slate-400`}
        >
          <span>{formatTime(message.created_at)}</span>
          {isOwn && <span className="text-blue-500">{message.is_read ? "✓✓" : "✓"}</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
