import { useState, useCallback } from "react";

/**
 * Custom hook for uploading files to Cloudinary from chat
 * Handles getting upload config and uploading directly to Cloudinary
 * Uses unsigned uploads (upload preset must be configured as unsigned in Cloudinary)
 */
export const useCloudinaryUpload = (token) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Get upload config from backend
  const getUploadConfig = useCallback(async () => {
    try {
      if (!token) {
        throw new Error("No authentication token available. Please log in.");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const response = await fetch(`${backendUrl}/api/chat/upload-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get upload config");
      }

      return await response.json();
    } catch (err) {
      console.error("Error getting upload config:", err);
      throw err;
    }
  }, [token]);

  // Upload file to Cloudinary
  const uploadToCloudinary = useCallback(
    async (file) => {
      if (!file) {
        setError("No file selected");
        return null;
      }

      try {
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);

        // Get upload config from backend
        const config = await getUploadConfig();
        console.log("Upload config received:", {
          cloudName: config.cloudName,
          uploadPreset: config.uploadPreset,
        });

        // Prepare form data for unsigned Cloudinary upload
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", config.uploadPreset);
        formData.append("folder", config.folder);

        // Upload to Cloudinary
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log("Upload progress:", percentComplete + "%");
            setUploadProgress(percentComplete);
          }
        });

        // Handle completion
        const uploadPromise = new Promise((resolve, reject) => {
          xhr.addEventListener("load", () => {
            console.log("Upload response status:", xhr.status);
            if (xhr.status === 200) {
              try {
                const response = JSON.parse(xhr.responseText);
                console.log("Upload successful:", {
                  url: response.secure_url,
                  public_id: response.public_id,
                });
                resolve(response);
              } catch (err) {
                console.error("Failed to parse Cloudinary response:", xhr.responseText);
                reject(new Error("Invalid response from Cloudinary"));
              }
            } else {
              console.error("Upload failed:", xhr.status, xhr.responseText);
              reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
            }
          });

          xhr.addEventListener("error", () => {
            console.error("Upload request error");
            reject(new Error("Upload request failed"));
          });

          xhr.addEventListener("abort", () => {
            console.error("Upload cancelled");
            reject(new Error("Upload was cancelled"));
          });
        });

        // Send request to Cloudinary. Use raw uploads for non-images (pdf/doc/etc).
        const isImageFile = file.type.startsWith("image/");
        const resourceType = isImageFile ? "image" : "raw";
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${config.cloudName}/${resourceType}/upload`;
        console.log("Uploading to:", cloudinaryUrl);
        xhr.open("POST", cloudinaryUrl);
        xhr.send(formData);

        const result = await uploadPromise;

        setUploadProgress(100);
        return {
          url: result.secure_url,
          publicId: result.public_id,
          mediaType: isImageFile ? "image" : "file",
          fileName: file.name,
          fileSize: file.size,
          width: result.width,
          height: result.height,
        };
      } catch (err) {
        console.error("Error uploading to Cloudinary:", err);
        setError(err.message);
        return null;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [getUploadConfig],
  );

  return {
    uploadToCloudinary,
    isUploading,
    uploadProgress,
    error,
  };
};

export default useCloudinaryUpload;
