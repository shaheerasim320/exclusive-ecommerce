import express from "express"
import { applyCoupon, getCartItemByProductID,  getAppliedCoupon, removeCoupon, addToCart, getCartItems, removeFromCart, mergeCart, updateProductQuantity } from "../controllers/cartController.js"

const router = express.Router()

router.post("/add", addToCart)
router.get("/get-cart-items", getCartItems)
router.post("/update-product-quantity", updateProductQuantity)
router.post("/apply-coupon", applyCoupon)
router.get("/cartItem", getCartItemByProductID)
router.delete("/remove", removeFromCart);
router.get("/get-applied-coupon",getAppliedCoupon)
router.delete("/remove-coupon",removeCoupon)
router.post("/merge",mergeCart)

export default router