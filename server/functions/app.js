// D:\Ecommerce\server\functions\app.js

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import couponRoutes from "./routes/couponRoutes.js"
import wishlistRoutes from "./routes/wishlistRoutes.js"
import imageRoutes from "./routes/imageRoutes.js";
import { verifyAccessToken, verifyAdmin } from "./middlewares/authMiddleware.js"
import billingRoutes from "./routes/billingRoutes.js"
// import { cleanupExpiredBillings } from "./utils/billingCleanup.js"; // This utility might still be needed if called by billingRoutes
import paymentRoutes from "./routes/paymentRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cardRoutes from "./routes/cardRoutes.js"
import addressRoutes from "./routes/addressRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import flashSaleRoutes from "./routes/flashSaleRoutes.js"
import Counter from "./models/Counter.js"; // Counter model might be needed by routes, keep it
import { assignGuestId } from "./middlewares/assignGuestID.js";

// --- REMOVED: dotenv import ---
// --- REMOVED: cron import ---
// --- REMOVED: direct cleanup functions import (they are called by onSchedule in index.js) ---

const app = express()

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173", // Be cautious with 'localhost' in production functions
    credentials: true
}))

// --- REMOVED: runCleanupJob function definition ---
// --- REMOVED: all cron.schedule blocks ---
// --- REMOVED: mongoose.connect block ---

// --- Routes ---
app.use("/v1/products", productRoutes)
app.use("/v1/users", userRoutes)
app.use("/v1/cart", assignGuestId, cartRoutes)
app.use("/v1/coupons", couponRoutes)
app.use("/v1/wishlist", assignGuestId, wishlistRoutes)
app.use("/v1/image", imageRoutes);
app.use("/v1/billing", verifyAccessToken, billingRoutes)
app.use("/v1/payment", verifyAccessToken, paymentRoutes)
app.use("/v1/orders", verifyAccessToken, orderRoutes)
app.use("/v1/card", verifyAccessToken, cardRoutes)
app.use("/v1/address", verifyAccessToken, addressRoutes)
app.use("/v1/category", categoryRoutes)
app.use("/v1/admin", verifyAccessToken, verifyAdmin, adminRoutes)
app.use("/v1/flashSale", flashSaleRoutes)

// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// --- EXPORT THE APP ---
export default app;