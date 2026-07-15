import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  lastMessage:   { type: String, default: "" },
  lastMessageAt: { type: Date, default: Date.now },
  createdAt:     { type: Date, default: Date.now },
});

// index so querying by participant pair is fast
ChatSchema.index({ participants: 1 });

export default mongoose.models.Chat ||
  mongoose.model("Chat", ChatSchema);