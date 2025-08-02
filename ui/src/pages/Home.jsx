import React, { useEffect, useRef, useState, } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard"
import { Link, useNavigate } from "react-router-dom"
import FeatureCard from "../components/FeatureCard";
import { useDispatch, useSelector } from "react-redux";
import { startTimer, updateTimer } from "../slices/timerSlice";
import Loader from "../components/Loader"
import ErrorModal from "../components/modals/ErrorModal";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearDelayedAction } from "../slices/userSlice";
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
    const { products, bestSellingProducts, error } = useSelector((state) => state.products)
    const { items, error: wishlistError } = useSelector(state => state.wishlist)
    const { items: cartItems, error: cartError, loading: cartLoading } = useSelector(state => state.cart)
    const hasRun = useRef(false)
    const { mainCategories, loading: categoryLoading, subCategories, hirearcialDropDownCategories } = useSelector(state => state.category)
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const { flashSale, error: flashSaleError } = useSelector((state) => state.flashSale);
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);

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
        { id: 2, time: ((3 * 24 * 60 * 60) + (23 * 60 * 60) + (59 * 60) + 59) }
    ];

    useEffect(() => {
        timerArray.forEach((timer) => {
            dispatch(startTimer({ id: timer.id, time: timer.time }));
        });
    }, [dispatch]);


    useEffect(() => {
        if (flashSale) {
            dispatch(startTimer({ id: 1000, time: flashSale.remainingTime }));
            setFlashSaleProducts(flashSale?.products);
        }
    }, [flashSale, dispatch]);



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
        const wishlistItem = items.find(it=>it.product?._id==product)
        if (wishlistItem) {
            await dispatch(removeFromWishlist({ wishlistItemId:wishlistItem._id })).then(() => { toast.success("Product removed from wishlist") }).catch(() => toast.error("Something went wrong. Please try again"));
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



    const flashSaleTimer = timers.find((timer) => timer.id === 1000) || { time: 0 };
    return (
        <div className="min-h-screen">
            {loading || cartLoading || categoryLoading ? <div className="h-screen flex justify-center items-center"><Loader /></div> : ""}
            {error ? <ErrorModal onClose={() => handleClose()} message={"Server Error. Something went wrong!"} btnMessage={"Retry"} /> : ""}
            <div className={`${loading || cartLoading || categoryLoading ? "hidden" : ""} ${error ? "hidden" : ""}`}>
                {/* Hero Section Starts Here */}
                <section className="hero flex flex-col lg:flex-row w-full max-w-[1150px] mx-auto px-4 md:px-8">
                    <aside className="mt-4 md:mt-8 lg:mt-[32px] w-full lg:w-[8rem] mb-6 lg:mb-0">
                        <ul className="flex flex-col gap-2"> {/* Adjusted gap */}
                            {hirearcialDropDownCategories && hirearcialDropDownCategories.map((category, index) => (
                                <li className="relative mb-2 lg:mb-[15px] hover:text-[#919090] cursor-pointer text-base md:text-lg" key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                                    {category?.name}
                                    <div className={`${(category && category.subCategories?.length > 0) && hoveredIndex === index ? "block" : "hidden"} lg:absolute left-full top-0 bg-white shadow-lg border rounded-md p-2 z-50 w-full lg:min-w-[13rem]`}>
                                        <ul>
                                            {category.subCategories && category.subCategories.map((sub, subIndex) => (
                                                <li className="py-1 px-2 hover:bg-gray-100 cursor-pointer hover:text-black text-sm md:text-base" key={subIndex}>
                                                    <Link to={`/category/${sub.slug}`}>{sub.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </aside>
                    {/* Conditional divider for larger screens */}
                    <div className="hidden lg:block border-r border-gray-300 mx-4" />
                    {/* Content on the right */}

                    {/* Slider Images */}
                    <div className="mt-4 md:mt-8 lg:mt-[34px] w-full lg:w-[892px] h-[200px] md:h-[300px] lg:h-[344px] relative lg:ml-8">
                        <div className="relative w-full h-full overflow-hidden rounded-md">
                            <Carousel
                                showArrows={true}
                                showThumbs={false}
                                infiniteLoop={true}
                                autoPlay={true}
                                interval={3000}
                                transitionTime={400}
                                emulateTouch={true}
                                swipeable={true}
                                showStatus={false}
                            >
                                <div>
                                    <img src="/images/banner.jpg" alt="Slide 1" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <img src="/images/banner.jpg" alt="Slide 2" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <img src="/images/banner.jpg" alt="Slide 3" className="w-full h-full object-cover" />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                    {/* Slider Images Ends Here*/}
                </section>
                {/* Hero Section Ends Here */}

                {/* Flash Sales Section Starts Here */}
                <section className={`flash-sales w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto mt-16 md:mt-24 lg:mt-[134px]`}>
                    <div>
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-3 items-center mb-4 md:mb-6">
                            <div className="rectangle w-4 h-8 md:w-5 md:h-10 bg-[#db4444]" />
                            <div className="text">
                                <p className="text-sm md:text-base font-semibold text-[#db4444]">Today's</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}

                        {/* Main Title Box Starts Here */}
                        <div className="main-title-box flex flex-col md:flex-row items-start md:items-center w-full justify-between mb-8">
                            {/* Title & Time Box Group */}
                            <div className="title flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 md:gap-[73px] mb-4 md:mb-0">
                                {/* Title Starts Here */}
                                <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold inline-block">Flash Sales</h2>
                                {/* Title Ends Here */}

                                {/* Time Box Starts Here */}
                                <div className="time flex flex-col items-start">
                                    <div className="label flex gap-5 text-xs md:text-sm font-semibold mb-1">
                                        <span className="text-center">Days</span>
                                        <span className="text-center">Hours</span>
                                        <span className="text-center">Minutes</span>
                                        <span className="text-center">Seconds</span>
                                    </div>
                                    <div className="actual-time flex items-center gap-2 text-2xl md:text-3xl lg:text-[32px] font-bold">
                                        <span className="flash-days-text">{String(Math.floor(flashSaleTimer.time / (24 * 60 * 60))).padStart(2, '0')}</span>
                                        <span className="text-[#E07575]">:</span>
                                        <span className="flash-hours-text">{String(Math.floor((flashSaleTimer.time % (24 * 60 * 60)) / (60 * 60))).padStart(2, '0')}</span>
                                        <span className="text-[#E07575]">:</span>
                                        <span className="flash-minutes-text">{String(Math.floor((flashSaleTimer.time % (60 * 60)) / 60)).padStart(2, '0')}</span>
                                        <span className="text-[#E07575]">:</span>
                                        <span className="flash-seconds-text">{String(flashSaleTimer.time % 60).padStart(2, '0')}</span>
                                    </div>
                                </div>
                                {/* Time Box Ends Here */}
                            </div>
                            {/* Main Title Box Ends Here */}

                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-2">
                                <button
                                    className={`prev w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${flashProductsStartIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#a7a6a6] cursor-pointer"}`}
                                    onClick={() => {
                                        if (flashProductsStartIndex > 0) {
                                            setFlashProductsStartIndex(flashProductsStartIndex - 1);
                                        }
                                    }}
                                    disabled={flashProductsStartIndex === 0}
                                >
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                                <button
                                    className={`next w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${flashProductsStartIndex + 4 >= flashSaleProducts.length ? "opacity-50 cursor-not-allowed" : "hover:bg-[#a7a6a6] cursor-pointer"}`}
                                    onClick={() => {
                                        // Check if there are enough products remaining to scroll
                                        if (flashProductsStartIndex + 4 < flashSaleProducts.length) {
                                            setFlashProductsStartIndex(flashProductsStartIndex + 1);
                                        }
                                    }}
                                    disabled={flashProductsStartIndex + 4 >= flashSaleProducts.length}
                                >
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Main Title Box Ends Here */}
                    </div>

                    <div>
                        {/* Flash Sale Products Container Starts Here */}
                        {/* Adjusted product display to use slice correctly for 4 items at a time */}
                        <div className="products-flash-sale grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {flashSaleProducts.length > 0 ? (
                                flashSaleProducts.slice(flashProductsStartIndex, flashProductsStartIndex + 5).map((product, index) => (
                                    <ProductCard
                                        product={product}
                                        key={product._id}
                                        onWishlistToggle={handleWishlistToggle}
                                        onCartClick={handleAddToCartClick}
                                        isWishlistSelected={items.some(item => item.product?._id === product._id)} // Check product._id
                                        isAddToCartSelected={cartItems.some(item => item.product?._id === product._id)} // Check product._id
                                    />
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">No flash sales products available.</p>
                            )}
                        </div>
                        {/* Flash Sale Products Container End Here */}

                        {/* Button */}
                        <div className="button flex justify-center my-10 md:my-16 lg:my-[75px]">
                            <button className="btn-1 bg-[#DB4444] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#E07575] transition-colors duration-200">
                                <Link to="/all-flash-sale-products">View All Products</Link>
                            </button>
                        </div>
                        {/* Button Ends Here */}
                    </div>
                </section>
                {/* Flash Sales Section Ends Here */}
                <div className="border-t border-gray-300 my-[74px]" />

                {/* Categories Section Starts Here */}
                <section className="categories w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto my-10 md:my-16">
                    {/* Heading And Title Container */}
                    <div className="header-container flex flex-col gap-4 md:gap-6 mb-6">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-3 items-center">
                            <div className="rectangle w-4 h-8 md:w-5 md:h-10 bg-[#db4444]" />
                            <div className="text">
                                <p className="text-sm md:text-base font-semibold text-[#db4444]">Categories</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}

                        {/* Main Title Box Starts Here */}
                        <div className="main-title-box flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-4">
                            {/* Main Title Starts Here */}
                            <div className="title">
                                <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold inline-block">Browse By Category</h2>
                            </div>
                            {/* Main Title Ends Here */}

                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-2">
                                <button
                                    className={`prev w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${categoryStartIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                                    onClick={() => {
                                        if (categoryStartIndex > 0) {
                                            setCategoryStartIndex(categoryStartIndex - 1);
                                        }
                                    }}
                                    disabled={categoryStartIndex === 0}
                                >
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                                <button
                                    className={`next w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${categoryStartIndex + (window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6) >= subCategories?.length ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                                    onClick={() => {
                                        const visibleCategoriesCount = window.innerWidth < 640 ? 2 : // 2 for small mobile
                                            window.innerWidth < 768 ? 3 : // 3 for medium mobile/tablet
                                                window.innerWidth < 1024 ? 4 : // 4 for tablet
                                                    window.innerWidth < 1280 ? 5 : // 5 for small desktop
                                                        6; // 6 for large desktop
                                        if (categoryStartIndex + visibleCategoriesCount < subCategories?.length) {
                                            setCategoryStartIndex(categoryStartIndex + 1);
                                        }
                                    }}
                                    disabled={categoryStartIndex + (window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6) >= subCategories?.length}
                                >
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Main Title Box Ends Here */}
                    </div>
                    {/* Header & Title Box Ends Here */}

                    {/* Categories Display */}
                    {/* The `h-[145px]` was for a fixed height, making cards flow horizontally.
                        For responsiveness, a grid is better. We keep `overflow-hidden` on a wrapper
                        if horizontal scrolling is intended or if we want to limit the visible rows.
                        Here, we'll aim for a responsive grid to display categories.
                    */}
                    <div className="categories-grid mt-8 md:mt-12 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                        {subCategories && subCategories.slice(categoryStartIndex, categoryStartIndex + (window.innerWidth < 640 ? 2 : window.innerWidth < 768 ? 3 : window.innerWidth < 1024 ? 4 : window.innerWidth < 1280 ? 5 : 6)).map((category, index) => (
                            <Link to={`/category/${category.slug}`} key={index} className="flex-shrink-0 w-full">
                                <CategoryCard category={category} />
                            </Link>
                        ))}
                    </div>


                </section>
                {/* Categories Section Ends Here */}

                <div className="border-t border-gray-300 my-[74px]" />

                {/* Best Selling Products Section Starts Here */}
                <section className="best-selling-products w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto my-10 md:my-16">
                    {/* Header & Title Box Starts Here */}
                    <div className="header-container flex flex-col gap-4 md:gap-6 mb-6">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-3 items-center">
                            <div className="rectangle w-4 h-8 md:w-5 md:h-10 bg-[#db4444]" />
                            <div className="text">
                                <p className="text-sm md:text-base font-semibold text-[#db4444]">This Month</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}

                        {/* Main Title Box Starts Here */}
                        <div className="main-title-box flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-4">
                            {/* Main Title Starts Here */}
                            <div className="title">
                                <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold inline-block">Best Selling Products</h2>
                            </div>
                            {/* Main Title Ends Here */}

                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-2">
                                <button
                                    className={`prev w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${bestSellingProductsStartIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                                    onClick={() => {
                                        if (bestSellingProductsStartIndex > 0) {
                                            setBestSellingProductsStartIndex(bestSellingProductsStartIndex - 1);
                                        }
                                    }}
                                    disabled={bestSellingProductsStartIndex === 0}
                                >
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                                <button
                                    className={`next w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${bestSellingProductsStartIndex + (window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4) >= bestSellingProducts.length ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                                    onClick={() => {
                                        const visibleProductsCount = window.innerWidth < 640 ? 1 : // 1 for small mobile (adjusted for single column)
                                            window.innerWidth < 768 ? 2 : // 2 for medium mobile/tablet
                                                window.innerWidth < 1024 ? 3 : // 3 for tablet
                                                    4; // 4 for desktop
                                        if (bestSellingProductsStartIndex + visibleProductsCount < bestSellingProducts.length) {
                                            setBestSellingProductsStartIndex(bestSellingProductsStartIndex + 1);
                                        }
                                    }}
                                    disabled={bestSellingProductsStartIndex + (window.innerWidth < 640 ? 1 : window.innerWidth < 768 ? 2 : window.innerWidth < 1024 ? 3 : 4) >= bestSellingProducts.length}
                                >
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Main Title Box Ends Here */}
                    </div>
                    {/* Header & Title Box Ends Here */}
                    {/* Product Container Starts Here */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {bestSellingProducts.slice(bestSellingProductsStartIndex, bestSellingProductsStartIndex + 4).map((product, index) => (
                            <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product?._id === product._id)} isAddToCartSelected={cartItems.some(item => item.product?._id === product._id)} />
                        ))}
                    </div>
                    {/* Product Container Ends Here */}

                </section>
                {/* Best Selling Products Section Ends Here */}

                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] h-auto bg-black mx-auto my-16 md:my-24 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 rounded-md overflow-hidden">
                    <div className="content-box flex flex-col gap-6 md:gap-10 p-6 text-center lg:text-left w-full lg:w-[386px] order-2 lg:order-1">
                        <h3 className="text-[#00FF66] text-base md:text-lg font-semibold">Categories</h3>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight w-full max-w-[441px] mx-auto lg:mx-0">Enhance Your Music Experience</h1>
                        <div className="time flex justify-center lg:justify-start gap-4 md:gap-6">
                            {/* Days */}
                            <div className="days h-16 w-16 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <div className="days-content flex flex-col items-center">
                                    <h6 className="cat-days-text text-lg md:text-xl font-semibold">
                                        {String(Math.floor(timers[0]?.time / (24 * 60 * 60))).padStart(2, '0')}
                                    </h6>
                                    <p className="text-xs md:text-sm">Days</p>
                                </div>
                            </div>
                            {/* Hours */}
                            <div className="hours h-16 w-16 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <div className="hours-content flex flex-col items-center">
                                    <h6 className="cat-hours-text text-lg md:text-xl font-semibold">
                                        {String(Math.floor((timers[0]?.time % (24 * 60 * 60)) / (60 * 60))).padStart(2, '0')}
                                    </h6>
                                    <p className="text-xs md:text-sm">Hours</p>
                                </div>
                            </div>
                            {/* Minutes */}
                            <div className="minutes h-16 w-16 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <div className="minutes-content flex flex-col items-center">
                                    <h6 className="cat-minutes-text text-lg md:text-xl font-semibold">
                                        {String(Math.floor((timers[0]?.time % (60 * 60)) / 60)).padStart(2, '0')}
                                    </h6>
                                    <p className="text-xs md:text-sm">Minutes</p>
                                </div>
                            </div>
                            {/* Seconds */}
                            <div className="seconds h-16 w-16 md:h-20 md:w-20 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <div className="seconds-content flex flex-col items-center">
                                    <h6 className="cat-seconds-text text-lg md:text-xl font-semibold">
                                        {String(timers[0]?.time % 60).padStart(2, '0')}
                                    </h6>
                                    <p className="text-xs md:text-sm">Seconds</p>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => navigate("/category/speakers")} className="btn-2 w-[171px] mx-auto lg:mx-0 bg-[#00FF66] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#00E65C] transition-colors duration-200">
                            Buy Now!
                        </button>
                    </div>
                    <div className="image w-full lg:w-[600px] h-[250px] md:h-[350px] lg:h-[420px] flex items-center justify-center p-4 order-1 lg:order-2">
                        <img
                            src="/images/JBL_BOOMBOX_2_HERO_020_x1 (1) 1.png"
                            alt="JBL Boombox"
                            className="w-full max-w-[568px] h-auto object-contain my-4 mx-auto custom-shadow drop-shadow-2xl"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/568x330/000000/FFFFFF?text=No+Image"; }}
                        />
                    </div>
                </section>
                {/* Section Ends Here */}

                {/* Our Products Section Starts Here */}
                <section className="our-products w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto my-10 md:my-16">
                    {/* Header & Title Box Starts Here */}
                    <div className="header-container flex flex-col gap-4 md:gap-6 mb-6">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-3 items-center">
                            <div className="rectangle w-4 h-8 md:w-5 md:h-10 bg-[#db4444]" />
                            <div className="text">
                                <p className="text-sm md:text-base font-semibold text-[#db4444]">Our Products</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}

                        {/* Main Title Box Starts Here */}
                        <div className="main-title-box flex flex-col sm:flex-row items-start sm:items-center w-full justify-between gap-4">
                            {/* Main Title Starts Here */}
                            <div className="title">
                                <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold inline-block">Explore Our Products</h2>
                            </div>
                            {/* Main Title Ends Here */}

                            {/* Nav Buttons Start Here */}
                            <div className="nav-buttons flex gap-2">
                                <button
                                    className={`prev w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${productsStartIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                                    onClick={() => {
                                        if (productsStartIndex > 0) {
                                            setProductsStartIndex(productsStartIndex - 1);
                                        }
                                    }}
                                    disabled={productsStartIndex === 0}
                                >
                                    <img src="/images/icons_arrow-left.svg" alt="Left-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                                <button
                                    className={`next w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center transition-colors duration-200
                                        ${productsStartIndex + 8 >= products.length ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d4d4d4] hover:cursor-pointer"}`}
                                    onClick={() => {
                                        const visibleProductsCount = 8; // Always showing 8 products in this section
                                        if (productsStartIndex + visibleProductsCount < products.length) {
                                            setProductsStartIndex(productsStartIndex + 1);
                                        }
                                    }}
                                    disabled={productsStartIndex + 8 >= products.length}
                                >
                                    <img src="/images/icons arrow-right.svg" alt="Right-Arrow" className="w-5 h-5 object-contain" />
                                </button>
                            </div>
                            {/* Nav Buttons Ends Here */}
                        </div>
                        {/* Main Title Box Ends Here */}
                    </div>
                    {/* Header & Title Box Ends Here */}

                    {/* Product Container Starts Here */}
                    {/* The height h-[1016px] was fixed. We will let the content dictate height with auto,
                        and ensure responsive grid for product cards. */}
                    <div className="products-cont mt-8 md:mt-12 w-full flex flex-col gap-4 md:gap-6">
                        <div className="row-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {products.slice(productsStartIndex, productsStartIndex + 4).map((product, index) => (
                                <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product?._id === product._id)} isAddToCartSelected={cartItems.some(item => item.product?._id === product._id)} />
                            ))}
                        </div>
                        <div className="row-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                            {products.slice(productsStartIndex + 4, productsStartIndex + 8).map((product, index) => (
                                <ProductCard product={product} key={product._id} onWishlistToggle={handleWishlistToggle} onCartClick={handleAddToCartClick} isWishlistSelected={items.some(item => item.product?._id === product._id)} isAddToCartSelected={cartItems.some(item => item.product?._id === product._id)} />
                            ))}
                        </div>
                    </div>
                    {/* Product Container Ends Here */}

                    {/* Button */}
                    <div className="btn flex justify-center my-10 md:my-16">
                        <button className="btn-1 bg-[#DB4444] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#E07575] transition-colors duration-200" onClick={() => navigate("/all-products")}>
                            View All Products
                        </button>
                    </div>
                    {/* Button Ends Here */}
                </section>
                {/* Our Products Section Ends Here */}


                <section className="featured w-full px-4 md:px-8 lg:max-w-[1170px] mx-auto my-10 md:my-16">
                    {/* Heading And Title Container */}
                    <div className="header-container flex flex-col gap-4 md:gap-6 mb-6">
                        {/* Heading Starts Here */}
                        <div className="heading flex gap-3 items-center">
                            <div className="rectangle w-4 h-8 md:w-5 md:h-10 bg-[#db4444]" />
                            <div className="text">
                                <p className="text-sm md:text-base font-semibold text-[#db4444]">Featured</p>
                            </div>
                        </div>
                        {/* Heading Ends Here */}
                        <div className="title w-full">
                            {/* Title Starts Here */}
                            <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold inline-block">New Arrival</h2>
                            {/* Title Ends Here */}
                        </div>
                    </div>
                    {/* Header & Title Box Ends Here */}
                    <div className="new-arrival w-full grid grid-cols-1 lg:grid-cols-2 mt-8 md:mt-12 gap-4 md:gap-8">
                        {/* Col-1 */}
                        <div className="col-1 w-full h-auto">
                            <div className="item-1 bg-black w-full h-96 md:h-[400px] lg:h-[600px] rounded-md overflow-hidden relative"> {/* Add relative here */}
                                <div className="image w-full h-full flex items-center justify-center p-4 md:p-8">
                                    <img
                                        src="/images/ps5-slim-goedkope-playstation_large 1.png"
                                        alt="playstation"
                                        className="w-full h-full object-contain mx-auto"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/000000/FFFFFF?text=No+Image"; }}
                                    />
                                </div>
                                <div className="content w-full flex flex-col gap-3 md:gap-4 text-white p-4 absolute bottom-4 left-4 lg:bottom-8 lg:left-8"> {/* Change lg:absolute to absolute and adjust bottom/left */}
                                    <div className="heading-desc w-full">
                                        <h3 className="text-xl md:text-2xl font-semibold">PlayStation 5</h3>
                                        <p className="text-sm md:text-base">Black and White version of the PS5 coming out on sale.</p>
                                    </div>
                                    <div className="btn">
                                        <Link to="/category/consoles" className="underline text-base md:text-lg hover:text-gray-300">Shop Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Col-1 Ends */}
                        {/* Col-2 */}
                        <div className="col-2 flex flex-col gap-4 md:gap-6 w-full">
                            {/* Row 1 */}
                            <div className="row-1 w-full h-auto">
                                {/* Item-2 */}
                                <div className="item-2 w-full h-48 md:h-64 lg:h-[284px] bg-[#0D0D0D] flex flex-col sm:flex-row-reverse items-center rounded-md overflow-hidden relative"> {/* Parent already has relative */}
                                    <div className="image w-full sm:w-2/3 h-full flex items-center justify-center p-2">
                                        <img
                                            src="/images/attractive-woman-wearing-hat-posing-black-background 1.png"
                                            alt="Women's Collection"
                                            className="w-full h-full object-contain"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/0D0D0D/FFFFFF?text=No+Image"; }}
                                        />
                                    </div>
                                    <div className="content w-full sm:w-1/2 flex flex-col gap-2 md:gap-3 text-white p-4 absolute bottom-4 left-4 sm:relative sm:bottom-0 sm:left-0 lg:absolute lg:bottom-6 lg:left-6"> {/* Add absolute for smaller screens, keep sm:relative for specific sm layout if needed */}
                                        <div className="heading-desc w-full">
                                            <h3 className="text-xl md:text-2xl font-semibold inline-block">Women's Collections</h3>
                                            <p className="text-sm md:text-base">Featured woman collections that give you another vibe.</p>
                                        </div>
                                        <div className="btn">
                                            <Link to="/category/womens-clothing" className="underline text-base md:text-lg hover:text-gray-300">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Item-2 Ends */}
                            </div>
                            {/* Row 1 Ends */}
                            {/* Row 2 */}
                            <div className="row-2 w-full flex flex-col sm:flex-row gap-4 md:gap-6">
                                {/* Item-3 */}
                                <div className="item-3 w-full sm:w-1/2 h-64 md:h-72 lg:h-[284px] bg-black flex flex-col items-center rounded-md overflow-hidden relative">
                                    <div className="image w-full h-40 md:h-48 flex items-center justify-center p-2">
                                        <img
                                            src="/images/69-694768_amazon-echo-png-clipart-transparent-amazon-echo-png 1.png"
                                            alt="speaker"
                                            className="w-full h-full object-contain mx-auto"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/000000/FFFFFF?text=No+Image"; }}
                                        />
                                    </div>
                                    <div className="content w-full flex flex-col gap-2 md:gap-3 text-white p-4 relative bottom-9">
                                        <div className="heading-desc w-full">
                                            <h3 className="text-xl md:text-2xl font-semibold inline-block">Speaker</h3>
                                            <p className="text-sm md:text-base">Amazon wireless speakers</p>
                                        </div>
                                        <div className="btn">
                                            <Link to="/category/speakers" className="underline text-base md:text-lg hover:text-gray-300">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Item-3 Ends */}
                                {/* Item-4 */}
                                <div className="item-4 w-full sm:w-1/2 h-64 md:h-72 lg:h-[284px] bg-black flex flex-col items-center rounded-md overflow-hidden relative">
                                    <div className="image w-full h-40 md:h-48 flex items-center justify-center p-2">
                                        <img
                                            src="/images/652e82cd70aa6522dd785109a455904c.png"
                                            alt="perfume"
                                            className="w-full h-full object-contain mx-auto"
                                            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x150/000000/FFFFFF?text=No+Image"; }}
                                        />
                                    </div>
                                    <div className="content w-full flex flex-col gap-2 md:gap-3 text-white p-4 relative bottom-9">
                                        <div className="heading-desc w-full">
                                            <h3 className="text-xl md:text-2xl font-semibold inline-block">Perfume</h3>
                                            <p className="text-sm md:text-base">GUCCI INTENSE OUD EDP</p>
                                        </div>
                                        <div className="btn">
                                            <Link to="/category/fragrances" className="underline text-base md:text-lg hover:text-gray-300">Shop Now</Link>
                                        </div>
                                    </div>
                                </div>
                                {/* Item-4 Ends */}
                            </div>
                            {/* Row 2 Ends */}
                        </div>
                        {/* Col-2 Ends */}
                    </div>
                </section>
                {/* Section Ends Here */}

                {/* Features Section Starts Here */}
                <section className="features w-full px-4 md:px-8 lg:max-w-[943px] mx-auto my-16 md:my-24 flex flex-col sm:flex-row flex-wrap justify-center sm:justify-evenly gap-8 md:gap-12 py-8 md:py-12">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} />
                    ))}
                </section>
                {/* Features Section Ends Here */}
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
