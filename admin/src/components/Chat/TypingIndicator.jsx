import React from "react";

const TypingIndicator = ({ sellerName }) => {
  return (
    <div className="px-6 py-2 text-xs text-gray-500">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
          <span
            className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <span
            className="inline-block h-2 w-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <span>{sellerName} is typing...</span>
      </div>
    </div>
  );
};

export default TypingIndicator;
