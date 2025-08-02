import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
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
import { cleanupExpiredBillings } from "./utils/billingCleanup.js";
import paymentRoutes from "./routes/paymentRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import cardRoutes from "./routes/cardRoutes.js"
import addressRoutes from "./routes/addressRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import flashSaleRoutes from "./routes/flashSaleRoutes.js"
import Counter from "./models/Counter.js";
import { assignGuestId } from "./middlewares/assignGuestID.js";
import cron from "node-cron"
import cleanGuestData from "./cron/cleanGuestData.js";
import cleanupBillings from "./cron/cleanupBillings.js";

dotenv.config();
const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json());

app.use(cookieParser())

app.use(cors({
    origin: true,
    credentials: true
}))

const runCleanupJob = async () => {
    await cleanupExpiredBillings();
    setTimeout(runCleanupJob, 5 * 60 * 1000);
};

cron.schedule("0 0 * * *", () => {
    console.log('Running guest data cleanup cron job...');
    cleanGuestData();
})

cron.schedule("0 * * * *",()=>{
    console.log('Running billing cleanup cron job...');
    cleanupBillings();
})

mongoose.connect(process.env.MONGODB_URI, { dbName: "exclusive-ecommerce" })
    .then(conn => console.log(`MongoDB Connected With Server: ${conn.connection.host}`))
    .catch(err => console.log(`Error Occured: ${err}`))

app.use("/api/v1/products", productRoutes)

app.use("/api/v1/users", userRoutes)

app.use("/api/v1/cart", assignGuestId, cartRoutes)

app.use("/api/v1/coupons", couponRoutes)

app.use("/api/v1/wishlist", assignGuestId, wishlistRoutes)

app.use("/api/v1/image", imageRoutes);

app.use("/api/v1/billing", verifyAccessToken, billingRoutes)

app.use("/api/v1/payment", verifyAccessToken, paymentRoutes)

app.use("/api/v1/orders", verifyAccessToken, orderRoutes)

app.use("/api/v1/card", verifyAccessToken, cardRoutes)

app.use("/api/v1/address", verifyAccessToken, addressRoutes)

app.use("/api/v1/category", categoryRoutes)

app.use("/api/v1/admin", verifyAccessToken, verifyAdmin, adminRoutes)

app.use("/api/v1/flashSale", flashSaleRoutes)



app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
