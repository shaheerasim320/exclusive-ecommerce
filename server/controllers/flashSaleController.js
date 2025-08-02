// controllers/flashSaleController.js
import FlashSale from '../models/FlashSaleSchema.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// ✅ Create Flash Sale
export const createFlashSale = async (req, res) => {
    try {
        const { title, startTime, endTime, products, isActive } = req.body;

        // Basic validation
        if (!title || !startTime || !endTime || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'All fields are required and must include at least one product.' });
        }

        // Validate product IDs and discounts
        const validProducts = await Promise.all(products.map(async p => {
            const exists = await Product.findById(p.product);
            if (!exists) throw new Error(`Product not found: ${p.product}`);
            return {
                product: new mongoose.Types.ObjectId(p.product),
                discount: Number(p.discount),
            };
        }));

        const flashSale = new FlashSale({
            title,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            products: validProducts,
            isActive,
        });

        await flashSale.save();

        // Optional: Set flashSaleId on related products
        await Product.updateMany(
            { _id: { $in: validProducts.map(p => p.product) } },
            { $set: { flashSaleId: flashSale._id } }
        );

        res.status(201).json({ message: 'Flash sale created successfully', flashSale });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create flash sale', error: err.message });
    }
};

// ✅ Update Flash Sale
export const updateFlashSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startTime, endTime, products, isActive } = req.body;

        const flashSale = await FlashSale.findById(id);
        if (!flashSale) return res.status(404).json({ message: 'Flash sale not found' });

        if (title) flashSale.title = title;
        if (startTime) flashSale.startTime = new Date(startTime);
        if (endTime) flashSale.endTime = new Date(endTime);
        if (typeof isActive === 'boolean') flashSale.isActive = isActive;

        if (Array.isArray(products) && products.length > 0) {
            const validProducts = await Promise.all(products.map(async p => {
                const exists = await Product.findById(p.product);
                if (!exists) throw new Error(`Product not found: ${p.product}`);
                return {
                    product: new mongoose.Types.ObjectId(p.product),
                    discount: Number(p.discount),
                };
            }));

            // 1. Clear old flashSaleId from previous products and reset onFlashSale to false
            await Product.updateMany(
                { flashSaleId: flashSale._id },
                {
                    $unset: { flashSaleId: '' },
                    $set: { onFlashSale: false },
                }
            );

            // 2. Add flashSaleId to new products and set onFlashSale to true
            await Product.updateMany(
                { _id: { $in: validProducts.map(p => p.product) } },
                {
                    $set: {
                        flashSaleId: flashSale._id,
                        onFlashSale: true,
                    }
                }
            );

            flashSale.products = validProducts;
        }

        await flashSale.save();
        res.json({ message: 'Flash sale updated successfully', flashSale });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update flash sale', error: err.message });
    }
};

// ✅ Delete Flash Sale
export const deleteFlashSale = async (req, res) => {
    try {
        const { id } = req.params;
        const flashSale = await FlashSale.findById(id);
        if (!flashSale)
            return res.status(404).json({ message: 'Flash sale not found' });

        // Clear flashSaleId and reset onFlashSale on all affected products
        await Product.updateMany(
            { flashSaleId: flashSale._id },
            {
                $unset: { flashSaleId: '' },
                $set: { onFlashSale: false }
            }
        );

        // Delete the flash sale
        await flashSale.deleteOne();

        res.json({ message: 'Flash sale deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete flash sale', error: err.message });
    }
};

export const getActiveFlashSale = async (req, res) => {
  try {
    const now = new Date();

    const flashSale = await FlashSale.findOne({
      startTime: { $lte: now },
      endTime: { $gte: now },
      isActive: true,
    }).populate('products.product');

    if (!flashSale) {
      return res.status(404).json({ message: 'No active flash sale.' });
    }

    const remainingMs = flashSale.endTime.getTime() - now.getTime(); 
    const remainingTime = Math.floor(remainingMs / 1000); 

    const response = {
      title: flashSale.title,
      startTime: flashSale.startTime,
      endTime: flashSale.endTime,
      remainingTime,
      products: flashSale.products
        .filter(p => p.product)
        .map(p => ({
          ...p.product.toObject(),
          flashSaleDiscount: p.discount
        }))
    };

    res.json(response);
  } catch (err) {
    console.error('Error fetching flash sale:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
