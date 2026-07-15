import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("Chat server connected to MongoDB");
}