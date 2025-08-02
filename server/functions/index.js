import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import imageRoutes from './routes/imageRoutes.js';
import { verifyAccessToken, verifyAdmin } from './middlewares/authMiddleware.js';
import billingRoutes from './routes/billingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import cardRoutes from './routes/cardRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import flashSaleRoutes from './routes/flashSaleRoutes.js';
import { assignGuestId } from './middlewares/assignGuestID.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

// const corsOptions = {
//     origin: true,
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
// };

// app.use(cors(corsOptions));

// app.options('*', cors(corsOptions));

app.options('*', (req, res) => {
    // Set all necessary CORS headers
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // End the response with a 204 No Content status, which is standard for a successful preflight.
    res.sendStatus(204);
});

// A general middleware to set headers for non-preflight requests.
// This is necessary because the app.options handler ends the request.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
// --------------------------------------------------------

app.use('/v1/products', productRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/cart', assignGuestId, cartRoutes);
app.use('/v1/coupons', couponRoutes);
app.use('/v1/wishlist', assignGuestId, wishlistRoutes);
app.use('/v1/image', imageRoutes);
app.use('/v1/billing', verifyAccessToken, billingRoutes);
app.use('/v1/payment', verifyAccessToken, paymentRoutes);
app.use('/v1/orders', verifyAccessToken, orderRoutes);
app.use('/v1/card', verifyAccessToken, cardRoutes);
app.use('/v1/address', verifyAccessToken, addressRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/admin', verifyAccessToken, verifyAdmin, adminRoutes);
app.use('/v1/flashSale', flashSaleRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { dbName: 'exclusive-ecommerce' })
    .then(() => logger.info('MongoDB connected'))
    .catch((err) => logger.error('Mongo error:', err));

export const api = functions.https.onRequest(app);
