import express from "express";
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  checkBlockStatus,
} from "../controllers/blockUser.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const blockedRoutes = express.Router();

blockedRoutes.post("/block/:userId", protectRoute, blockUser);
blockedRoutes.post("/unblock/:userId", protectRoute, unblockUser);
blockedRoutes.get("/blocked", protectRoute, getBlockedUsers);
blockedRoutes.get("/block-status/:userId", protectRoute, checkBlockStatus);

export default blockedRoutes;
