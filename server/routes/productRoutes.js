import express from "express";
import { addProduct, getFlashSaleProducts, getBestSellingProducts, getProductByProductCode, getProducts, updateProduct, deleteProduct, getAllProducts, searchProducts } from "../controllers/productController.js";
import { verifyAccessToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.get("/flash-sale-products", getFlashSaleProducts)
router.get("/:productSlug/:productCode", getProductByProductCode);
router.get("/best-selling-products", getBestSellingProducts)
router.post("/products", verifyAccessToken, verifyAdmin, addProduct)
router.get("/products", getProducts)
router.put('/product/:id', verifyAccessToken, verifyAdmin, updateProduct);
router.get("/get-all-products", getAllProducts);
router.delete("/products/:productID", verifyAccessToken, verifyAdmin, deleteProduct);
router.get("/search", searchProducts);


export default router