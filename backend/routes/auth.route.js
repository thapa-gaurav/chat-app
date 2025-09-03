import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
  changePassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.post("/logout", logout);

authRoutes.put("/update-profile", protectRoute, updateProfile);

authRoutes.put("/change-password", protectRoute, changePassword);

authRoutes.get("/check", protectRoute, checkAuth);
export default authRoutes;
