import FlashSale from "../models/FlashSaleSchema.js"
import Product from '../models/Product.js';

async function cleanupExpiredFlashSales() {
  try {
    const currentDate = new Date();
    const expiredFlashSales = await FlashSale.find({
      isActive: true,
      endTime: { $lte: currentDate },
    });

    for (const flashSale of expiredFlashSales) {
      // Deactivate flash sale
      flashSale.isActive = false;
      await flashSale.save();

      // Reset onFlashSale for products
      const productIds = flashSale.products.map(p => p.product);
      await Product.updateMany(
        { _id: { $in: productIds } },
        { onFlashSale: false }
      );
    }

    console.log(`Deactivated ${expiredFlashSales.length} expired flash sales`);
  } catch (error) {
    console.error('Error cleaning up flash sales:', error);
  }
}

export default cleanupExpiredFlashSales;