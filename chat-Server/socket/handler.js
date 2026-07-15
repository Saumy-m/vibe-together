import { connectToDatabase } from "../libs/mongodb.js";
import Chat from "../models/chats.js";
import Message from "../models/message.js";

export function registerChatHandlers(io, socket) {
  // user joins their conversation room
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // user sends a message
  socket.on("send_message", async ({ conversationId, senderId, text }) => {
    try {
      await connectToDatabase();

      // persist to MongoDB
      const message = await Message.create({
        conversationId,
        senderId,
        text,
      });

      // update conversation's lastMessage
      await Chat.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastMessageAt: new Date(),
      });

      // broadcast to everyone else in the room
      socket.to(conversationId).emit("receive_message", {
        _id: message._id.toString(),
        conversationId,
        senderId,
        text,
        createdAt: message.createdAt,
        read: false,
      });

      // confirm back to sender
      socket.emit("message_sent", {
        _id: message._id.toString(),
        conversationId,
        senderId,
        text,
        createdAt: message.createdAt,
        read: false,
      });
    } catch (err) {
      console.error("send_message error:", err);
      socket.emit("message_error", { error: "Failed to send message" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
}