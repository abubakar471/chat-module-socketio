import express from "express"
import { SignUp, authUser, allUsers, saveNotification, getNotifications, removeNotification, saveFCMToken } from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();


router.get("/", protect, allUsers);
router.post("/signup", SignUp);
router.post("/signin", authUser);
router.get("/notifications", protect, getNotifications);
router.post("/save-notification", protect, saveNotification);
router.post("/remove-notification", protect, removeNotification);
router.post("/save-fcm-token", protect, saveFCMToken);

export default router