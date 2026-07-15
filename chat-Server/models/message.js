import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text:      { type: String, required: true },
  read:      { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);