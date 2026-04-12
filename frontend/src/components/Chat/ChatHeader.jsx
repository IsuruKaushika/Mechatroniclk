import React from "react";

const ChatHeader = ({ sellerName, onClose }) => {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-slate-900">{sellerName}</h3>
        <p className="text-xs text-slate-500">3D Design Service</p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        aria-label="Close chat"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default ChatHeader;
