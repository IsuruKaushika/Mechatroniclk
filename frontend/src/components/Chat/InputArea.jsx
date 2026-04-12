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
    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
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
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
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
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-black placeholder-slate-400 focus:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-200 disabled:bg-slate-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSending || isUploading || (!message.trim() && !selectedFile)}
            className="rounded-lg bg-[#1dbf73] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#19a463] disabled:opacity-50"
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
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.40337462,22.99 3.50612381,23.1 4.13003135,22.99 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13003135,1.01001624 C3.34915502,0.9 2.40337462,0.99 1.77946707,1.4422273 C0.994591275,2.20822456 0.837623095,3.29500228 1.15159189,3.9580098 L3.03521743,10.3990029 C3.03521743,10.5561003 3.19218622,10.7131977 3.50612381,10.7131977 L16.6915026,11.4986845 C16.6915026,11.4986845 17.1624089,11.4986845 17.1624089,11.0474624 L17.1624089,12.1624751 C17.1624089,12.4744748 17.1624089,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            )}
          </button>
        </div>

        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          className="hidden"
        />

        {/* Character Count */}
        <p className="text-xs text-slate-400">{message.length} / 5000</p>
      </form>
    </div>
  );
};

export default InputArea;
