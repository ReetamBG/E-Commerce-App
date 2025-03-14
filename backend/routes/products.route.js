import express from "express"
import { protectRoute, adminRoute } from "../middleware/auth.middleware"
import { 
    getAllProducts, 
    createProduct,
    toggleFeaturedProduct,
    deleteProduct,
    // getRecommendedProducts,
    getFeaturedProducts,
    getProductByCategory
} from "../controllers/products.controller"

const router = express.Router()

// adminRoute, protectRoute are middlewares - only admins can get access to getAllProducts
// pass the request through protectRoute() -> adminRoute() -> getAllProducts()
router.get("/", protectRoute, adminRoute, getAllProducts)                   // get all products       
router.post("/", protectRoute, adminRoute, createProduct)                   // create a new product
router.patch(":id", protectRoute, adminRoute, toggleFeaturedProduct)        // toggle isFeatured on a product
router.delete("/:id", protectRoute, adminRoute, deleteProduct)              // delete a product

// router.get("/recommended", getRecommendedProducts)                          // get products recommended for the user
router.get("/featured", getFeaturedProducts)                                // get featured products
router.get("/category/:category", getProductByCategory)                     // get products by category

export default router