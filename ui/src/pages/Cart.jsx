import React, { useEffect, useState } from 'react'
import CartProductRow from '../components/CartProductRow';
import { Link, useLocation, useNavigate, } from 'react-router-dom';
import { calculateCouponAmount, calculateSubtotal, calculateTotal } from '../functions/cartTotal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { applyCoupon, removeFromCart, updateProductQuantity } from '../slices/cartSlice';
import api from '../api/axiosInstance';

const Cart = () => {
    const dispatch = useDispatch();
    const { items, loading: cartLoader, error: cartError, coupon, subtotal, couponDiscount, total } = useSelector(state => state.cart);
    const navigate = useNavigate();
    const location = useLocation();
    const [couponCode, setCouponCode] = useState('');
    const { user } = useSelector(state => state.auth);
    const [processing, setProcessing] = useState(false);

    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const handleCouponClick = async () => {
        if (couponCode === "") {
            toast.error("No coupon code applied");
            return;
        }
        try {
            await dispatch(applyCoupon({ couponCode })).unwrap()
            setCouponCode("");
        } catch (error) {
            toast.error(cartError);
            setCouponCode("");
        }
    };

    const handleCheckoutClick = async () => {
        if (!user) {
            toast.error("Please log in to proceed to checkout.");
            navigate('/login', { state: { from: location.pathname } });
            return;
        }

        setProcessing(true);
        try {
            const cartItems = items.filter(item => item.product.stock !== 0);
            const itemsData = cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
            }));
            const couponID = coupon ? coupon._id : null;
            const res = await api.post("/billing/create-billing-record", {
                items: itemsData,
                couponID: couponID,
            });

            if (res.data && res.data.billingId) {
                cartItems.forEach(item => {
                    dispatch(removeFromCart({ cartItemId: item._id }));
                })
                const billingPublicId = res.data.billingId;
                navigate(`/billing?billingID=${billingPublicId}`);
            }
        } catch (error) {
            toast.error("Failed to proceed to checkout. Please try again.");
        } finally {
            setProcessing(false);
        }
    };


    const handleUpdateQuantity = async (cartItemId, quantity) => {
        await dispatch(updateProductQuantity({ cartItemId, quantity })).unwrap();
    };

    const handleRemove = async (cartItemId) => {
        dispatch(removeFromCart({ cartItemId }));
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 md:mt-24 mt-40">
            {(cartLoader) && <div className="h-screen flex items-center justify-center"> <Loader /> </div>}
            <div className={`${cartLoader ? "hidden" : "py-8"}`}>
                {/* Breadcrumbs */}
                <div className="nav max-w-6xl h-[21px] my-4 mx-auto text-sm">
                    <Link to="/" className="text-[#605f5f] hover:text-black">Home</Link>
                    <span className="mx-2 text-[#605f5f]">/</span>
                    <Link to="#">Cart</Link>
                </div>
                {/* Cart */}
                <section className="cart flex flex-col max-w-6xl mb-32 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prod-details flex flex-col gap-6">
                        <div className="product flex flex-col">
                            <table className={items?.length > 0 ? 'w-full' : 'hidden'}>
                                {/* Hide the table header on small screens */}
                                <thead className="header shadow-md hidden sm:table-header-group">
                                    <tr className="w-full grid grid-cols-4 p-6">
                                        <th className="font-normal text-center">Product</th>
                                        <th className="font-normal text-center">Price</th>
                                        <th className="font-normal text-center">Quantity</th>
                                        <th className="font-normal text-center">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="flex flex-col sm:table-row-group">
                                    {items?.length > 0 && items.map((item, index) => (
                                        <CartProductRow
                                            key={index}
                                            product={item.product}
                                            cartItemID={item._id}
                                            qty={item.quantity}
                                            updateQuantity={handleUpdateQuantity}
                                            color={item.color}
                                            size={item.size}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={`btns ${items?.length > 0 ? 'flex' : 'hidden'} justify-between mt-4`}>
                            <Link to="/">
                                <button className="px-6 sm:px-12 py-3 sm:py-4 border-[1.5px] border-black border-opacity-60 rounded-sm hover:border-opacity-30 text-sm">Return To Shop</button>
                            </Link>
                        </div>
                        <div className={`coupon-check-out ${items?.length > 0 ? "flex" : "hidden"} flex-col lg:flex-row gap-6 justify-between`}>
                            <div className="coupon flex flex-col sm:flex-row gap-2">
                                <input type="text" className="w-full sm:w-72 h-14 px-4 border-[1.5px] border-black focus:outline-none" placeholder="Coupon Code" onChange={handleCouponChange} value={couponCode} />
                                <button className="w-full sm:w-56 h-14 rounded-sm text-white bg-[#DB4444] hover:bg-[#E07575]" onClick={handleCouponClick}>Apply Coupon</button>
                            </div>
                            <div className="check-out w-full lg:w-[29rem] border-[1.5px] border-black rounded-sm flex flex-col gap-4 px-6 py-6">
                                <h5 className="text-[20px] font-medium">Cart Total</h5>
                                <div className="details flex flex-col gap-4">
                                    <div className="sub-total flex justify-between">
                                        <h6>Subtotal</h6>
                                        <span>${subtotal}</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-black border-opacity-60" />
                                    <div className="shipping flex justify-between">
                                        <h6>Shipping</h6>
                                        <span>Free</span>
                                    </div>
                                    <div className={`border-b-[1.5px] ${coupon ? 'flex' : 'hidden'} border-black border-opacity-60`} />
                                    <div className={`coupon-discount ${coupon ? 'flex' : 'hidden'} justify-between`}>
                                        <h6>Coupon Discount <span className="text-[#DB4444]">({coupon?.code})</span></h6>
                                        <span className='text-[#DB4444]'>-${couponDiscount}</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-black border-opacity-60" />
                                    <div className="total flex justify-between">
                                        <h6>Total</h6>
                                        <span>${total}</span>
                                    </div>
                                </div>
                                <div className="btn flex justify-center">
                                    <button
                                        className="w-full sm:w-56 h-14 rounded-sm text-white bg-[#DB4444] hover:bg-[#E07575] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        onClick={handleCheckoutClick}
                                        disabled={processing}
                                    >
                                        {processing ? "Processing..." : "Proceed to checkout"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={`${items?.length === 0 ? 'flex' : 'hidden'} flex-col mt-7 text-center`}>
                            <p className='text-[#757575]'>There are no items in this cart</p>
                            <Link to="/">
                                <button className='btn-1 max-w-[211px] w-full sm:w-[211px] h-[56px] rounded-sm mt-6'>Continue Shopping</button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
        </div>
    );
}

export default Cart;