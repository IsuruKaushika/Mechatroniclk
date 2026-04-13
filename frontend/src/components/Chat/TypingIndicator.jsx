import React from "react";

const TypingIndicator = ({ sellerName }) => {
  return (
    <div className="flex gap-2 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex h-6 w-6 items-center justify-center rounded-full">
        <img
          src={`../src/assets/logo.png`}
          alt={sellerName}
          className="h-6 w-6 rounded-full object-cover"
        />
      </div>

      <div className="flex items-center gap-1">
        <p className="text-sm text-slate-600">is typing</p>

        {/* Animated dots */}
        <div className="flex gap-0.5">
          <span
            className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "0s" }}
          />
          <span
            className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "0.2s" }}
          />
          <span
            className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: "0.4s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
