import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../slices/productSlice';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { toast, ToastContainer } from 'react-toastify';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart, updateProductQuantity } from '../slices/cartSlice'; // Added updateProductQuantity import

const PRODUCTS_PER_PAGE = 8; // Define how many products to show per page

const AllProducts = () => {
    const [loading, setLoading] = useState(false); // Changed to false as useEffect handles loading
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { cart: cartItems, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const { allProducts } = useSelector(state => state.products)
    const dispatch = useDispatch()

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch all products on component mount
    useEffect(() => {
        setLoading(true);
        dispatch(fetchAllProducts())
            .finally(() => setLoading(false));
    }, [dispatch]);

    const handleWishlistToggle = async (product) => {
        const wishlistItem = items.find(it => it.product?._id === product);
        if (wishlistItem) {
            await dispatch(removeFromWishlist({ wishlistItemId: wishlistItem._id }))
                .then(() => { toast.success("Product removed from wishlist") })
                .catch(() => toast.error("Something went wrong. Please try again"));
        } else {
            await dispatch(addToWishlist({ product }))
                .then(() => { toast.success("Product added to wishlist") })
                .catch(() => toast.error("Something went wrong. Please try again"));
        }
    };

    const handleAddToCartClick = async (productID, quantity = 1, size = null, color = null) => {
        if (cartItems.some(item => item.productId === productID && item.color === color && item.size === size)) {
            const productIndex = cartItems.findIndex(item => item.productId === productID && item.color === color && item.size === size);
            await dispatch(updateProductQuantity({ product: productID, quantity: cartItems[productIndex].quantity + 1, color, size })).unwrap();
            toast.success("Product quantity updated in cart");
            return;
        }
        await dispatch(addToCart({ product: productID, quantity, color, size })).unwrap();
        toast.success("Product added to cart");
    };

    // Calculate total pages and products for the current page
    const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = allProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // Handle page change and scroll to top
    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='md:mt-28 mt-40'>
            {(loading || cartLoading) && <div className="h-screen flex items-center justify-center"><Loader /></div>}
            <div className={`w-full px-4  lg:max-w-[1170px] mx-auto py-4 ${(loading || cartLoading) ? "hidden" : ""}`}>
                <div className="bread-crumb text-sm md:text-base py-4">
                    <Link to="/" className="text-[#605f5f] hover:text-black">Home</Link>
                    <span className="mx-2 text-[#605f5f]">/</span>
                    <Link to="/all-products">All Products</Link>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold mb-4 sm:mb-0">All Products</h1>
                    {/* Navigation buttons removed */}
                </div>

                <div className="products flex flex-col gap-8 mb-10">
                    <div className="row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => (
                                <ProductCard
                                    product={product}
                                    key={product._id}
                                    onWishlistToggle={handleWishlistToggle}
                                    onCartClick={handleAddToCartClick}
                                    isWishlistSelected={items.some(item => item.product?._id === product._id)}
                                />
                            ))
                        ) : (
                            <div className="w-full p-4 flex items-center justify-center text-center text-gray-500 col-span-full">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                        {Array.from({ length: totalPages }).map((_, index) => {
                            const page = index + 1;
                            return (
                                <button
                                    key={page}
                                    className={`px-4 py-2 rounded border transition-all duration-200
                                        ${currentPage === page ? 'bg-[#DB4444] text-white border-[#DB4444]' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                )}
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

export default AllProducts;