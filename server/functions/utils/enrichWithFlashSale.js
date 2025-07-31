import FlashSale from '../models/FlashSaleSchema.js';

export const enrichProductsWithFlashSale = async (products) => {
  const now = new Date();
  const flashSale = await FlashSale.findOne({
    startTime: { $lte: now },
    endTime: { $gte: now },
    isActive: true,
  });

  const enrich = (product) => {
    const saleItem = flashSale?.products.find(p => p.product.toString() === product._id.toString());

    return {
      ...product,
      flashSaleDiscount: saleItem?.discount || null,
    };
  };

  if (Array.isArray(products)) {
    return products.map(enrich);
  } else {
    return enrich(products);
  }
};
