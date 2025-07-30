import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    storeName: { type: String, required: true },
    slug: { type: String },
    productCode: { type: String },
    title: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    reviews: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    onSale: { type: Boolean, default: false },
    onFlashSale: { type: Boolean, default: false },
    flashSaleId: { type: mongoose.Schema.Types.ObjectId, ref: 'FlashSale', default: null },
    colors: { type: [String], default: null },
    sizes: { type: [String], default: null },
    mainImage: { type: String, required: true },
    image1: { type: String, required: true },
    image2: { type: String, required: true },
    image3: { type: String, required: true },
    image4: { type: String, required: true },
    salesCount: { type: Number, default: 0 },
    salesVolume: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual for flash sale details
productSchema.virtual('flashSale', {
    ref: 'FlashSale',
    localField: '_id',
    foreignField: 'products.product',
    justOne: true,
    match: { isActive: true, startTime: { $lte: new Date() }, endTime: { $gte: new Date() } },
});

// Include virtuals in output
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;