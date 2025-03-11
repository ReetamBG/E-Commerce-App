import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import {connectDB} from "./lib/db.js"

dotenv.config()     // load environment variables from .env files

const app = express()
const PORT = process.env.PORT || 5000

app.use("/api/auth", authRoutes)        // registers the authRoutes router

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
    connectDB()
})
