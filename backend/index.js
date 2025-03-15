import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/products.route.js"
import cartRoutes from "./routes/cart.route.js"
import {connectDB} from "./lib/db.js"
import cookieParser from "cookie-parser"

dotenv.config()     // load environment variables from .env files

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)            // registers the authRoutes router
app.use("/api/products", productRoutes)     // registers the productRoutes router
app.use("/api/cart", cartRoutes)            // registers the cartRoutes router

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
    connectDB()
})
