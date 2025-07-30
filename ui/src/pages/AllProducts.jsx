import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../slices/productSlice';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
// import { addItemToCart, getCartItems } from '../slices/cartSlice';
// import { addItemToWishlist, getWishlistItems, removeFromWishlist } from '../slices/wishlistSlice';
import { toast, ToastContainer } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';

const AllProducts = () => {
    const [loading, setLoading] = useState();
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { cart, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const { user, delayedAction } = useSelector(state => state.user)
    const { allProducts } = useSelector(state => state.products)
    const [startIndex, setStartIndex] = useState(0);
    const dispatch = useDispatch()

    const handleWishlistToggle = async (productID) => {
        setLoading(true);
        if (items.some(item => item.product == productID)) {
            dispatch(removeFromWishlist(productID)).then(() => {
                setLoading(false);
                toast.success("Product removed from wishlist")
            }).catch(() => setLoading(false));
        } else {
            dispatch(addToWishlist(productID)).then(() => {
                setLoading(false);
                toast.success("Product added to wishlist")
            }).catch(() => setLoading(false));
        }
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
    // Calculate visible products based on screen size
    const getVisibleProductsCount = () => {
        const width = window.innerWidth;
        if (width < 640) return 2; // sm:grid-cols-2
        if (width < 768) return 3; // md:grid-cols-3
        if (width < 1024) return 4; // lg:grid-cols-4
        return 4; // default for larger screens
    };

    const visibleProductsCount = getVisibleProductsCount();


    return (
        <div>
            {loading && <Loader />}
            {/* Main container: Responsive width and padding, removed fixed w-[72rem] */}
            <div className={`w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto py-4 ${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs: Responsive font sizes and spacing */}
                <div className="bread-crumb text-sm md:text-base py-4">
                    <Link to="/" className="text-[#605f5f] hover:text-black">Home</Link>
                    <span className="mx-2 text-[#605f5f]">/</span>
                    <Link to="/all-products">All Products</Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    {/* Title: Responsive font size */}
                    <h1 className="text-2xl md:text-3xl font-semibold mb-4 sm:mb-0">All Products</h1>
                    {/* Navigation Buttons: Responsive sizing and gap */}
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
                            <img src="https://placehold.co/24x24/000000/FFFFFF?text=<" alt="Left-Arrow" className="w-5 h-5 object-contain" />
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
                            <img src="https://placehold.co/24x24/000000/FFFFFF?text=>" alt="Right-Arrow" className="w-5 h-5 object-contain" />
                        </button>
                    </div>
                </div>

                {/* Products Grid: Responsive grid columns and gaps, removed fixed width and height */}
                <div className="products flex flex-col gap-8 mb-10">
                    <div className="row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {allProducts && allProducts.slice(startIndex, startIndex + visibleProductsCount).map((product, index) => (
                            <ProductCard
                                product={product}
                                key={product._id}
                                onWishlistToggle={handleWishlistToggle}
                                onCartClick={handleAddToCartClick}
                                // isWishlistSelected={wishlistItems.some(item => item.product === product._id)}
                                // isAddToCartSelected={cartItems.some(item => item.product === product._id)}
                            />
                        ))}
                    </div>
                    {/* If you want a second row, you'd adjust startIndex and the slice logic to show the next set of products */}
                    {/* For example, if you want to always show 8 products, you'd adjust visibleProductsCount accordingly */}
                    {/* And for navigation, the logic would need to account for scrolling two rows at a time */}
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

