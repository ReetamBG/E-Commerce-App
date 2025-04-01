import express from "express"
import {protectRoute} from "../middleware/auth.middleware.js";
import {addProduct, deleteItem, getCartItems, updateQuantity} from "../controllers/cart.controller.js";

const router = express.Router()

router.get("/", protectRoute, getCartItems)      // protectedRoute - only logged-in users can access
router.post("/", protectRoute, addProduct)
router.patch("/", protectRoute, updateQuantity)
router.delete("/:id", protectRoute, deleteItem)

export default router