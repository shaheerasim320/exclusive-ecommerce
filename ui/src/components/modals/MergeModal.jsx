import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, syncCart } from '../../slices/cartSlice';
import { fetchWishlist, syncWishlist } from '../../slices/wishlistSlice';
import api from '../../api/axiosInstance';
import { calculateDiscountPrice } from '../../functions/DiscountPriceCalculator';
import Loader from '../Loader';
import { toast, ToastContainer } from 'react-toastify';

const MergeModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const { items: cartItems } = useSelector((state) => state.cart);
    const [showLoader, setShowLoader] = useState(true); 
    const [loading, setLoading] = useState(false); 
    const [skipLoading, setSkipLoading] = useState(false);
    const [guestData, setGuestData] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({
        cart: true,
        wishlist: true
    });

    useEffect(() => {
        const loadData = async () => {
            setShowLoader(true);
            try {
                const [guestWishlistRes, guestCartRes, accountWishlistRes, accountCartRes] = await Promise.all([
                    api.get("/wishlist/get-guest-wishlist-items"),
                    api.get("/cart/get-guest-cart-items"),
                    api.get("/wishlist/get-wishlist-items"),
                    api.get("/cart/get-cart-items")
                ]);

                const guestCartItems = guestCartRes.data?.items || [];
                const guestWishlistItems = guestWishlistRes.data?.items || [];
                const accountCartItems = accountCartRes.data || [];
                const accountWishlistItems = accountWishlistRes.data?.items || [];

                const guestCartObject = {
                    items: guestCartItems.length,
                    value: guestCartItems.reduce((total, item) => {
                        const itemPrice = item.product?.discount > 0
                            ? Math.round(calculateDiscountPrice(item.product?.price, item.product?.discount))
                            : item.product?.price;
                        return total + itemPrice * item.quantity;
                    }, 0)
                };

                const accountCartObject = {
                    items: accountCartItems.length,
                    value: accountCartItems.reduce((total, item) => {
                        const itemPrice = item.product?.discount > 0
                            ? Math.round(calculateDiscountPrice(item.product?.price, item.product?.discount))
                            : item.product?.price;
                        return total + itemPrice * item.quantity;
                    }, 0)
                };

                const guestWishlistObject = {
                    items: guestWishlistItems.length
                };

                const accountWishlistObject = {
                    items: accountWishlistItems.length
                };

                setGuestData({
                    cart: guestCartObject,
                    wishlist: guestWishlistObject
                });
                setAccountData({
                    cart: accountCartObject,
                    wishlist: accountWishlistObject
                });

                setSelectedOptions(prev => ({
                    cart: guestCartItems.length > 0,
                    wishlist: guestWishlistItems.length > 0
                }));

            } catch (error) {
                console.error("Failed to load merge data:", error);
                toast.error("Failed to load data for merging. Please try again.");
                onClose();
            } finally {
                setShowLoader(false);
            }
        };
        loadData();
    }, [dispatch, onClose]);

    const handleMerge = async () => {
        setLoading(true);
        try {
            if (selectedOptions.cart && guestData?.cart?.items > 0) {
                await dispatch(syncCart({ mergeOptions: selectedOptions })).unwrap();
                toast.success("Cart merged successfully!");
            }
            if (selectedOptions.wishlist && guestData?.wishlist?.items > 0) {
                await dispatch(syncWishlist({ mergeOptions: selectedOptions })).unwrap();
                toast.success("Wishlist merged successfully!");
            }
            onClose();
        } catch (err) {
            console.error("Merge failed:", err);
            toast.error("Failed to merge items. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = async () => {
        setSkipLoading(true);
        try {
            await api.delete("/wishlist/discard-guest");
            await api.delete("/cart/discard-guest");
            toast.info("Guest data discarded.");
            onClose();
        } catch (error) {
            console.error("Error discarding guest data:", error);
            toast.error("Failed to discard guest data.");
        } finally {
            setSkipLoading(false);
        }
    };

    const toggleOption = (option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const hasGuestData = (guestData?.cart?.items > 0 || guestData?.wishlist?.items > 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full sm:max-w-md lg:max-w-lg xl:max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-scale-in">
                {showLoader && (
                    <div className="min-h-[250px] flex items-center justify-center p-6">
                        <Loader />
                    </div>
                )}
                {!showLoader && (
                    <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">Welcome back!</h2>
                                    <p className="text-xs sm:text-sm text-gray-500">Merge your guest data</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSkip}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-6">
                            <div className="mb-4 text-center">
                                <div className="flex items-start justify-center space-x-2 mb-2"> {/* Centered alert icon and text */}
                                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm sm:text-base text-gray-700 max-w-prose">
                                        We found items in your guest session. Would you like to merge them with your account?
                                    </p>
                                </div>
                            </div>

                            {/* Cart Section */}
                            {guestData?.cart?.items > 0 && (
                                <div className="mb-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                            <span className="font-medium text-sm sm:text-base text-gray-900">Shopping Cart</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.cart}
                                                onChange={() => toggleOption('cart')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Guest cart:</span>
                                            <span>{guestData?.cart?.items || 0} items (${(guestData?.cart.value || 0).toFixed(2)})</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Account cart:</span>
                                            <span>{accountData?.cart.items || 0} items (${(accountData?.cart.value || 0).toFixed(2)})</span>
                                        </div>
                                        {selectedOptions.cart && (
                                            <div className="flex justify-between font-medium text-green-600 pt-1 border-t border-gray-200">
                                                <span>After merge:</span>
                                                <span>{((guestData?.cart?.items || 0) + (accountData?.cart.items || 0))} items (${((guestData?.cart.value || 0) + (accountData?.cart.value || 0)).toFixed(2)})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Wishlist Section */}
                            {guestData?.wishlist?.items > 0 && (
                                <div className="mb-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                            <span className="font-medium text-sm sm:text-base text-gray-900">Wishlist</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.wishlist}
                                                onChange={() => toggleOption('wishlist')}
                                                className="sr-only peer"
                                            />
                                            <div className="w-10 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Guest wishlist:</span>
                                            <span>{guestData?.wishlist?.items || 0} items</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Account wishlist:</span>
                                            <span>{accountData?.wishlist.items || 0} items</span>
                                        </div>
                                        {selectedOptions.wishlist && (
                                            <div className="flex justify-between font-medium text-green-600 pt-1 border-t border-gray-200">
                                                <span>After merge:</span>
                                                <span>{((guestData?.wishlist?.items || 0) + (accountData?.wishlist.items || 0))} items</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
                                <div className="flex items-start space-x-3">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-xs sm:text-sm text-blue-800">
                                        <p className="font-medium mb-1">What happens next?</p>
                                        <ul className="space-y-1 text-blue-700 list-disc list-inside"> {/* Added list styling */}
                                            <li>Selected items will be merged with your account</li>
                                            <li>Duplicate items will be combined</li>
                                            <li>Your guest session will be cleared</li>
                                            <li>All data will be saved to your account</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {!hasGuestData && (
                                <div className="p-4 bg-gray-50 text-center text-gray-600 rounded-lg">
                                    No guest cart or wishlist items found to merge.
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 border-t border-gray-200">
                            <button
                                onClick={handleSkip}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={loading || skipLoading}
                            >
                                {skipLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></div>
                                        <span>Discarding...</span>
                                    </>
                                ) : (
                                    <span>Skip for now</span>
                                )}
                            </button>

                            <button
                                onClick={handleMerge}
                                disabled={loading || (!selectedOptions.cart && !selectedOptions.wishlist) || !hasGuestData} // Disable merge if nothing selected AND no guest data to merge
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Merging...</span>
                                    </>
                                ) : (
                                    <span>Merge Selected Items</span>
                                )}
                            </button>
                        </div>
                    </>
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
};

export default MergeModal;