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
import api from '../api/axiosInstance'
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice'
import { addToCart } from '../slices/cartSlice'
import { setWithExpiry } from '../utils/expiringLocalStorage'

const ProductDetail = () => {
    const { slug, productCode } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const hasRun = useRef(false)
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(state => state.auth)


    const { loading: productLoading, error: productError } = useSelector((state) => state.products);
    const { items: wishlistItems, error: wishlistError } = useSelector(state => state.wishlist)
    const { items: cartItems, error: cartError } = useSelector(state => state.cart);
    const [quantity, setQuantity] = useState(0)
    const [selectedSize, setSelectedSize] = useState(null)
    const [selectedColor, setSelectedColor] = useState(null);
    const [isWishlistSelected, setIsWishlistSelected] = useState(false);
    const [isCreatingBillingRecord, setIsCreatingBillingRecord] = useState(false);

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
                navigate("/p404");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug, productCode])

    useEffect(() => {
        if (product) {
            setIsWishlistSelected(wishlistItems.some(item => item.product._id == product._id))
        }
    }, [wishlistItems, product])


    const toggleWishlistAddition = async () => {
        if (isWishlistSelected) {
            await dispatch(removeFromWishlist({ product })).then(() => toast.success("Product removed from wishlist")).catch(() => toast.error("Something went wrong. Please try again"));
        } else {
            await dispatch(addToWishlist({ product })).then(() => toast.success("Product added to wishlist")).catch(() => toast.error("Something went wrong. Please try again"));
        }

    };

    const handleBuyNowClick = async () => {
        if (!user) {
            const intent = {
                type: 'buyNow',
                product: product._id,
                quantity,
                selectedColor,
                selectedSize,
                timestamp: Date.now()
            };
            setWithExpiry('postAuthRedirect', intent, 30 * 60 * 1000);
            navigate('/login');
            return;
        }
        setIsCreatingBillingRecord(true)
        const item = {
            product: product._id,
            quantity: quantity,
            selectedColor,
            selectedSize,
        };
        if (selectedColor) {
            item.color = selectedColor;
        }
        if (selectedSize) {
            item.size = selectedSize;
        }

        try {
            setIsCreatingBillingRecord(true)
            const res = await api.post("/billing/create-billing-record", {
                items: [item]
            });

            if (res.data && res.data.billingId) {
                const billingPublicId = res.data.billingId;
                console.log("Billing record created with public ID:", billingPublicId);

                navigate(`/billing?billingID=${billingPublicId}`);
            }

        } catch (error) {
            console.error("Error creating billing record:", error);
        } finally {
            setIsCreatingBillingRecord(false);
        }

    };

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
            {(loading || productLoading) && (
                <div className="h-screen flex items-center justify-center">
                    <Loader />
                </div>
            )}
            {(productError || wishlistError) && (
                <ErrorModal
                    message={productError || wishlistError}
                    btnMessage="Retry"
                    onClose={handleClose}
                />
            )}
            <div className={`${loading || productLoading || productError || wishlistError ? 'hidden' : ''}`}>
                {/* Breadcrumbs */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1156px] mx-auto py-4 md:py-6">
                    <Link to="/" className="text-[#605f5f] text-sm hover:text-black">
                        {product && product.category ? product.category.name : 'Category'}
                    </Link>
                    <span className="mx-2 text-sm text-[#605f5f]">/</span>
                    <Link to="#" className="text-sm">
                        {product && product.title ? product.title : 'Product Detail'}
                    </Link>
                </div>
                {/* Breadcrumbs Ends Here*/}

                {/* Product Detail Section */}
                <section className="product-detail w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto my-10 flex flex-col lg:flex-row justify-between gap-8">
                    {/* Image Gallery */}
                    <div className="image flex flex-col md:flex-row gap-4 lg:gap-6 justify-center lg:justify-between w-full lg:w-1/2">
                        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide">
                            <img
                                src={product?.image1 || "https://placehold.co/100x100/F5F5F5/000000?text=Img1"}
                                alt="product thumbnail 1"
                                className='p-2 md:p-6 w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40 object-contain cursor-pointer bg-[#F5F5F5] rounded-md'
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/F5F5F5/000000?text=No+Img"; }}
                            />
                            <img
                                src={product?.image2 || "https://placehold.co/100x100/F5F5F5/000000?text=Img2"}
                                alt="product thumbnail 2"
                                className='p-2 md:p-6 w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40 object-contain cursor-pointer bg-[#F5F5F5] rounded-md'
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/F5F5F5/000000?text=No+Img"; }}
                            />
                            <img
                                src={product?.image3 || "https://placehold.co/100x100/F5F5F5/000000?text=Img3"}
                                alt="product thumbnail 3"
                                className='p-2 md:p-6 w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40 object-contain cursor-pointer bg-[#F5F5F5] rounded-md'
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/F5F5F5/000000?text=No+Img"; }}
                            />
                            <img
                                src={product?.image4 || "https://placehold.co/100x100/F5F5F5/000000?text=Img4"}
                                alt="product thumbnail 4"
                                className='p-2 md:p-6 w-20 h-20 md:w-28 md:h-28 lg:w-40 lg:h-40 object-contain cursor-pointer bg-[#F5F5F5] rounded-md'
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/F5F5F5/000000?text=No+Img"; }}
                            />
                        </div>
                        <div className="w-full max-w-[32rem] h-[20rem] md:h-[28rem] lg:h-[41.5rem] bg-[#F5F5F5] flex items-center justify-center p-4 rounded-md">
                            <img
                                src={product?.mainImage || "https://placehold.co/600x400/F5F5F5/000000?text=Main+Image"}
                                alt="main product"
                                className="object-contain w-full h-full cursor-pointer"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/F5F5F5/000000?text=No+Main+Img"; }}
                            />
                        </div>
                    </div>
                    {/* Image Gallery Ends Here */}

                    {/* Details */}
                    <div className="details flex flex-col justify-between w-full lg:w-1/2 mt-8 lg:mt-0">
                        {/* Title */}
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">{product && product.title}</h2>
                        {/* Rating & Status */}
                        <div className="rating-status flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                            <div className="ratings-reviews flex items-center gap-2">
                                {/* Stars SVG (re-used for clarity, consider abstracting into a component) */}
                                {[...Array(4)].map((_, i) => ( // 4 filled stars
                                    <svg key={`filled-star-${i}`} width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                    </svg>
                                ))}
                                <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* 1 empty star */}
                                    <path opacity="0.25" d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="black" />
                                </svg>
                                {/* Reviews */}
                                <span className="text-xs md:text-sm text-[#888888]">({product && product.reviews} Reviews)</span>
                            </div>
                            {/* Status */}
                            <div className="status ml-0 sm:ml-2 flex items-center border-l sm:border-l-[1px] sm:border-gray-300 pl-2 sm:pl-3">
                                {product && product.stock === 0 ? (
                                    <span className="text-[#DB4444] text-sm">Out Of Stock</span>
                                ) : product && product.stock > 0 && product.stock <= 7 ? (
                                    <span className="text-[#FFA500] text-sm">Low Stock</span>
                                ) : (
                                    <span className="text-[#00FF66] text-sm">In Stock</span>
                                )}
                            </div>
                        </div>
                        {/* Price */}
                        <div className="price mb-4">
                            {product && product?.discount && product?.discount > 0 ? (
                                <>
                                    <span className="text-xl md:text-2xl font-semibold">
                                        ${Math.round(calculateDiscountPrice(product.price, product.discount))}
                                    </span>
                                    <div className="mt-1">
                                        <span className='text-sm md:text-base text-[#888888]'>
                                            <del>${product.price}</del>
                                        </span>
                                        <span className='ml-3 text-sm md:text-base text-[#DB4444] font-semibold'>
                                            -{product.discount}%
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <span className="text-xl md:text-2xl font-semibold">${product && product.price}</span>
                            )}
                        </div>
                        {/* Description */}
                        <div className="desc mb-4">
                            <p className="w-full md:max-w-md lg:max-w-none text-sm md:text-base text-gray-700">{product && product.description}</p>
                        </div>
                        {/* Border */}
                        <div className="border-b border-gray-300 my-4" />
                        {/* Colors */}
                        <div className={`colors ${product && product.colors && product.colors.length > 0 ? 'flex' : 'hidden'} items-center gap-2 mb-4`}>
                            <h4 className="text-base md:text-lg font-medium">Colors:</h4>
                            <div className="options flex items-center gap-2">
                                {product && product.colors && product.colors.map((color, index) => (
                                    <button
                                        key={index}
                                        type="button" // Use button for accessibility
                                        className={`w-6 h-6 border-2 rounded-full cursor-pointer transition-all duration-200 ease-in-out
                                            ${selectedColor === color.toLowerCase() ? 'border-black scale-110' : 'border-gray-300 hover:scale-105'}`}
                                        style={{ backgroundColor: color.toLowerCase(), borderColor: selectedColor === color.toLowerCase() ? '#565454' : color.toLowerCase() }}
                                        onClick={() => handleColorChange(color.toLowerCase())}
                                        aria-label={`Select color ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Size */}
                        <div className={`size w-full ${product && product.sizes && product.sizes.length > 0 ? 'flex' : 'hidden'} flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4`}>
                            <div className="label">
                                <h4 className="text-base md:text-lg font-medium">Size:</h4>
                            </div>
                            <div className="sizes flex flex-wrap gap-2">
                                {product && product.sizes && product.sizes.map((size, index) => (
                                    <SizeComponent
                                        key={index}
                                        size={size}
                                        isSelected={size === selectedSize}
                                        onClick={() => { handleClick(size); }}
                                    />
                                ))}
                            </div>
                        </div>
                        {/* Quantity & Buttons */}
                        <div className="cont flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
                            <div className="qty flex md:w-1/2 lg:w-1/2 sm:w-full">
                                <button
                                    className="p-3 flex items-center justify-center group hover:bg-[#DB4444] border-[1.5px] border-black border-opacity-30 rounded-l-sm hover:border-[#DB4444] transition-colors duration-200"
                                    onClick={() => {
                                        if (quantity - 1 >= (product && product.stock === 0 ? 0 : 1)) {
                                            setQuantity(quantity - 1);
                                        }
                                    }}
                                    aria-label="Decrease quantity"
                                >
                                    <img src="/images/minus.svg" alt="minus" className="group-hover:invert select-none" />
                                </button>
                                <div className="value px-6 flex items-center justify-center border-y-[1.5px] border-black border-opacity-30 flex-grow">
                                    <span className="quantity text-lg md:text-xl select-none">{quantity}</span>
                                </div>
                                <button
                                    className="p-3 flex items-center justify-center group hover:bg-[#DB4444] border-[1.5px] border-black border-opacity-30 rounded-r-sm hover:border-[#DB4444] transition-colors duration-200"
                                    onClick={() => {
                                        if (product && (quantity + 1 <= product.stock)) {
                                            setQuantity(quantity + 1);
                                        }
                                    }}
                                    aria-label="Increase quantity"
                                >
                                    <img src="/images/plus.svg" alt="plus" className="group-hover:invert select-none" />
                                </button>
                            </div>
                            <div className="flex flex-grow justify-between gap-4 w-full sm:w-auto">
                                <button
                                    className={`bg-[#DB4444] ${product?.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#E07575]"} text-white py-3 px-8 rounded-sm select-none transition-colors duration-200 text-base font-semibold w-full md:w-2/3 `}
                                    disabled={product && product.stock === 0 || isCreatingBillingRecord}
                                    onClick={handleBuyNowClick}
                                >
                                    {isCreatingBillingRecord ? 'Processing...' : 'Buy Now'}
                                </button>
                                <button
                                    className="border-[1.5px] flex items-center justify-center border-black border-opacity-30 rounded-sm cursor-pointer group p-3 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => toggleWishlistAddition()}
                                    aria-label="Toggle wishlist"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill={isWishlistSelected ? '#DB4444' : 'none'}
                                        stroke={isWishlistSelected ? '#DB4444' : 'black'}
                                        className="wishlist-icon group-hover:fill-[#DB4444] group-hover:stroke-[#DB4444] transition-colors duration-200"
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeWidth="1.75" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="btn w-full mb-4"> {/* Added a wrapper div for the "Add To Cart" button */}
                            <button
                                className={`bg-black ${product?.stock === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-[#514d4d]"} text-white w-full py-3 rounded-sm select-none transition-colors duration-200 text-base font-semibold`}
                                disabled={product && product.stock === 0}
                                onClick={handleAddToCartClick}
                            >
                                Add To Cart
                            </button>
                        </div>
                        {/* Features */}
                        <div className="features flex flex-col border-[1.5px] border-black border-opacity-30 rounded-sm overflow-hidden">
                            <div className="feature-1 flex items-center p-3 border-b border-gray-300">
                                <div className="icon p-2 flex-shrink-0">
                                    <img src="/images/icon-delivery.svg" alt="delivery icon" />
                                </div>
                                <div className="content flex flex-col gap-1 ml-2">
                                    <h5 className="text-base font-semibold">Free Delivery</h5>
                                    <p className="text-xs md:text-sm text-gray-600 underline">Enter your postal code for Delivery Availability</p>
                                </div>
                            </div>
                            <div className="feature-2 flex items-center p-3">
                                <div className="icon p-2 flex-shrink-0">
                                    <img src="/images/Icon-return.svg" alt="return icon" />
                                </div>
                                <div className="content flex flex-col gap-1 ml-2">
                                    <h5 className="text-base font-semibold">Return Delivery</h5>
                                    <p className="text-xs md:text-sm text-gray-600">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Product Detail Section Ends Here */}
                <ProductsRow title={"Related Item"} />
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

export default ProductDetail
