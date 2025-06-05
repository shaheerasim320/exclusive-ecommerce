import React, { useEffect, useRef, useState, } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard"
import { Link, useNavigate } from "react-router-dom"
import FeatureCard from "../components/FeatureCard";
import { useDispatch, useSelector } from "react-redux";
import { startTimer, updateTimer } from "../slices/timerSlice";
import { fetchProducts, fetchFlashSaleProducts, fetchBestSellingProducts } from "../slices/productSlice";
import Loader from "../components/Loader"
import ErrorModal from "../components/modals/ErrorModal";
// import { addItemToWishlist, getWishlistItems, removeFromWishlist } from "../slices/wishlistSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { addItemToCart, getCartItems } from "../slices/cartSlice";
import { clearDelayedAction } from "../slices/userSlice";
import { getHirearcialDropDownCategories, getMainCategories, getSubCategories } from "../slices/CategorySlice";
import { addToWishlist, removeFromWishlist } from "../slices/wishlistSlice";
import { addToCart, updateProductQuantity } from "../slices/cartSlice";


const Home = () => {
    const features = [
        {
            title: "FREE AND FAST DELIVERY",
            desc: "Free delivery for all orders over $140",
            image: "/images/Services.png"
        },
        {
            title: "24/7 CUSTOMER SERVICE",
            desc: "Friendly 24/7 customer support",
            image: "/images/Services-1.png"
        },
        {
            title: "MONEY BACK GUARANTEE",
            desc: "We return money within 30 days",
            image: "/images/Services-2.png"
        }
    ]
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const timers = useSelector((state) => state.timer.timers)
    const [loading, setLoading] = useState(false);
    const { user, delayedAction } = useSelector(state => state.user)
    const { products, flashSaleProducts, bestSellingProducts, error } = useSelector((state) => state.products)
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { items: cartItems, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const hasRun = useRef(false)
    const { mainCategories, loading: categoryLoading, subCategories, hirearcialDropDownCategories } = useSelector(state => state.category)
    const [hoveredIndex, setHoveredIndex] = useState(null);



    useEffect(() => {
        if (user && delayedAction && !hasRun.current) {
            if (delayedAction.type == "wishlist") {
                handleWishlistToggle(delayedAction.isAdded, delayedAction.id, 1, delayedAction.color, delayedAction.size)
            }
            if (delayedAction.type == "cart") {
                handleAddToCartClick(delayedAction.id, 1, delayedAction.color, delayedAction.size)
            }
            dispatch(clearDelayedAction())
            hasRun.current = true
        }
    }, [user, delayedAction])

    const [flashProductsStartIndex, setFlashProductsStartIndex] = useState(0)
    const [bestSellingProductsStartIndex, setBestSellingProductsStartIndex] = useState(0)
    const [categoryStartIndex, setCategoryStartIndex] = useState(0)
    const [productsStartIndex, setProductsStartIndex] = useState(0)

    const timerArray = [
        { id: 1, time: ((3 * 24 * 60 * 60) + (23 * 60 * 60) + (59 * 60) + 59) },
        { id: 2, time: ((5 * 24 * 60 * 60) + (23 * 60 * 60) + (59 * 60) + 59) }
    ];

    useEffect(() => {
        timerArray.forEach((timer) => {
            dispatch(startTimer({ id: timer.id, time: timer.time }));
        });
    }, [dispatch]);

    useEffect(() => {
        let interval;
        if (timers.some((timer) => timer.isRunning)) {
            interval = setInterval(() => {
                dispatch(updateTimer());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timers, dispatch]);

    const handleClose = () => {
        window.location.reload();
    }
    const handleWishlistToggle = async (product) => {
        if (items.some(item => item.product?._id == product)) {
            await dispatch(removeFromWishlist({ product })).then(() => { toast.success("Product removed from wishlist") }).catch(()=>toast.error("Something went wrong. Please try again"));
        } else {
            await dispatch(addToWishlist({ product })).then(() => { toast.success("Product added to wishlist") }).catch(()=>toast.error("Something went wrong. Please try again"));;
        }
    }

    const handleAddToCartClick = async (productID, quantity = 1, size = null, color = null) => {
        if (cartItems.some(item => item.productId == productID && item.color == color && item.size == size)) {
            const productIndex = cartItems.findIndex(item => item.productId == productID && item.color == color && item.size == size);
            await dispatch(updateProductQuantity({ product: productID, quantity: cartItems[productIndex].quantity + 1, color, size })).unwrap();
            toast.success("Product quantity updated in cart");
            return;
        }
        console.log(`ProductID: ${productID} Quantity: ${quantity} Color: ${color} Size: ${size}`)
        await dispatch(addToCart({ product: productID, quantity, color, size })).unwrap();
        toast.success("Product added to cart");
    };


    return (
        <div className="min-h-[320px]">
            {loading || cartLoading || categoryLoading ? <div className="h-screen flex justify-center items-center"><Loader /></div> : ""}
            {error ? <ErrorModal onClose={() => handleClose()} message={"Server Error. Something went wrong!"} btnMessage={"Retry"} /> : ""}
            <div className={`${loading || cartLoading || categoryLoading ? "hidden" : ""} ${error ? "hidden" : ""}`}>
                {/* Hero Section Starts Here */}
                <section className="hero flex w-[1150px] m-auto">
                    <aside className="mt-[32px]">
                        <ul className="w-[8rem]">
                            {hirearcialDropDownCategories && hirearcialDropDownCategories.map((category, index) => (
                                <li className="relative mb-[15px] hover:text-[#919090] cursor-pointer" key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                                    {category?.name}
                                    <div className={`${(category && category.subCategories?.length > 0) && hoveredIndex == index ? "absolute" : "hidden"} left-full top-0 bg-white shadow-lg border rounded-md p-2 z-50 min-w-[13rem]`}>
                                        <ul>
                                            {category.subCategories && category.subCategories.map((sub, subIndex) => (
                                                <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer hover:text-black" key={subIndex}><Link to={`/category/${sub.slug}`}>{sub.name}</Link></li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    <div className="border-r border-gray-300 mx-4" />
                    {/* Content on the left */}

                    {/* Slider Images */}
                    <div className="mt-[34px] ml-[34px] relative w-[892px] h-[344px]">
                        <div className="relative w-[892px] h-[344px] overflow-hidden ">
                            <Carousel
                                showArrows={true} // Show next/prev arrows
                                showThumbs={false} // Hide the thumbnail indicators
                                infiniteLoop={true} // Enable infinite loop of slides
                                autoPlay={true} // Enable auto play for slides
                                interval={3000} // Auto play interval (in ms)
                                transitionTime={400} // Transition time between slides (in ms)
                                emulateTouch={true} // Enable swipe functionality on mobile
                                swipeable={true} // Enable swipe gestures
                                showStatus={false}
                            >
                                <div>
                                    <img src="/images/banner.jpg" alt="Slide 1" />
                                </div>
                                <div>
                                    <img src="/images/banner.jpg" alt="Slide 2" />
                                </div>
                                <div>
                                    <img src="/images/banner.jpg" alt="Slide 3" />
                                </div>
                            </Carousel>

                        </div>
                    </div>
                    {/* Slider Images Ends Here*/}
                </section>
                {/* Hero Section Ends Here */}

                {/* Flash Sales Section Starts Here */}
                <section className={`flash-sales w-[1170px]  mx-auto  mt-[134px] ${flashSaleProducts?.length == 0 ? "hidden" : ""}`}>
                    <div>
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-[15px] items-center">
                            <div className="rectangle w-[20px] h-[40px] bg-[#db4444]" />
                            <div className="text">
                                <p className="text-[16px] font-semibold text-[#db4444]">Today's</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}
                        {/* Main Title Box Starts Here */}
                        <div className="main-title-box flex items-center w-[1170px] justify-between">
                            {/* Main Title Box Starts Here */}
                            <div className="title flex items-center gap-[73px]">
                                {/* Title Starts Here */}
                                <h2 className="text-[36px] font-semibold inline-block">Flash Sales</h2>
                                {/* Title Ends Here */}
                                {/* Time Box Starts Here */}
                                <div className="time mb-[11px]">
                                    <div className="label flex ">
                                        <span className="text-[12px] font-semibold">Days</span>
                                        <span className="text-[12px] font-semibold ml-[41px]">Hours</span>
                                        <span className="text-[12px] font-semibold ml-[34px]">Minutes</span>
                                        <span className="text-[12px] font-semibold ml-[18px]">Seconds</span>
                                    </div>
                                    <div className="actual-time flex gap-[12px]">
                                        <span className="flash-days-text text-[32px] font-bold">{timers[0]?.time ? "0" + Math.floor(timers[0].time / (24 * 60 * 60)) : "03"}</span>
                                        <span className="text-[#E07575] text-[32px]">:</span>
                                        <span className="flash-hours-text text-[32px] font-bold" >{timers[0]?.time ? Math.floor((timers[0].time % (24 * 60 * 60)) / (60 * 60)) : "23"}</span>
                                        <span className="text-[#E07575] text-[32px]">:</span>
                                        <span className="flash-minutes-text text-[32px] font-bold">{timers[0]?.time ? Math.floor((timers[0].time % (60 * 60)) / 60) : "59"}</span>
                                        <span className="text-[#E07575] text-[32px]">:</span>
                                        <span className="flash-seconds-text text-[32px] font-bold" >{timers[0]?.time ? timers[0].time % 60 : "59"}</span>
                                    </div>
                                </div>
                                {/* Time Box Ends Here */}
                            </div>
                            {/* Inner Title Box Ends Here */}
                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-[5px]">
                                <div className={`prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5]  ${flashProductsStartIndex === 0 ? "" : "hover:bg-[#a7a6a6] hover:cursor-pointer"}`} onClick={() => {
                                    if (flashProductsStartIndex - 1 >= 0) {
                                        setFlashProductsStartIndex(flashProductsStartIndex - 1)
                                    }
                                }}>
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                                <div className={`next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${flashProductsStartIndex + 4 < flashSaleProducts?.length ? "hover:bg-[#a7a6a6] hover:cursor-pointer" : ""}`} onClick={() => {
                                    if (flashProductsStartIndex + 5 <= flashSaleProducts?.length) {
                                        setFlashProductsStartIndex(flashProductsStartIndex + 1)
                                    }
                                }}>
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Main Title Box Ends Here */}
                    </div>

                    <div>
                        {/* Flash Sale Products Container Starts Here */}
                        <div className="products-flash-sale grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {flashSaleProducts?.length > 0 && flashSaleProducts.slice(flashProductsStartIndex, flashProductsStartIndex + 5).map((product, index) => (
                                <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cartItems.some(item => item.product == product._id)} />
                            ))}
                        </div>
                        {/* Flash Sale Products Container End Here */}

                        {/* Button */}
                        <div className="button flex justify-center my-[75px]">
                            <button className="btn-1">
                                <Link to="#">View All Products</Link>
                            </button>
                        </div>
                        {/* Button Ends Here */}
                    </div>
                </section>
                {/* Flash Sales Section Ends Here */}

                <div className="border-t border-gray-300 my-[74px]" />

                {/* Categories Section Starts Here */}
                <section className="categories h-[313px] w-[1170px] m-auto my-[40px]">
                    {/* Heading And Title Container */}
                    <div className="header-container flex flex-col gap-[8px]">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-[15px] items-center">
                            <div className="rectangle w-[20px] h-[40px] bg-[#db4444]" />
                            <div className="text">
                                <p className="text-[16px] font-semibold text-[#db4444]">Categories</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}
                        <div className="main-title-box flex items-center w-[1170px] justify-between">
                            {/* Main Title Box Starts Here */}
                            <div className="title flex">
                                {/* Title Starts Here */}
                                <h2 className="text-[36px] font-semibold inline-block">Browse By Category</h2>
                                {/* Title Ends Here */}
                            </div>
                            {/* Inner Title Box Ends Here */}
                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-[5px]">
                                <div className={`prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5]  ${categoryStartIndex === 0 ? "" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`} onClick={() => {
                                    if (categoryStartIndex - 1 >= 0) {
                                        setCategoryStartIndex(categoryStartIndex - 1)
                                    }
                                }}>
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                                <div className={`next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${categoryStartIndex + 6 < subCategories?.length ? "hover:bg-[#d4d4d4] hover:cursor-pointer" : ""}`} onClick={() => {
                                    if (categoryStartIndex + 7 <= subCategories?.length) {
                                        setCategoryStartIndex(categoryStartIndex + 1)
                                    }
                                }}>
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Title Box Ends Here */}
                    </div>
                    {/* Header & Title Box Ends Here */}

                    <div className="categories mt-[60px] w-[1170px] h-[145px] flex gap-[30px] overflow-hidden">
                        {subCategories && subCategories.slice(categoryStartIndex, categoryStartIndex + 6).map((category, index) => (
                            <Link to={`/category/${category.slug}`} key={index}>
                                <CategoryCard key={index} category={category} />
                            </Link>
                        ))}
                    </div>

                </section>
                {/* Categories Section Ends Here */}

                <div className="border-t border-gray-300 my-[74px]" />

                {/* Best Selling Products Section Starts Here */}
                <section className="best-selling-products w-[1170px] h-[518px] m-auto">
                    {/* Header & Title Box Starts Here */}
                    <div className="header-container flex flex-col gap-[8px]">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-[15px] items-center">
                            <div className="rectangle w-[20px] h-[40px] bg-[#db4444]" />
                            <div className="text">
                                <p className="text-[16px] font-semibold text-[#db4444]">This Month</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}
                        <div className="main-title-box flex items-center w-[1170px] my-2 justify-between">
                            {/* Main Title Box Starts Here */}
                            <div className="title flex">
                                {/* Title Starts Here */}
                                <h2 className="text-[36px] font-semibold inline-block">Best Selling Products</h2>
                                {/* Title Ends Here */}
                            </div>
                            {/* Inner Title Box Ends Here */}
                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-[5px]">
                                <div className={`prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${bestSellingProductsStartIndex === 0 ? "" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`} onClick={() => {
                                    if (bestSellingProductsStartIndex - 1 >= 0) {
                                        setBestSellingProductsStartIndex(bestSellingProductsStartIndex - 1)
                                    }
                                }}>
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                                <div className={`next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${bestSellingProductsStartIndex + 4 < bestSellingProducts?.length ? "hover:bg-[#d4d4d4] hover:cursor-pointer" : ""}`} onClick={() => {
                                    if (bestSellingProductsStartIndex + 5 <= bestSellingProducts?.length) {
                                        setBestSellingProductsStartIndex(bestSellingProductsStartIndex + 1)
                                    }
                                }}>
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Title Box Ends Here */}
                    </div>
                    {/* Header & Title Box Ends Here */}
                    {/* Product Container Starts Here */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                        {bestSellingProducts.slice(bestSellingProductsStartIndex, bestSellingProductsStartIndex + 4).map((product, index) => (
                            <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product?._id == product._id)} isAddToCartSelected={cartItems.some(item => item.product == product._id)} />
                        ))}
                    </div>
                    {/* Product Container Ends Here */}

                </section>
                {/* Best Selling Products Section Ends Here */}

                {/* Section Starts Here */}
                <section className="w-[1170px] h-[500px] bg-black mx-auto my-[64px] flex items-center justify-center gap-[19px]">
                    <div className="content-box flex flex-col gap-[40px] w-[386px]">
                        <h3 className="text-[#00FF66] text-[16px] font-semibold">Categories</h3>
                        <h1 className="text-[48px] font-semibold text-white w-[441px]">Enhance Your Music Experience</h1>
                        <div className="time flex gap-[24px]">
                            <div className="days h-[62px] w-[62px] rounded-full bg-white">
                                <div className="days-content w-[32px] h-[34px] flex flex-col items-center mx-[15px] my-[11px]">
                                    <h6 className="cat-days-text text-[16px] font-semibold">{timers[1]?.time ? "0" + Math.floor(timers[1].time / (24 * 60 * 60)) : "05"}</h6>
                                    <p className="text-[11px]">Days</p>
                                </div>
                            </div>
                            <div className="days h-[62px] w-[62px] rounded-full bg-white">
                                <div className="hours-content w-[32px] h-[34px] flex flex-col items-center mx-[15px] my-[11px]">
                                    <h6 className="cat-hours-text text-[16px] font-semibold">{timers[1]?.time ? Math.floor((timers[1].time % (24 * 60 * 60)) / (60 * 60)) : "23"}</h6>
                                    <p className="text-[11px]">Hours</p>
                                </div>
                            </div>
                            <div className="minutes h-[62px] w-[62px] rounded-full bg-white">
                                <div className="minutes-content w-[32px] h-[34px] flex flex-col items-center mx-[15px] my-[11px] ">
                                    <h6 className="cat-minutes-text text-[16px] font-semibold ">{timers[1]?.time ? Math.floor((timers[1].time % (60 * 60)) / 60) : "59"}</h6>
                                    <p className="text-[11px]">Minutes</p>
                                </div>
                            </div>
                            <div className="seconds h-[62px] w-[62px] rounded-full bg-white">
                                <div className="seconds-content w-[32px] h-[34px] flex flex-col items-center mx-[15px] my-[11px]">
                                    <h6 className="cat-seconds-text text-[16px] font-semibold ">{timers[1]?.time ? timers[1].time % 60 : "59"}</h6>
                                    <p className="text-[11px]">Seconds</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn-2 w-[171px] mx-0" onClick={() => navigate("/category/speakers")}>Buy Now!</button>
                    </div>
                    <div className="image w-[600px] h-[420px]">
                        <img src="/images/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png" className="w-[568px] h-[330px] my-[44px] mx-auto custom-shadow " />
                    </div>
                </section>
                {/* Section Ends Here */}
                {/* Our Products Section Starts Here */}
                <section className="our-products w-[1170px] h-[1016px] m-auto">
                    {/* Heading And Title Container */}
                    <div className="header-container flex flex-col gap-[8px]">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-[15px] items-center">
                            <div className="rectangle w-[20px] h-[40px] bg-[#db4444]" />
                            <div className="text">
                                <p className="text-[16px] font-semibold text-[#db4444]">Our Products</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}
                        <div className="main-title-box flex items-center w-[1170px] justify-between">
                            {/* Main Title Box Starts Here */}
                            <div className="title flex">
                                {/* Title Starts Here */}
                                <h2 className="text-[36px] font-semibold inline-block">Explore Our Products</h2>
                                {/* Title Ends Here */}
                            </div>
                            {/* Inner Title Box Ends Here */}
                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-[5px]">
                                <div className={`prev w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${productsStartIndex === 0 ? "" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`} onClick={() => {
                                    if (productsStartIndex - 1 >= 0) {
                                        setProductsStartIndex(productsStartIndex - 1)
                                    }
                                }}>
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                                <div className={`next w-[46px] h-[46px] rounded-full bg-[#F5F5F5] ${productsStartIndex + 8 < products?.length ? "hover:bg-[#d4d4d4] hover:cursor-pointer" : ""}`} onClick={() => {
                                    if (productsStartIndex + 9 <= products?.length) {
                                        setProductsStartIndex(productsStartIndex + 1)
                                    }
                                }}>
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="px-[10px] py-[11px]" />
                                </div>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Title Box Ends Here */}
                    </div>
                    {/* Header & Title Box Ends Here */}
                    <div className="products-cont mt-[60px] w-[1170px] flex flex-col gap-4 ">
                        <div className="row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {products.slice(productsStartIndex, productsStartIndex + 4).map((product, index) => (
                                <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cartItems.some(item => item.product == product._id)} />
                            ))}
                        </div>
                        <div className="row-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {products.slice(productsStartIndex + 4, productsStartIndex + 8).map((product, index) => (
                                <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product == product._id)} isAddToCartSelected={cartItems.some(item => item.product == product._id)} />
                            ))}
                        </div>
                    </div>
                    <div className="btn flex justify-center">
                        <button className="btn-1 mt-[60px] " onClick={() => navigate("/all-products")}>View All Products</button>
                    </div>
                </section>
                {/* Our Products Section Ends Here */}

                <section className="featured w-[1170px] h-[768px] m-auto">
                    {/* Heading And Title Container */}
                    <div className="header-container flex flex-col gap-[8px]">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-[15px] items-center">
                            <div className="rectangle w-[20px] h-[40px] bg-[#db4444]" />
                            <div className="text">
                                <p className="text-[16px] font-semibold text-[#db4444]">Featured</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}
                        <div className="title w-[1170px]">
                            {/* Title Starts Here */}
                            <h2 className="text-[36px] font-semibold inline-block">New Arrival</h2>
                            {/* Title Ends Here */}
                        </div>
                    </div>
                    {/* Header & Title Box Ends Here */}
                    <div className="new-arrival w-[1170px] h-[600px] grid grid-cols-2 mt-[60px]">
                        {/* Col-1 */}
                        <div className="col-1 w-[570px] h-[600px]">
                            <div className="item-1 bg-black w-[570px] h-[600px]">
                                <div className="image w-[570px] h-[600px] py-[89px]">
                                    <img src="/images/ps5-slim-goedkope-playstation_large 1.png" alt="playstation" className="mx-auto" />
                                </div>
                                <div className="content w-[242px] h-[122px] flex flex-col gap-[16px] text-white relative bottom-[155px] left-[34px]">
                                    <div className="heading-desc h-[82px] w-[242px]">
                                        <h3 className="text-[24px] font-semibold">PlayStation 5</h3>
                                        <p className="text-[14px]">Black and White version of the PS5 coming out on sale.</p>
                                    </div>
                                    <div className="btn">
                                        <Link to="/category/consoles" className="underline">Shop Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Col-1 Ends */}
                        {/* Col-2 */}
                        <div className="col-2 flex flex-col gap-[32px]">
                            {/* Row 1 */}
                            <div className="row-1 w-[570px] h-[284px]">
                                {/* Item-2 */}
                                <div className="item-2 w-[570px] h-[284px] bg-[#0D0D0D] flex flex-col">
                                    <div className="image w-[432px] h-[286px] ml-[136px]">
                                        <img src="/images/attractive-woman-wearing-hat-posing-black-background 1.png" alt="Women's Collection" className="w-[432px] h-[284px]" />
                                    </div>
                                    <div className="content w-[191px] h-[85px] flex flex-col gap-[8px] text-white relative bottom-[165px] left-[23px]">
                                        <div className="heading-desc w-[255px] h-[82px] ">
                                            <h3 className="text-[24px] font-semibold inline-block">Women's Collections</h3>
                                            <p className="text-[14px]">Featured woman collections that give you another vibe.</p>
                                        </div>
                                        <div className="btn">
                                            <Link to="/category/womens-clothing" className="underline">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Item-3 Ends */}
                            </div>
                            {/* Row 1 Ends */}
                            {/* Row 2 */}
                            <div className="row-2 w-[570px] h-[284px] flex gap-[30px]">
                                {/* Item-3 */}
                                <div className="item-3 w-[270px] h-[284px] bg-black flex flex-col items-center">
                                    <div className="image w-[210px] h-[222px] mx-auto my-[13px]">
                                        <img src="/images/69-694768_amazon-echo-png-clipart-transparent-amazon-echo-png 1.png" alt="speaker" className="mx-auto" />
                                    </div>
                                    <div className="content w-[191px] h-[85px] flex flex-col gap-[8px] text-white relative bottom-[58px]">
                                        <div className="heading-desc h-[53px] w-[191px]">
                                            <h3 className="text-[24px] font-semibold inline-block">Speaker</h3>
                                            <p className="text-[14px]">Amazon wireless speakers</p>
                                        </div>
                                        <div className="btn">
                                            <Link to="/category/speakers" className="underline">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Item-3 Ends */}
                                {/* Item-4 */}
                                <div className="item-4 w-[270px] h-[284px] bg-black flex flex-col items-center">
                                    <div className="image w-[210px] h-[222px] mx-auto my-[13px]">
                                        <img src="/images/652e82cd70aa6522dd785109a455904c.png" alt="perfume" className="mx-auto w-[190px] h-[221px]" />
                                    </div>
                                    <div className="content w-[191px] h-[85px] flex flex-col gap-[8px] text-white relative bottom-[58px]">
                                        <div className="heading-desc h-[53px] w-[191px]">
                                            <h3 className="text-[24px] font-semibold inline-block">Perfume</h3>
                                            <p className="text-[14px]">GUCCI INTENSE OUD EDP</p>
                                        </div>
                                        <div className="btn">
                                            <Link to="/category/fragrances" className="underline">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Item-4 Ends */}
                                {/* Row 2 Ends */}
                                {/* </div> */}
                                {/* Col-2 Ends */}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="features w-[943px] h-[161px] mx-auto my-[70px] flex justify-evenly">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </section>
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

export default Home
