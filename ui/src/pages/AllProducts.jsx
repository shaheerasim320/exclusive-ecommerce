import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../slices/productSlice';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { toast, ToastContainer } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';

const AllProducts = () => {
    const [loading, setLoading] = useState();
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { cart: cartItems, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const { user, delayedAction } = useSelector(state => state.user)
    const { allProducts } = useSelector(state => state.products)
    const [startIndex, setStartIndex] = useState(0);
    const dispatch = useDispatch()

    const handleWishlistToggle = async (product) => {
        const wishlistItem = items.find(it => it.product?._id == product)
        if (wishlistItem) {
            await dispatch(removeFromWishlist({ wishlistItemId: wishlistItem._id })).then(() => { toast.success("Product removed from wishlist") }).catch(() => toast.error("Something went wrong. Please try again"));
        } else {
            await dispatch(addToWishlist({ product })).then(() => { toast.success("Product added to wishlist") }).catch(() => toast.error("Something went wrong. Please try again"));;
        }
    }

    const handleAddToCartClick = async (productID, quantity = 1, size = null, color = null) => {
        if (cartItems.some(item => item.productId == productID && item.color == color && item.size == size)) {
            const productIndex = cartItems.findIndex(item => item.productId == productID && item.color == color && item.size == size);
            await dispatch(updateProductQuantity({ product: productID, quantity: cartItems[productIndex].quantity + 1, color, size })).unwrap();
            toast.success("Product quantity updated in cart");
            return;
        }
        await dispatch(addToCart({ product: productID, quantity, color, size })).unwrap();
        toast.success("Product added to cart");
    };
    
    const getVisibleProductsCount = () => {
        const width = window.innerWidth;
        if (width < 640) return 2; 
        if (width < 768) return 3; 
        if (width < 1024) return 4;
        return 4;
    };

    const visibleProductsCount = getVisibleProductsCount();


    return (
        <div>
            {loading && <Loader />}
            <div className={`w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto py-4 ${loading ? "hidden" : ""}`}>
                <div className="bread-crumb text-sm md:text-base py-4">
                    <Link to="/" className="text-[#605f5f] hover:text-black">Home</Link>
                    <span className="mx-2 text-[#605f5f]">/</span>
                    <Link to="/all-products">All Products</Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-4 sm:mb-0">All Products</h1>
                    <div className="nav-buttons flex gap-2">
                        <button
                            className={`prev w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                ${startIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                            onClick={() => {
                                if (startIndex > 0) {
                                    setStartIndex(startIndex - 1);
                                }
                            }}
                            disabled={startIndex === 0}
                        >
                            <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="w-5 h-5 object-contain" />
                        </button>
                        <button
                            className={`next w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                ${startIndex + visibleProductsCount >= allProducts?.length ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                            onClick={() => {
                                if (startIndex + visibleProductsCount < allProducts?.length) {
                                    setStartIndex(startIndex + 1);
                                }
                            }}
                            disabled={startIndex + visibleProductsCount >= allProducts?.length}
                        >
                            <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="w-5 h-5 object-contain" />
                        </button>
                    </div>
                </div>

                <div className="products flex flex-col gap-8 mb-10">
                    <div className="row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {allProducts && allProducts.slice(startIndex, startIndex + visibleProductsCount).map((product, index) => (
                            <ProductCard
                                product={product}
                                key={product._id}
                                onWishlistToggle={handleWishlistToggle}
                                onCartClick={handleAddToCartClick}
                                isWishlistSelected={items.some(item => item.product?._id === product._id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover
            />
        </div>
    );
}

export default AllProducts

