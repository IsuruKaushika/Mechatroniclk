import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ShopContext } from "../../context/ShopContext";
import ChatPanel from "./ChatPanel";

const ChatButton = ({
  sellerId = "c4b18e3a-7715-5f27-a48f-d381a9a8e517", // Admin UUID (converted from admin email)
  sellerName = "MechatronicLK Studio",
  serviceId = null,
}) => {
  const { token, backendUrl } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [userIdUUID, setUserIdUUID] = useState(null); // UUID from backend
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSellerOnline, setIsSellerOnline] = useState(true); // Seller online status
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

  // Get current user from JWT token
  useEffect(() => {
    if (!token) {
      setCurrentUserId(null);
      return;
    }

    // Decode JWT to get user ID (keep as MongoDB ObjectID)
    try {
      const parts = token.split(".");
      const payload = JSON.parse(atob(parts[1]));
      setCurrentUserId(payload.id);
    } catch (err) {
      console.error("Failed to decode token:", err);
      setCurrentUserId(null);
    }
  }, [token]);

  // Create or get conversation via backend API
  useEffect(() => {
    if (!currentUserId || !token) return;

    const getConversation = async () => {
      try {
        setIsLoading(true);

        // Use backend API to create/get conversation
        const response = await fetch(`${backendUrl}/api/chat/conversations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            sellerId,
            serviceId,
            serviceName: "3D Design Service",
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to get conversation: ${response.statusText}`);
        }

        const conversation = await response.json();
        setConversationId(conversation.id);
        // Store the UUID from the conversation (backend already converted it)
        setUserIdUUID(conversation.buyer_id);
      } catch (err) {
        console.error("Error fetching conversation:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getConversation();
  }, [currentUserId, token, sellerId, serviceId, backendUrl]);

  // Load unread messages through backend (no direct browser reads from Supabase)
  useEffect(() => {
    if (!conversationId || !userIdUUID || isOpen) return;

    const loadUnreadMessages = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/chat/conversations/${conversationId}/messages`,
          {
            headers: {
              token,
            },
          },
        );

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload.error || payload.message || "Failed to load unread messages");
        }

        setUnreadCount(typeof payload.unreadCount === "number" ? payload.unreadCount : 0);
      } catch (err) {
        console.error("Error loading unread messages:", err);
      }
    };

    loadUnreadMessages();

    const interval = setInterval(loadUnreadMessages, isPageVisible ? 5000 : 20000);

    return () => {
      clearInterval(interval);
    };
  }, [conversationId, userIdUUID, token, backendUrl, isOpen, isPageVisible]);

  const handleOpenChat = async () => {
    if (!token || !currentUserId) {
      // Show toast notification and navigate to login
      toast.info("Please sign in to chat with the seller", {
        position: "bottom-center",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (!conversationId) {
      // Wait for conversation to be created/fetched
      console.log("Waiting for conversation to load...");
      return;
    }

    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Chat Button (Fixed Position) */}
      <button
        onClick={handleOpenChat}
        disabled={isLoading}
        className={`fixed bottom-6 left-6 z-40 group ${isOpen ? "hidden" : ""}`}
        title={isLoading ? "Loading..." : "Open chat"}
      >
        <div
          className={`relative flex items-center gap-3 px-5 py-3 rounded-full shadow-lg transition transform border ${
            isLoading
              ? "bg-slate-200 cursor-not-allowed opacity-70"
              : !token || !currentUserId
                ? "bg-slate-100 hover:shadow-lg cursor-pointer border border-slate-300"
                : !conversationId
                  ? "bg-slate-200 cursor-not-allowed opacity-70"
                  : "bg-white hover:shadow-xl hover:scale-105 cursor-pointer"
          }`}
        >
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <img
                src={`../src/assets/logo.png`}
                alt={sellerName}
                className="h-10 w-10 rounded-full object-cover"
              />
              {/* Online Status Dot */}
              {isSellerOnline ? (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse"></div>
              ) : (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-400 border-2 border-white"></div>
              )}
            </div>

            {/* Name and Status */}
            <div className="flex flex-col text-left">
              <p className="text-sm font-semibold text-gray-900">{sellerName.split(" ")[0]}</p>
              {isSellerOnline && token && currentUserId ? (
                <p className="text-xs text-green-600 font-medium">Online</p>
              ) : !token ? (
                <p className="text-xs text-gray-500 font-medium">Sign in to chat with the seller</p>
              ) : (
                <p className="text-xs text-gray-500 font-medium">Offline</p>
              )}
            </div>
          </div>

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>
      </button>

      {/* Chat Panel Modal */}
      {isOpen && conversationId && userIdUUID && (
        <ChatPanel
          conversationId={conversationId}
          sellerId={sellerId}
          sellerName={sellerName}
          onClose={handleCloseChat}
          currentUserId={userIdUUID}
          token={token}
        />
      )}
    </>
  );
};

export default ChatButton;
