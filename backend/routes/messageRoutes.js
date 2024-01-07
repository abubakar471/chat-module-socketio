import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { sendMessage, allMessages, deleteMessage, editMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);
router.post("/delete", protect, deleteMessage);
router.post("/edit", protect, editMessage)

export default router;