import React from 'react';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const ConversationList = ({ conversations, selectedId, onSelect, loading }) => {

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center text-gray-400">
          <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-sm font-medium">No conversations yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h2 className="font-semibold text-gray-900">Conversations</h2>
        <p className="text-xs text-gray-500 mt-1">{conversations.length} active</p>
      </div>

      <div className="divide-y divide-gray-100">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation)}
            className={`w-full px-4 py-3 text-left transition ${
              selectedId === conversation.id
                ? 'bg-blue-50 border-l-4 border-blue-500'
                : 'hover:bg-gray-50'
            }`}
          >
            {/* Customer Name */}
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-gray-900">
                {conversation.customer_name || conversation.buyer_id.substring(0, 8) + '...'}
              </h3>
              <span className="text-xs text-gray-400">
                {formatTime(conversation.updated_at)}
              </span>
            </div>

            {/* Service Name */}
            <p className="text-xs text-gray-500 mt-1">
              {conversation.service_name}
            </p>

            {/* Last Message Preview */}
            {conversation.messages && conversation.messages.length > 0 && (
              <p className="text-xs text-gray-600 mt-2 truncate">
                {conversation.messages[conversation.messages.length - 1].content || '📎 Attachment'}
              </p>
            )}

            {/* Unread Indicator */}
            {(() => {
              const unreadCount = conversation.messages?.filter((m) => !m.is_read && m.sender_id !== conversation.seller_id).length || 0;
              return unreadCount > 0 ? (
                <div className="mt-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-500 text-white text-xs font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              ) : null;
            })()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;
