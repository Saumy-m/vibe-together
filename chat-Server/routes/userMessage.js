import express from "express";
import { connectToDatabase } from "../libs/mongodb.js";
import Message from "../models/message.js";

const router = express.Router();

// GET /api/messages/:conversationId — load history
router.get("/:conversationId", async (req, res) => {
  try {
    await connectToDatabase();
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 }); // oldest first

    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

export default router;