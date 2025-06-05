import e from "express"
import { addFlashSale, deleteFlashSale, fetchAllFlashSales, fetchFlashSaleByID, getActiveFlashSale, updateFlashSale } from "../controllers/flashSaleController.js"
import { verifyAccessToken, verifyAdmin } from "../middlewares/authMiddleware.js"

const router = e.Router()

router.post("/add-flash-sale", verifyAccessToken, verifyAdmin, addFlashSale)
router.get("/get-active-flash-sale", getActiveFlashSale)
router.put("/update-flash-sale", verifyAccessToken, verifyAdmin, updateFlashSale)
router.get("/fetch-all-flash-sales",verifyAccessToken,verifyAdmin,fetchAllFlashSales)
router.get("/fetch-flash-sale-by-id/:flashSaleID",verifyAccessToken,verifyAdmin,fetchFlashSaleByID)
router.delete("/delete-flash-sale/:flashSaleID",verifyAccessToken,verifyAdmin,deleteFlashSale)

export default router