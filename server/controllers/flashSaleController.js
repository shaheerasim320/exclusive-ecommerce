import FlashSale from "../models/FlashSaleSchema.js"
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Utility to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const calculateTimerArray = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
        return [{ id: 1, time: 0 }]; // Return 0 if invalid
    }

    const diffMs = end - start;
    const totalSeconds = Math.floor(diffMs / 1000);
    return [{ id: 1, time: totalSeconds }];
};

// Add a new flash sale
const addFlashSale = async (req, res) => {
    try {
        const { title, startTime, endTime, products, isActive } = req.body;

        // Validate required fields
        if (!title || !startTime || !endTime || !products || isActive === undefined) {
            return res.status(400).json({ message: "All fields (title, startTime, endTime, products, isActive) are required" });
        }

        // Validate dates
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
            return res.status(400).json({ message: "Invalid startTime or endTime; startTime must be before endTime" });
        }

        // Validate products array
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Products must be a non-empty array" });
        }

        // Validate each product entry
        for (const { product: productId, discount } of products) {
            if (!isValidObjectId(productId)) {
                return res.status(400).json({ message: `Invalid product ID: ${productId}` });
            }
            if (typeof discount !== "number" || discount < 0 || discount > 100) {
                return res.status(400).json({ message: `Discount for product ${productId} must be between 0 and 100` });
            }
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${productId}` });
            }
        }

        // Create flash sale
        const flashSale = new FlashSale({ title, startTime, endTime, products, isActive });
        await flashSale.save();

        // Update products' onFlashSale field
        const productIds = products.map(p => p.product);
        await Product.updateMany(
            { _id: { $in: productIds } },
            { onFlashSale: true, flashSaleId: flashSale._id }
        );

        res.status(201).json({ message: "Flash Sale Created", flashSale });
    } catch (error) {
        console.error("Error creating flash sale:", error.message);
        res.status(500).json({ message: "Error creating flash sale", error: error.message });
    }
};

// Get active flash sales
const getActiveFlashSale = async (req, res) => {
    try {
        const now = new Date();
        const flashSales = await FlashSale.find({
            isActive: true,
            startTime: { $lte: now },
            endTime: { $gte: now },
        }).populate({
            path: "products.product",
        }).lean();

        const flashSalesWithDiscount = flashSales.map(sale => ({
            ...sale,
            timerArray: calculateTimerArray(sale.startTime, sale.endTime),
            products: sale.products.map(p => ({
                ...p,
                product: p.product
                    ? {
                        ...p.product,
                        effectiveDiscount: p.discount,
                        isFlashSale: true,
                    }
                    : null,
            })),
        }));

        res.status(200).json({ message: "Active flash sales retrieved", flashSales: flashSalesWithDiscount });
    } catch (error) {
        console.error("Error fetching active flash sales:", error.message);
        res.status(500).json({ message: "Error fetching active flash sales", error: error.message });
    }
};

// Update a flash sale
const updateFlashSale = async (req, res) => {
    try {
        const { flashSaleID, updatedData } = req.body;

        if (!isValidObjectId(flashSaleID)) {
            return res.status(400).json({ message: "Valid Flash Sale ID is required" });
        }

        // Validate updated data
        if (updatedData.startTime || updatedData.endTime) {
            const start = new Date(updatedData.startTime || (await FlashSale.findById(flashSaleID)).startTime);
            const end = new Date(updatedData.endTime || (await FlashSale.findById(flashSaleID)).endTime);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
                return res.status(400).json({ message: "Invalid startTime or endTime; startTime must be before endTime" });
            }
        }

        if (updatedData.products) {
            if (!Array.isArray(updatedData.products) || updatedData.products.length === 0) {
                return res.status(400).json({ message: "Products must be a non-empty array" });
            }
            for (const { product: productId, discount } of updatedData.products) {
                if (!isValidObjectId(productId)) {
                    return res.status(400).json({ message: `Invalid product ID: ${productId}` });
                }
                if (typeof discount !== "number" || discount < 0 || discount > 100) {
                    return res.status(400).json({ message: `Discount for product ${productId} must be between 0 and 100` });
                }
                const product = await Product.findById(productId);
                if (!product) {
                    return res.status(404).json({ message: `Product not found: ${productId}` });
                }
            }
        }

        // Get current flash sale products
        const currentFlashSale = await FlashSale.findById(flashSaleID);
        if (!currentFlashSale) {
            return res.status(404).json({ message: "Flash sale not found" });
        }

        // Update flash sale
        const updatedFlashSale = await FlashSale.findByIdAndUpdate(
            flashSaleID,
            { ...updatedData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate("products.product");

        // Update onFlashSale for products
        if (updatedData.products) {
            const oldProductIds = currentFlashSale.products.map(p => p.product.toString());
            const newProductIds = updatedData.products.map(p => p.product);
            // Reset onFlashSale for removed products
            const removedProductIds = oldProductIds.filter(id => !newProductIds.includes(id));
            await Product.updateMany(
                { _id: { $in: removedProductIds } },
                { onFlashSale: false }
            );
            // Set onFlashSale for new products
            await Product.updateMany(
                { _id: { $in: newProductIds } },
                { onFlashSale: true }
            );
        }

        if (updatedData.isActive === false) {
            // Reset onFlashSale for all products if flash sale is deactivated
            await Product.updateMany(
                { _id: { $in: currentFlashSale.products.map(p => p.product) } },
                { onFlashSale: false }
            );
        }

        res.status(200).json({ message: "Flash sale updated successfully", flashSale: updatedFlashSale });
    } catch (error) {
        console.error("Error updating flash sale:", error.message);
        res.status(500).json({ message: "Unable to update flash sale", error: error.message });
    }
};

// Fetch all flash sales
const fetchAllFlashSales = async (req, res) => {
    try {
        const flashSales = await FlashSale.find().populate({
            path: "products.product",
            select: "title price discount mainImage",
        }).lean();

        // Add effective price to each product
        const flashSalesWithPrices = flashSales.map(sale => ({
            ...sale,
            products: sale.products.map(p => ({
                ...p,
                product: p.product
                    ? {
                        ...p.product,
                        effectivePrice: p.product.price * (1 - p.discount / 100),
                        isFlashSale: sale.isActive && new Date(sale.startTime) <= new Date() && new Date(sale.endTime) >= new Date(),
                    }
                    : null,
            })),
        }));

        res.status(200).json({ message: "All flash sales retrieved", flashSales: flashSalesWithPrices });
    } catch (error) {
        console.error("Error fetching all flash sales:", error.message);
        res.status(500).json({ message: "Unable to fetch all flash sales", error: error.message });
    }
};

// Fetch flash sale by ID
const fetchFlashSaleByID = async (req, res) => {
    const { flashSaleID } = req.params;

    try {
        if (!isValidObjectId(flashSaleID)) {
            return res.status(400).json({ message: "Valid Flash Sale ID is required" });
        }

        const flashSale = await FlashSale.findById(flashSaleID).populate({
            path: "products.product",
        }).lean();

        if (!flashSale) {
            return res.status(404).json({ message: "Flash sale not found" });
        }

        // Add effective price
        const flashSaleWithDiscount = {
            ...flashSale,
            products: flashSale.products.map(p => ({
                ...p,
                product: p.product
                    ? {
                        ...p.product,
                        effectiveDiscount: p.discount,
                        isFlashSale: flashSale.isActive && new Date(flashSale.startTime) <= new Date() && new Date(flashSale.endTime) >= new Date(),
                    }
                    : null,
            })),
        };

        res.status(200).json({ message: "Flash sale retrieved", flashSale: flashSaleWithDiscount });
    } catch (error) {
        console.error("Error fetching flash sale by ID:", error.message);
        res.status(500).json({ message: "Unable to fetch flash sale by ID", error: error.message });
    }
};

// Delete a flash sale
const deleteFlashSale = async (req, res) => {
    const { flashSaleID } = req.params;

    try {
        if (!isValidObjectId(flashSaleID)) {
            return res.status(400).json({ message: "Valid Flash Sale ID is required" });
        }

        const flashSale = await FlashSale.findById(flashSaleID);
        if (!flashSale) {
            return res.status(404).json({ message: "Flash sale not found" });
        }

        // Reset onFlashSale for products
        const productIds = flashSale.products.map(p => p.product);
        await Product.updateMany(
            { _id: { $in: productIds } },
            { onFlashSale: false }
        );

        await FlashSale.findByIdAndDelete(flashSaleID);

        res.status(200).json({ message: "Flash sale deleted successfully" });
    } catch (error) {
        console.error("Error deleting flash sale:", error.message);
        res.status(500).json({ message: "Unable to delete flash sale", error: error.message });
    }
};

export { addFlashSale, getActiveFlashSale, updateFlashSale, fetchAllFlashSales, fetchFlashSaleByID, deleteFlashSale };