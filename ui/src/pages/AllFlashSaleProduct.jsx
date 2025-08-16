import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/ProductCard';
import { startTimer, updateTimer } from "../slices/timerSlice";
import { removeFromWishlist, addToWishlist } from "../slices/wishlistSlice";
import { toast } from 'react-toastify';

const PRODUCTS_PER_PAGE = 8;

const AllFlashSaleProduct = () => {
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.wishlist);
    const timers = useSelector((state) => state.timer.timers);
    const { flashSale } = useSelector((state) => state.flashSale);

    const [flashSaleProducts, setFlashSaleProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        let interval;
        if (timers.some((timer) => timer.isRunning)) {
            interval = setInterval(() => {
                dispatch(updateTimer());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timers, dispatch]);

    useEffect(() => {
        if (flashSale) {
            dispatch(startTimer({ id: 1000, time: flashSale.remainingTime }));
            setFlashSaleProducts(flashSale.products || []);
        }
    }, [flashSale, dispatch]);

    const flashSaleTimer = timers.find((timer) => timer.id === 1000) || { time: 0 };

    const handleWishlistToggle = async (product) => {
        const wishlistItem = items.find(it => it.product?._id === product._id);
        if (wishlistItem) {
            await dispatch(removeFromWishlist({ wishlistItemId: wishlistItem._id }))
                .then(() => toast.success("Product removed from wishlist"))
                .catch(() => toast.error("Something went wrong. Please try again"));
        } else {
            await dispatch(addToWishlist({ product }))
                .then(() => toast.success("Product added to wishlist"))
                .catch(() => toast.error("Something went wrong. Please try again"));
        }
    };

    const totalPages = Math.ceil(flashSaleProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = flashSaleProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    const handlePageChange = (pageNum) => {
        setCurrentPage(pageNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='py-6 px-8 font-inter md:mt-28 mt-40'>
            {/* Title and Timer */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                    <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold">Flash Sales</h2>
                    <div className="time flex flex-col items-start">
                        <div className="label flex gap-5 text-xs md:text-sm font-semibold mb-1">
                            <span>Days</span>
                            <span>Hours</span>
                            <span>Minutes</span>
                            <span>Seconds</span>
                        </div>
                        <div className="actual-time flex gap-2 text-2xl md:text-3xl lg:text-[32px] font-bold">
                            <span>{String(Math.floor(flashSaleTimer.time / (24 * 60 * 60))).padStart(2, '0')}</span>
                            <span className="text-[#E07575]">:</span>
                            <span>{String(Math.floor((flashSaleTimer.time % (24 * 60 * 60)) / (60 * 60))).padStart(2, '0')}</span>
                            <span className="text-[#E07575]">:</span>
                            <span>{String(Math.floor((flashSaleTimer.time % (60 * 60)) / 60)).padStart(2, '0')}</span>
                            <span className="text-[#E07575]">:</span>
                            <span>{String(flashSaleTimer.time % 60).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map(product => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onWishlistToggle={handleWishlistToggle}
                            isWishlistSelected={items.some(item => item.product?._id === product._id)}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No flash sale products available.</p>
                )}
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
    );
};

export default AllFlashSaleProduct;
