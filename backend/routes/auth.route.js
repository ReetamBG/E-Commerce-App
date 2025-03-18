import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-profile", protectRoute, getProfile);
router.post("/refresh-access-token", refreshAccessToken);

export default router;

// CD8qu0J7U3EwYPAD
