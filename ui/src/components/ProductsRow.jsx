import React from 'react'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const RelatedItems = ({ title }) => {
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { cart, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const products = [
        {
            id: 1,
            title: "Breed Dry Dog Food",
            category: "Food",
            price: 100,
            desc: "Breed Dry Dog Food is a premium, nutrient-rich formula made with high-quality ingredients to support your dog's overall health. Its easy-to-digest formula promotes healthy digestion, strong muscles, and a shiny coat.",
            reviews: 35,
            mainImage: "/images/dog-food.png",
            image1: "/images/dog-food.png",
            image2: "/images/dog-food.png",
            image3: "/images/dog-food.png",
            image4: "/images/dog-food.png",
            stock: 9
        },
        {
            id: 2,
            title: "CANON EOS DSLR Camera",
            category: "Camera",
            price: 360,
            desc: "The CANON EOS DSLR Camera offers exceptional image quality with fast autofocus, perfect for both beginners and professionals. Capture every moment in stunning detail with its versatile and durable design.",
            reviews: 95,
            mainImage: "/images/dslr-camera.png",
            image1: "/images/dslr-camera.png",
            image2: "/images/dslr-camera.png",
            image3: "/images/dslr-camera.png",
            image4: "/images/dslr-camera.png",
            stock: 5
        },
        {
            id: 3,
            title: "ASUS FHD Gaming Laptop",
            category: "Laptop",
            price: 700,
            desc: "The ASUS FHD Gaming Laptop delivers immersive gaming experiences with a high-definition display and powerful performance. Enjoy smooth gameplay and rapid multitasking with its fast processing and robust graphics.",
            reviews: 325,
            mainImage: "/images/laptop.png",
            image1: "/images/laptop.png",
            image2: "/images/laptop.png",
            image3: "/images/laptop.png",
            image4: "/images/laptop.png",
            stock: 8
        },
        {
            id: 4,
            title: "Curology Product Set",
            category: "Skincare",
            price: 500,
            desc: "The Curology Product Set offers a personalized skincare routine tailored to your unique skin needs. Each product is formulated with high-quality ingredients to help combat acne, reduce signs of aging, and promote overall skin health, giving you smoother, clearer, and more radiant skin.",
            reviews: 145,
            mainImage: "/images/curology.png",
            image1: "/images/curology.png",
            image2: "/images/curology.png",
            image3: "/images/curology.png",
            image4: "/images/curology.png",
            stock: 13
        },
    ];

    const handleWishlistToggle = async (isAdded, productID, quantity = 1, color = null, size = null) => {
        // Wishlist toggle logic (commented)
    }

    const handleAddToCartClick = async (productID, quantity = 1, color = null, size = null) => {
        // Add to cart logic (commented)
    }

    return (
        <div>
            {/* For You */}
            <div className="flex flex-col gap-4 max-w-6xl w-full h-max m-auto my-8">
                {/* Header */}
                <div className="header flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="heading flex gap-4 items-center">
                        <div className="rectangle w-5 h-10 bg-[#db4444]" />
                        <div className="text">
                            <p className="text-[16px] font-semibold text-[#db4444]">{title}</p>
                        </div>
                    </div>
                    <div className={`btn w-full sm:w-[150px] h-[56px] ${title !== 'Just For You' ? 'hidden' : ''}`}>
                        <button className="bg-white w-full h-full rounded-sm border-[1.5px] border-black border-opacity-60 hover:border-opacity-30">See All</button>
                    </div>
                </div>
                {/* Products */}
                <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductCard
                                product={product}
                                key={product._id}
                                onWishlistToggle={handleWishlistToggle}
                                onCartClick={handleAddToCartClick}
                                isWishlistSelected={items.some(item => item.product == product._id)}
                                isAddToCartSelected={cart != null && cart.find(item => item.productID == product._id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RelatedItems;
