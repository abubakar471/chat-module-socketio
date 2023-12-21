import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { sendMessage, allMessages } from "../controllers/messageController.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:chatId", protect, allMessages);

export default router;