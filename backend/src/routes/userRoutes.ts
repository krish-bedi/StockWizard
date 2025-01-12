import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  resetPassword,
  forgotPasswordUpdate,
  oAuth,
} from "../controllers/userController.js";

const router = express.Router();

// url: /api/users
router.post("/oauth", oAuth);
router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout", logoutUser);
router.post("/resetpassword", resetPassword);
router.put("/resetpassword", forgotPasswordUpdate);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
