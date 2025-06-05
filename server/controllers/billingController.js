import Billing from "../models/Billing.js";
import Coupon from "../models/Coupon.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const createBillingRecord = async (req, res) => {
    const userID = req.user.userId
    const { items, couponID } = req.body
    try {
        const coupon = couponID != null ? await Coupon.findById(couponID) : null
        const billing = new Billing({ user: userID, items: items, coupon: coupon != null ? coupon._id : coupon })
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            })
        }
        await billing.save()

        res.status(201).json({ message: "Billing Record Created Sucessfully", id: billing._id })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

const fetchBillingDetailsByID = async (req, res) => {
    const billingID = req.params.billingID
    const userID = req.user.userId
    try {
        if (!billingID) {
            return res.status(400).json({ message: "Billing ID is Required" })
        }
        const billing = await Billing.findById(billingID).populate("items.product")
        if (!billing) {
            return res.status(404).json({ message: "Requested resource not found" })
        }
        if (billing.user != userID) {
            return res.status(403).json({ message: "You do not have permission to access this billing resource." })
        }
        res.status(200).json(billing)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const applyCoupon = async (req, res) => {
    const { billingID, couponCode } = req.body;
    try {
        const billing = await Billing.findById(billingID);
        if (!billing) {
            return res.status(404).json({ message: "Billing ID expired or invalid" });
        }
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true, validUntil: { $gte: new Date() } });
        if (!coupon) {
            return res.status(404).json({ message: "Coupon code invalid or inactive" });
        }
        billing.coupon = coupon._id;
        await billing.save();
        res.status(200).json({ message: "Coupon code applied successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAppliedCoupon = async (req, res) => {
    const billingID = req.params.billingID
    try {
        const billing = await Billing.findById(billingID).populate("coupon");
        if (!billing) {
            return res.status(404).json({ message: "Billing ID expired or invalid" });
        }
        res.status(200).json(billing.coupon)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteBillingRecordByID = async (req, res) => {
    const billingID = req.params.id;
    try {
        await Billing.findByIdAndDelete(billingID)
        res.status(200).json({ messgae: "Deleted Successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const setDefaultCard = async (req, res) => {
    const userID = req.user.userId
    const { paymentMethodId } = req.body;
    try {
        await User.findByIdAndUpdate(userID, { defaultCard: paymentMethodId }, { new: true });
        res.status(200).json({ message: "Default card set successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { createBillingRecord, fetchBillingDetailsByID, applyCoupon, getAppliedCoupon, deleteBillingRecordByID, setDefaultCard }