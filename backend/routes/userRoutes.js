import express from "express"
import { SignUp, authUser, allUsers } from "../controllers/userControllers.js";
import protect from "../middlewares/authMiddleware.js";
const router = express.Router();


router.get("/", protect, allUsers);
router.post("/signup", SignUp);
router.post("/signin", authUser);

export default router