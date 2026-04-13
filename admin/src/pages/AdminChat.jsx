import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import ConversationList from "../components/Chat/ConversationList";
import ChatPanel from "../components/Chat/ChatPanel";
import { BsChatSquareDots } from "react-icons/bs";

const AdminChat = ({ token, backendUrl }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState(null);
  const [isPageVisible, setIsPageVisible] = useState(
    typeof document === "undefined" ? true : document.visibilityState === "visible",
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Get admin ID from JWT token
  useEffect(() => {
    if (!token) {
      setError("Please log in first");
      return;
    }

    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      setAdminId(payload.id);
      console.log("Admin email:", payload.id);
    } catch (err) {
      console.error("Failed to decode token:", err);
      setError("Invalid token");
    }
  }, [token]);

  // Fetch conversations
  useEffect(() => {
    if (!adminId || !token) return;

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/chat/conversations/${adminId}`, {
          headers: { token },
        });

        if (Array.isArray(response.data)) {
          setConversations(response.data);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        toast.error("Failed to load conversations");
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Refresh every 5 seconds
    const interval = setInterval(fetchConversations, isPageVisible ? 5000 : 20000);
    return () => clearInterval(interval);
  }, [adminId, token, backendUrl, isPageVisible]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4 bg-gray-50">
      {/* Conversations List */}
      <div className="w-1/5 rounded-lg border border-gray-200 bg-white shadow">
        <ConversationList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={setSelectedConversation}
          loading={loading}
        />
      </div>

      {/* Chat Panel */}
      <div className="flex-1">
        {selectedConversation ? (
          <ChatPanel
            conversationId={selectedConversation.id}
            customerId={selectedConversation.buyer_id}
            customerName={
              selectedConversation.customer_name ||
              `Customer ${selectedConversation.buyer_id.substring(0, 8)}...`
            }
            customerEmail={selectedConversation.customer_email || ""}
            currentUserId={selectedConversation.seller_id}
            token={token}
            backendUrl={backendUrl}
            onClose={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white">
            <div className="text-center text-gray-400">
              <BsChatSquareDots className="w-full h-32 mb-10" />
              <p className="text-lg font-semibold">Select a conversation to start chatting</p>
              <p className="mt-2 text-sm">({conversations.length} active conversations)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;
