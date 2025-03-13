import express from "express"
import {signup, login, logout, refreshAccessToken} from "../controllers/auth.controller.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.get("/refresh-access-token", refreshAccessToken)

export default router

// CD8qu0J7U3EwYPAD