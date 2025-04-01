import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config();        // load environment variables from .env files

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({limit: "5mb"}));
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(cookieParser());

app.use("/api/auth", authRoutes);         // registers the authRoutes router
app.use("/api/products", productRoutes);  // registers the productRoutes router
app.use("/api/cart", cartRoutes);         // registers the cartRoutes router
app.use("/api/coupon", couponRoutes);
app.use("/api/payment", paymentRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connectDB();
});
