import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
  });
  dns.setServers(["1.1.1.1", "1.0.0.1", "8.8.8.8", "8.8.4.4"]);
  await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`);
};

export default connectDB;
