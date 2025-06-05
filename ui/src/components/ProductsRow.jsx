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
        // if (isAdded || wishlist.find(item => item.productID == productID)) {
        //     try {
        //         await dispatch(removeFromWishlist({ productID: productID })).unwrap()
        //         await dispatch(getWishlistItems()).unwrap()
        //         toast.success("Product removed from wishlist")
        //     } catch (error) {
        //         toast.error(wishlistError)
        //     }
        // } else {
        //     try {
        //         await dispatch(addItemToWishlist({ productID, quantity, color, size })).unwrap()
        //         await dispatch(getWishlistItems()).unwrap()
        //         toast.success("Product added to wishlist")
        //     } catch (error) {
        //         toast.error(wishlistError)
        //     }
        // }
    }

    const handleAddToCartClick = async (productID, quantity = 1, color = null, size = null) => {
        // if (cart.find(item => item.productID == productID)) {
        //     return
        // }
        // try {
        //     await dispatch(addItemToCart({ productID, quantity, color, size })).unwrap()
        //     await dispatch(getCartItems()).unwrap()
        //     toast.success("Product added to cart")
        // } catch (error) {
        //     toast.error(cartError)
        // }
    }

    return (
        <div>
            {/* For You */}
            <div className="flex flex-col gap-4  w-[1170px] h-max m-auto my-8">
                {/* Header */}
                <div className="header flex  items-center justify-between">
                    {/* Title */}
                    <div className="heading flex gap-4  items-center">
                        <div className="rectangle w-5 h-10  bg-[#db4444]" />
                        <div className="text">
                            <p className="text-[16px] font-semibold text-[#db4444]">{title}</p>
                        </div>
                    </div>
                    {/* Title Ends Here */}
                    {/* Button */}
                    <div className={`btn w-[150px] h-[56px] bg-slate-500 ${title != 'Just For You' ? 'hidden' : ''}`}>
                        <button className="bg-white w-[150px] h-[56px] rounded-sm border-[1.5px] border-black border-opacity-60 hover:border-opacity-30">See All</button>
                    </div>
                    {/* Button Ends Here */}
                </div>
                {/* Header Ends Here */}
                {/* Products */}
                <div className="products grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cart != null && cart.find(item => item.productID == product._id)} />
                        </div>
                    ))}
                </div>
                {/* Products End Here */}
            </div>
            {/* For You Ends Here */}
        </div>
    )
}

export default RelatedItems
