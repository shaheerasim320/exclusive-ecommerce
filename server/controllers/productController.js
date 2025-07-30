import Product from "../models/Product.js";
import slugify from "slugify";

const addProduct = async (req, res) => {
    const product = new Product(req.body)
    try {
        product.productCode = await generateProductCode();
        product.slug = slugify(product.title, { lower: true, strict: true });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}

const generateProductCode = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const code = Array.from({ length: 6 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    const randomNum = Math.floor(100 + Math.random() * 900);
    const productCode = `${code}-${randomNum}`;

    const exists = await Product.findOne({ productCode });
    if (exists) return generateProductCode();
    return productCode;
};


const getFlashSaleProducts = async (req, res) => {
    try {
        const flashSaleProducts = await Product.find({
            onFlashSale: true,
            flashSaleStart: { $lte: new Date() },
            flashSaleEnd: { $gte: new Date() },
            discount: { $gt: 0 },
            stock: { $gt: 0 }
        });
        res.status(200).json(flashSaleProducts);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
};

const getBestSellingProducts = async (req, res) => {
    try {
        const bestSellingProducts = await Product.find()
            .sort({ salesVolume: -1, salesCount: -1 })
            .limit(10)
        res.json(bestSellingProducts)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}

const getProductByProductCode = async (req, res) => {
    const { productCode, productSlug } = req.params;
    try {
        const product = await Product.findOne({ productCode }).populate("category flashSaleId");
        if (!product) return res.status(404).json({ message: "Product not found" });
        const now = new Date();
        const isFlashSaleActive = product.flashSaleId.isActive && new Date(product.flashSaleId.startTime)<=now && new Date(product.flashSaleId.endTime) >=now;
        if(isFlashSaleActive){
            const productEntry = product.flashSaleId.products.find(p=>p.product.toString()==product._id.toString())
            if(productEntry){
                const effectiveDiscount = productEntry.discount;

            }
        }
        
        res.json(product);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({
            onFlashSale: false
        })
        res.json(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}


const updateProduct = async (req, res) => {
    const productID = req.params.id
    const updatedData = req.body
    try {
        const product = await Product.findByIdAndUpdate(productID, updatedData, { new: true })
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" })
        }
        return res.status(200).json(product)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}

const deleteProduct = async (req, res) => {
    const productID = req.params.productID
    try {
        await Product.findByIdAndDelete(productID)
        return res.status(200).json({ message: "Product deleted successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find()
        res.json(products)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Server error, please try again" })
    }
}

// Product search endpoint
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'No search query provided' });

        // Search by title, description, or category name (case-insensitive)
        const products = await Product.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        }).populate('category');

        res.json({ products });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

export { addProduct, getFlashSaleProducts, getBestSellingProducts, getProductByProductCode, getProducts, updateProduct, deleteProduct, getAllProducts, searchProducts };