import React, { useState, useRef } from "react";
import useCloudinaryUpload from "../../hooks/useCloudinaryUpload";
import FileUploadProgress from "./FileUploadProgress";

const InputArea = ({ onSendMessage, isSending, onTyping, token }) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const {
    uploadToCloudinary,
    isUploading,
    uploadProgress,
    error: uploadError,
  } = useCloudinaryUpload(token);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim() && !selectedFile) {
      return;
    }

    let mediaUrl = null;
    let mediaType = null;
    let fileName = null;
    let fileSize = null;

    // Upload file if selected
    if (selectedFile) {
      const uploadResult = await uploadToCloudinary(selectedFile);
      if (uploadResult) {
        mediaUrl = uploadResult.url;
        mediaType = uploadResult.mediaType;
        fileName = uploadResult.fileName;
        fileSize = uploadResult.fileSize;
      } else {
        return;
      }
    }

    // Send message
    await onSendMessage(message.trim(), mediaUrl, mediaType, fileName, fileSize);

    // Clear inputs
    setMessage("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    // Notify typing
    if (!isSending) {
      onTyping();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-6 py-3">
      {/* Upload Progress Bar */}
      {selectedFile && (
        <FileUploadProgress
          fileName={selectedFile.name}
          progress={uploadProgress}
          isUploading={isUploading}
          onCancel={() => {
            setSelectedFile(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      )}

      {/* Error Messages */}
      {uploadError && (
        <div className="mb-3 rounded-md bg-red-50 p-2 text-xs text-red-700">{uploadError}</div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        <div className="flex gap-2">
          {/* File Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || isUploading}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
            title="Attach file"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Type your message..."
            disabled={isSending || isUploading}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200 disabled:bg-gray-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSending || isUploading || (!message.trim() && !selectedFile)}
            className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
          >
            {isSending || isUploading ? (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="*/*"
        />
      </form>
    </div>
  );
};

export default InputArea;
