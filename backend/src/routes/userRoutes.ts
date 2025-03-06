import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { timeout } from '../middleware/timeoutMiddleware';
import { refreshToken } from '../controllers/authController';
import { CustomRequest } from '../utils/definition';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  forgotPasswordUpdate,
  oAuth,
  resendVerification,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/oauth", oAuth);
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/resetpassword", resetPassword);
router.put("/resetpassword", forgotPasswordUpdate);
router.post("/refresh", refreshToken);
router.post("/resend-verification", resendVerification);

export default router;