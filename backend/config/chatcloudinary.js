import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const connectChatCloudinary = async () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CHAT_NAME,
      api_key: process.env.CLOUDINARY_CHAT_API_KEY,
      api_secret: process.env.CLOUDINARY_CHAT_SECRET_KEY,
      upload_preset: process.env.CLOUDINARY_CHAT_UPLOAD_PRESET
    });

    console.log("Connected to Chat Cloudinary");
  } catch (error) {
    console.error(" Chat Cloudinary connection failed:", error);
  }
};

export default connectChatCloudinary;
