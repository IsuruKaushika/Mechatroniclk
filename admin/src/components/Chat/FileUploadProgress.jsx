import React from "react";

const FileUploadProgress = ({ fileName, progress, isUploading, onCancel }) => {
  return (
    <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{fileName}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {isUploading ? `Uploading... ${Math.round(progress)}%` : "Ready to send"}
          </p>
        </div>

        <button
          onClick={onCancel}
          disabled={isUploading}
          className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-50"
          title="Remove file"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default FileUploadProgress;
