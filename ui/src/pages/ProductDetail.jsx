import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductsRow from '../components/ProductsRow'
import { useState } from 'react'
import SizeComponent from '../components/SizeComponent'
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator'
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import { useSelector, useDispatch } from 'react-redux'
import { fetchProductByID } from '../slices/productSlice'
import Loader from '../components/Loader'
import ErrorModal from '../components/modals/ErrorModal'
// import { clearDelayedAction, setDelayedAction } from '../slices/userSlice'
// import { addItemToWishlist, getWishlistItems, removeFromWishlist } from '../slices/wishlistSlice'
import { createBillingRecord } from '../slices/billingSlice'
import api from '../api/axiosInstance'
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice'
import { addToCart } from '../slices/cartSlice'

const ProductDetail = () => {
    const { slug, productCode } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const hasRun = useRef(false)
    const [loading, setLoading] = useState(false);

    const { loading: productLoading, error: productError } = useSelector((state) => state.products);
    const { items: wishlistItems, error: wishlistError } = useSelector(state => state.wishlist)
    const { items: cartItems, error: cartError } = useSelector(state => state.cart);
    const { loading: billingLoading, error: billingError } = useSelector(state => state.billing)
    const { user, delayedAction } = useSelector(state => state.user)
    const [quantity, setQuantity] = useState(0)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null);
    const [isWishlistSelected, setIsWishlistSelected] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/products/${slug}/${productCode}`);
                const product = res?.data;
                setProduct(product);
                setQuantity(product?.stock == 0 ? 0 : 1)
                if (product?.colors) {
                    setSelectedColor(product.colors[0].toLowerCase())
                }
                if (product?.sizes) {
                    setSelectedSize(product.sizes[0])
                }
            } catch (error) {
                location("/p404");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug, productCode])

    // useEffect(() => {
    //     if (product != null) {
    //         setQuantity(product?.stock == 0 ? 0 : 1)
    //         if (product.colors) {
    //             setSelectedColor(product.colors[0].toLowerCase())
    //         }
    //         if (product.sizes) {
    //             setSelectedSize(product.sizes[0])
    //         }
    //     }
    // }, [product])
    useEffect(() => {
        if (product) {
            setIsWishlistSelected(wishlistItems.some(item => item.product._id == product._id))
        }
    }, [wishlistItems, product])

    useEffect(() => {
        if (user && delayedAction && !hasRun.current) {
            // processDelayedAction(delayedAction);
            // dispatch(clearDelayedAction());
            hasRun.current = true;
        }
    }, [user, delayedAction]);


    // Handles the buy now action
    const handleBuyNowAction = async (productID, quantity, color, size) => {
        // try {
        //     const items = [{ product: productID, quantity, color, size }];
        //     const response = await dispatch(createBillingRecord({ items, couponID: null })).unwrap();
        //     navigate(`/billing?buyNow=true&billingID=${response.id}`);
        // } catch (error) {
        //     toast.error(billingError || error);
        // }
    };

    // Processes the delayed action after login
    const processDelayedAction = (action) => {
        // if (action.type === "wishlist") {
        //     handleWishlistAction(action.isAdded, action.id, 1, action.color, action.size);
        // } else if (action.type === "buyNow") {
        //     handleBuyNowAction(action.id, action.quantity, action.color, action.size);
        // }
    };

    // Common function to handle user authentication before proceeding
    const handleAuthBeforeAction = (actionType, actionPayload) => {
        // if (!user) {
        //     dispatch(setDelayedAction({ type: actionType, ...actionPayload }));
        //     navigate("/login", { state: { from: location.pathname } });
        //     return false;
        // }
        // return true;
    };

    // Wishlist button click handler
    const toggleWishlistAddition = async () => {
        if (isWishlistSelected) {
            await dispatch(removeFromWishlist({ product })).then(() => toast.success("Product removed from wishlist")).catch(() => toast.error("Something went wrong. Please try again"));
        } else {
            await dispatch(addToWishlist({ product })).then(() => toast.success("Product added to wishlist")).catch(() => toast.error("Something went wrong. Please try again"));
        }

    };

    // Buy now button click handler
    const handleBuyNowClick = async () => {
        // if (!handleAuthBeforeAction("buyNow", { id: product._id, quantity, color: selectedColor || null, size: selectedSize || null })) return;
        // await handleBuyNowAction(product._id, quantity, selectedColor || null, selectedSize || null);
    };

    console.log()
    const handleAddToCartClick = async () => {
        await dispatch(addToCart({ product: product?._id, quantity, selectedColor, selectedSize })).then(() => toast.success("Product added to cart")).catch(() => toast.error("Something went wrong. Please try again"));
    }

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };
    const handleClick = (size) => {
        setSelectedSize(size)
    }

    const handleClose = () => {
        window.location.reload()
    }
    return (
        <div>
            {billingLoading || loading && <div className="h-screen flex items-center justify-center"><Loader /></div>}
            {productError || wishlistError ? <ErrorModal message={productError != null ? productError : wishlistError} btnMessage={"Retry"} onClose={() => handleClose()} /> : ''}
            <div className={`${loading || billingLoading || productLoading ? 'hidden' : ''} ${productError || wishlistError ? 'hidden' : ''}`}>
                {/* Breadcrumbs */}
                <div className="nav w-[1156px] h-[21px] my-[34px] mx-auto">
                    <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">{product && product.category.name}</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="#" className="text-[14px]">{product && product.title}</Link>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Product Detail */}
                <section className="product-detail w-[1170px] flex justify-between mx-auto my-10">
                    {/* Image */}
                    <div className="image flex gap-6 justify-between">
                        <div className="flex flex-col space-x-4">
                            <div className="flex items-center justify-center flex-col space-y-2">
                                <img src={product?.image1} alt="product" className='p-6 w-40 h-40 object-contain cursor-pointer bg-[#F5F5F5]' />
                                <img src={product?.image2} alt="product" className='p-6 w-40 h-40 object-contain cursor-pointer bg-[#F5F5F5]' />
                                <img src={product?.image3} alt="product" className='p-6 w-40 h-40 object-contain cursor-pointer bg-[#F5F5F5]' />
                                <img src={product?.image4} alt="product" className='p-6 w-40 h-40 object-contain cursor-pointer bg-[#F5F5F5]' />
                            </div>
                            {/* <div className="pic-1  flex items-center justify-center bg-[#F5F5F5]">
                                <img src={product && product.image1} alt="product" className="p-6 object-contain" />
                            </div>
                            <div className="pic-2  flex items-center justify-center bg-[#F5F5F5]">
                                <img src={product && product.image2} alt="product" className="p-6 object-contain" />
                            </div>
                            <div className="pic-3  flex items-center justify-center bg-[#F5F5F5]">
                                <img src={product && product.image3} alt="product" className="p-6 object-contain" />
                            </div>
                            <div className="pic-4  flex items-center justify-center bg-[#F5F5F5]">
                                <img src={product && product.image4} alt="product" className="p-6 object-contain" />
                            </div> */}
                        </div>
                        <div className="">
                            <img src={product?.mainImage} alt="product" className="p-24 object-contain w-[32rem] h-[41.5rem] bg-[#F5F5F5] cursor-pointer" />
                        </div>
                    </div>
                    {/* Image Ends Here */}
                    {/* Details */}
                    <div className="details max-h-[41.5rem] flex flex-col justify-between">
                        {/* Title */}
                        <h2 className="text-[24px] font-semibold">{product && product.title}</h2>
                        {/* Title Ends*/}
                        {/* Rating & Status */}
                        <div className="rating-status flex items-center ">
                            <div className="ratings-reviews w-max flex items-center justify-between gap-2">
                                {/* Stars */}
                                <div className="stars flex  justify-between items-center">
                                    <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                    </svg>
                                    <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                    </svg>
                                    <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                    </svg>
                                    <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                    </svg>
                                    <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.25" d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="black" />
                                    </svg>
                                </div>
                                {/* Stars End */}
                                {/* Reviews */}
                                <div className="reviews mb-1">
                                    <span className="text-[14px] text-[#888888]">({product && product.reviews} Reviews)</span>
                                </div>
                                {/* Reviews End*/}
                            </div>
                            <div className="status ml-[7px] flex">
                                <div className="border-l" />
                                {product && product.stock === 0 ? (
                                    <span className="text-[#DB4444] text-[14px] h-[21px] pl-[5px]">Out Of Stock</span>
                                ) : product && product.stock > 0 && product.stock <= 7 ? (
                                    <span className="text-[#FFA500] text-[14px] h-[21px] pl-[5px]">Low Stock</span>
                                ) : (
                                    <span className="text-[#00FF66] text-[14px] h-[21px] pl-[5px]">In Stock</span>
                                )}
                            </div>
                        </div>
                        {/* Rating & Status Ends Here */}
                        {/* Price */}
                        <div className="price">
                            {product && product?.discount && product?.discount > 0 ? (
                                <>
                                    <span className="text-[24px]">
                                        ${Math.round(calculateDiscountPrice(product.price, product.discount))}
                                    </span>
                                    <div>
                                        <span className='text-[16px] text-[#888888]'>
                                            <del>${product.price}</del>
                                        </span>
                                        <span className='ml-[15px] text-[16px] text-[#DB4444]'>
                                            -{product.discount}%
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-[24px]">${product && product.price}</span>
                            )}

                        </div>
                        {/* Price Ends Here*/}
                        {/* Description */}
                        <div className="desc">
                            <p className="w-96">{product && product.description}</p>
                        </div>
                        {/* Description Ends Here*/}
                        {/* Border */}
                        <div className="border-b" />
                        {/* Border Ends Here*/}
                        {/* Colors */}
                        <div className={`colors ${product && product.colors ? 'flex' : 'hidden'} items-center`}>
                            <h4 className="text-[20px]">Colors:</h4>
                            <div className="options ml-[10px]  h-[20px] flex ">
                                {product && product.colors && product.colors.map((color, index) => (
                                    <input key={index} type="radio" name="color" id={color.toLowerCase()} className={`appearance-none w-5 h-5 border-2 rounded-full cursor-pointer mr-[5px]`} style={{ backgroundColor: color.toLowerCase(), borderColor: selectedColor === color.toLowerCase() ? '#565454' : color.toLowerCase() }} onClick={() => handleColorChange(color.toLowerCase())} />
                                ))}
                            </div>
                        </div>
                        {/* Colors Ends Here*/}
                        {/* Size */}
                        <div className={`size w-max ${product && product.sizes ? 'flex' : 'hidden'} gap-4 `}>
                            <div className="label">
                                <h4 className="text-[20px]">Size:</h4>
                            </div>
                            <div className="sizes flex gap-4">
                                {product && product.sizes && product.sizes.map((size, index) => (
                                    <SizeComponent key={index} size={size} isSelected={size === selectedSize} onClick={() => { handleClick(size) }} />
                                ))}
                            </div>
                        </div>
                        {/* Size Ends Here*/}
                        {/* Quantity & Button & Wishlist */}
                        <div className="cont flex items-center justify-between">
                            <div className="qty flex ">
                                <div className="decrease p-3 flex items-center justify-center group hover:bg-[#DB4444] border-[1.5px] border-black border-opacity-30 rounded-sm rounded-r-none hover:border-[#DB4444]" onClick={() => {
                                    if (quantity - 1 >= (product && product.stock == 0 ? 0 : 1)) {
                                        setQuantity(quantity - 1)
                                    }
                                }}>
                                    <div className="icon flex items-center justify-center">
                                        <img src={`/images/minus.svg`} alt="minus" className="group-hover:invert select-none" />
                                    </div>
                                </div>
                                <div className="value px-8 flex items-center justify-center border-y-[1.5px] border-black border-opacity-30">
                                    <span className="quantity text-[20px] select-none">{quantity}</span>
                                </div>
                                <div className="increase p-3 flex items-center justify-center group hover:bg-[#DB4444] border-[1.5px] border-black border-opacity-30 rounded-sm rounded-l-none hover:border-[#DB4444]" onClick={() => {
                                    if (product && (quantity + 1 <= product.stock)) {
                                        setQuantity(quantity + 1)
                                    }
                                }}>
                                    <div className="icon flex items-center justify-center">
                                        <img src="/images/plus.svg" alt="plus" className="group-hover:invert select-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="btn">
                                <button className={`bg-[#DB4444] ${product?.stock == 0 ? "" : "cursor-pointer hover:bg-[#E07575]"} text-white py-[0.65rem] px-10 rounded-sm select-none`} disabled={product && product.stock == 0 ? true : false} onClick={handleBuyNowClick}>Buy Now</button>
                            </div>
                            <div className="wishlist border-[1.5px] flex items-center justify-center border-black border-opacity-30 rounded-sm cursor-pointer group" onClick={() => toggleWishlistAddition(product)}>
                                <div className="icon flex items-center justify-center p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isWishlistSelected ? '#DB4444' : 'none'} stroke={isWishlistSelected ? '#DB4444' : 'black'} className="wishlist-icon hover:fill-[#DB4444] hover:stroke-[#DB4444]">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="1.75" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="btn">
                            <button className={`bg-black ${product?.stock == 0 ? "" : "cursor-pointer hover:bg-[#514d4d]"} text-white w-full h-full py-3 rounded-sm select-none`} disabled={product && product.stock == 0 ? true : false} onClick={handleAddToCartClick}>Add To Cart</button>
                        </div>
                        {/* Quantity & Button & Wishlist Ends Here*/}
                        {/* Features */}
                        <div className="features flex flex-col border-[1.5px] border-black border-opacity-30 rounded-sm ">
                            <div className="feature-1  flex items-center p-2">
                                <div className="icon p-2">
                                    <img src="/images/icon-delivery.svg" alt="icon-delivery" />
                                </div>
                                <div className="content flex flex-col gap-2 ml-2">
                                    <div className="heading">
                                        <h5 className="text-[16px] font-semibold">Free Delivery</h5>
                                    </div>
                                    <div className="desc">
                                        <p className="text-[11px] underline font-poppins font-medium">Enter your postal code for Delivery Availability</p>
                                    </div>
                                </div>
                            </div>
                            <div className="border-b border-black" />
                            <div className="feature-2  flex items-center p-2">
                                <div className="icon p-2">
                                    <img src="/images/Icon-return.svg" alt="icon-return" />
                                </div>
                                <div className="content flex flex-col gap-2 ml-2">
                                    <div className="heading">
                                        <h5 className="text-[16px] font-semibold">Return Delivery</h5>
                                    </div>
                                    <div className="desc">
                                        <p className="text-[11px] font-poppins font-medium">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Features Ends Here*/}
                    </div>
                    {/* Details Ends Here */}
                </section>
                {/* Product Detail Section Ends Here */}
                <ProductsRow title={"Related Item"} />
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

export default ProductDetail
