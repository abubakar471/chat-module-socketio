import express from "express"
import { SignUp, authUser, allUsers, saveNotification, getNotifications, removeNotification, saveFCMToken, loginWithIqSocial, loginWithIqSocialSocialAuth, updatePasswordFromIqSocial } from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();


router.get("/", protect, allUsers);
router.post("/signup", SignUp);
router.post("/signin", authUser);
router.post("/login-with-iqsocial", loginWithIqSocial);
router.post("/login-with-iqsocial-social-auth", loginWithIqSocialSocialAuth);
router.post("/update-password-from-iq-social", updatePasswordFromIqSocial);
router.get("/notifications", protect, getNotifications);
router.post("/save-notification", protect, saveNotification);
router.post("/remove-notification", protect, removeNotification);
router.post("/save-fcm-token", protect, saveFCMToken);

export default router