import express from "express";
import { registerUser, verifyUser, resendToken, login, logout, refreshUser, updateProfile, getAllCustomers, addCustomer, setPassword, refreshAccessToken } from "../controllers/userController.js"
import { verifyAccessToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/users", registerUser)
router.post("/verify/:token", verifyUser)
router.post("/resend-token", resendToken)
router.post("/login", login)
router.post("/refresh-access-token", refreshAccessToken)
router.post("/logout", logout)
router.get("/refresh-user", verifyAccessToken, refreshUser)
router.get("/get-all-customers",verifyAccessToken,verifyAdmin,getAllCustomers)
router.post("/update-profile", verifyAccessToken, updateProfile)
router.post("/add-customer",verifyAccessToken,verifyAdmin,addCustomer)
router.post("/set-password",setPassword)

export default router