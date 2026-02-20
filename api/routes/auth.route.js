import express from "express";
import {
  signup,
  signin,
  google,
  getProfile,
  updateProfile,
  deleteUser,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// =============================
// AUTH ROUTES
// =============================
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

// =============================
// PROTECTED ROUTES
// =============================
router.get("/profile", verifyToken, getProfile);
router.put("/update", verifyToken, updateProfile);
router.delete("/delete", verifyToken, deleteUser);

// =============================
// SIGNOUT ROUTE
// =============================
router.post("/signout", (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production", 
    // secure true only in production (HTTPS)
  });

  res.status(200).json({ message: "Signed out successfully" });
});

export default router;
