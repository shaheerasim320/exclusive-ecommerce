import express from "express"
import { moveAllItemsToCart, removeFromWishlist, addToCart, getWishlistItems, addToWishlist, mergeWishlist } from "../controllers/wishlistController.js"
import { verifyAccessToken, verifyAccessTokenOptional } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/add", verifyAccessTokenOptional, addToWishlist)
router.post("/move-all-items-to-cart", moveAllItemsToCart)
router.get("/get-wishlist-items", verifyAccessTokenOptional, getWishlistItems)
router.delete("/remove", verifyAccessTokenOptional, removeFromWishlist)
router.post("/add-to-cart", verifyAccessToken, addToCart)
router.post("/merge", verifyAccessToken, mergeWishlist)

export default router