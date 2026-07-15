import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import messagesRouter from "./routes/userMessage.js";
import { registerChatHandlers } from "./socket/handler.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}));
app.use(express.json());

// REST routes
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/messages", messagesRouter);

// Socket.io
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  registerChatHandlers(io, socket);
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`);
});