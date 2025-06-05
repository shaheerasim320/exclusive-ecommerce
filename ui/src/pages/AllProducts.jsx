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
    const [loading,setLoading] = useState();
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { cart, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const { user, delayedAction } = useSelector(state => state.user)
    const { allProducts } = useSelector(state => state.products)
    const [startIndex, setStartIndex] = useState(0);
    const dispatch = useDispatch()

    const handleWishlistToggle = async (productID) => {
        setLoading(true);
        if (items.some(item => item.product == productID)) {
            dispatch(removeFromWishlist(productID)).then(()=>{
                setLoading(false);
                toast.success("Product removed from wishlist")
            }).catch(()=>setLoading(false));
        } else {
            dispatch(addToWishlist(productID)).then(()=>{
                setLoading(false);
                toast.success("Product added to wishlist")
            }).catch(()=>setLoading(false));
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
    return (
        <div>
            {loading && <Loader />}
            <div className={`${loading}?"hidden":"" w-[72rem] flex flex-col mx-auto p-4 gap-[1rem]`}>
                <div className="bread-crumb">
                    <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/all-products" className="text-[14px]">All Products</Link>
                </div>
                <div className="flex justify-between">
                    <h1 className="text-[34px] font-semibold">All Products</h1>
                    <div className="nav-buttons flex gap-[5px]">
                        <div className={`prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${startIndex === 0 ? "" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`} onClick={() => {
                            if (startIndex - 1 >= 0) {
                                setStartIndex(startIndex - 1)
                            }
                        }}>
                            <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="px-[10px] py-[11px]" />
                        </div>
                        <div className={`next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${startIndex + 8 < allProducts?.length ? "hover:bg-[#d4d4d4] hover:cursor-pointer" : ""}`} onClick={() => {
                            if (startIndex + 9 <= allProducts?.length) {
                                setStartIndex(startIndex + 1)
                            }
                        }}>
                            <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="px-[10px] py-[11px]" />
                        </div>
                    </div>
                </div>
                <div className="products flex flex-col gap-[2rem] mb-[1rem]">
                    <div className="row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {allProducts && allProducts.slice(startIndex, startIndex + 4).map((product, index) => (
                            <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cart != null && cart.find(item => item.productID == product._id)} />
                        ))}
                    </div>
                    <div className="row-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {allProducts && allProducts.slice(startIndex + 4, startIndex + 8).map((product, index) => (
                            <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cart != null && cart.find(item => item.productID == product._id)} />
                        ))}
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right" // Position of the toast message
                autoClose={3000} // Duration in milliseconds before toast disappears
                hideProgressBar={false} // Hide progress bar for simplicity
                closeOnClick={true} // Allow closing the toast by clicking
                pauseOnHover
            />
        </div>
    )
}

export default AllProducts

