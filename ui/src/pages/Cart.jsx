import React, { useEffect, useState } from 'react'
import CartProductRow from '../components/CartProductRow';
import { Link, useLocation, useNavigate, } from 'react-router-dom';
import { calculateCouponAmount, calculateSubtotal, calculateTotal } from '../functions/cartTotal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
// import { applyCoupon, deleteCartItem, getAppliedCoupon, getCartItems, updateProductQuantity, removeCoupon } from '../slices/cartSlice';
import { createBillingRecord } from '../slices/billingSlice';
import { removeFromCart, updateProductQuantity } from '../slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch()
    const { items, loading: cartLoader, error: cartError, coupon, subtotal,couponDiscount,total } = useSelector(state => state.cart)
    const { loading: billingLoader, error: billingError } = useSelector(state => state.billing)
    const navigate = useNavigate()
    const location = useLocation()
    const [couponCode, setCouponCode] = useState('');
    const { user } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (items) {
            console.log(items);
            
        }
    }, [items])


    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const handleCouponClick = async () => {
        if (couponCode == "") {
            toast.error("No coupon code applied")
            return
        }
        try {
            // await dispatch(applyCoupon({ couponCode: couponCode })).unwrap()
            // await dispatch(getAppliedCoupon()).unwrap()
            // toast.success("Coupon applied successfully")
            setCouponCode("")
        } catch (error) {
            toast.error(cartError)
            setCouponCode("")
        }
    };
    const handleCheckoutClick = async () => {
        try {
            const cartItems = items.filter(item => item.product.stock != 0)
            const items = cartItems.map(item => {
                return {
                    product: item.productID,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                }
            });
            const couponID = coupon ? coupon._id : null;
            if (coupon) {
                // await dispatch(removeCoupon()).unwrap()
                // await dispatch(getAppliedCoupon()).unwrap()
            }
            for (const item of cartItems) {
                // await dispatch(deleteCartItem({id: item._id})).unwrap();
                // await dispatch(getCartItems()).unwrap();
            }
            const response = await dispatch(createBillingRecord({ items: items, couponID: couponID })).unwrap();
            navigate(`/billing?proceedToCheckout=true&billingID=${response.id}`);
        } catch (error) {
            billingError ? toast.error(billingError) : toast.error(error)
        }
    }

    const handleQuantityChange = (cartItemId, quantity) => {
        dispatch(updateProductQuantity({ cartItemId, quantity }));
    };


    const handleUpdateQuantity = async (cartItemId, quantity) => {
        await dispatch(updateProductQuantity({cartItemId, quantity})).unwrap();
        // await dispatch(updateProductQuantity({ itemID, quantity })).unwrap()
        // await dispatch(getCartItems()).unwrap()
    }
    const handleRemove = async (cartItemId) => {
        dispatch(removeFromCart({cartItemId}))
    }


    return (
        <div>
            {loading || cartLoader || billingLoader ? <div className="h-screen flex items-center justify-center"> <Loader /> </div> : ""}
            <div className={`${loading || cartLoader || billingLoader ? "hidden" : "px-12 py-8"}`}>
                {/* Breadcrumbs */}
                <div className="nav w-max my-4">
                    <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="#" className="text-[14px]">Cart</Link>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Cart */}
                <section className="cart flex flex-col mx-auto">
                    {/* Product Details */}
                    <div className="prod-details flex flex-col gap-6">
                        {/* Products */}
                        <div className="product flex flex-col ">
                            <table className={items?.length > 0 ? '' : 'hidden'}>
                                <thead className="header  shadow">
                                    <tr className="w-full grid grid-cols-4  p-6">
                                        <th className="font-normal">Product</th>
                                        <th className="font-normal">Price</th>
                                        <th className="font-normal">Quantity</th>
                                        <th className="font-normal">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="flex flex-col">
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
                        {/* Product Details End Here */}
                        {/* Button */}
                        <div className={`btns ${items?.length > 0 && items?.length > 0 ? 'flex' : 'hidden'} `}>
                            <Link to="/"><button className="px-12 py-4 border-[1.5px] border-black border-opacity-60 rounded-sm cursor-pointer hover:border-opacity-30">Return To Shop</button></Link>
                        </div>
                        {/* Buttons End Here */}
                        {/* Coupon & Check out */}
                        <div className={`coupon-check-out ${items?.length > 0 ? "flex" : "hidden"} justify-between`}>
                            {/* Coupon */}
                            <div className="coupon flex">
                                <div className="coupon-code">
                                    <input type="text" className="w-72 h-14 focus:outline-none px-[14px] border-[1.5px] border-black" placeholder="Coupon Code" onChange={handleCouponChange} value={couponCode} />
                                </div>
                                <button className="w-56 h-14 rounded-sm text-white bg-[#DB4444] hover:bg-[#E07575]" onClick={handleCouponClick}>Apply Coupon</button>
                            </div>
                            {/* Coupon Ends Here */}
                            {/* Checkout */}
                            <div className="check-out w-[29rem] border-[1.5px] border-black rounded-sm flex flex-col gap-4 px-6 py-6">
                                {/* Heading */}
                                <div className="heading ">
                                    <h5 className="text-[20px] font-medium">Cart Total</h5>
                                </div>
                                {/* Heading Ends Here */}
                                {/* Details */}
                                <div className="details mx-auto flex flex-col gap-4 w-full">
                                    <div className="sub-total flex justify-between">
                                        <h6>Subtotal</h6>
                                        <span>${subtotal}</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-black border-opacity-60" />
                                    <div className="shipping flex justify-between">
                                        <h6>Shipping</h6>
                                        <span>Free</span>
                                    </div>
                                    <div className={`border-b-[1.5px]  ${coupon ? 'flex' : 'hidden'} border-black border-opacity-60`} />
                                    <div className={`coupon-discount ${coupon ? 'flex' : 'hidden'} justify-between`}>

                                        <h6>Coupon Discount <span className={`${!coupon ? "hidden" : ""} text-[#DB4444]`}>({coupon?.code})</span></h6>
                                        <span className='text-[#DB4444]'>-${couponDiscount}</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-black border-opacity-60" />
                                    <div className="total flex justify-between">
                                        <h6>Total</h6>
                                        <span>${total}</span>
                                    </div>
                                </div>
                                {/* Details Ends Here */}
                                <div className="btn flex justify-center ">
                                    <button className="w-56 h-14 rounded-sm text-white bg-[#DB4444] hover:bg-[#E07575]" onClick={handleCheckoutClick}>Proceed to checkout</button>
                                </div>

                            </div>
                            {/* Checkout Ends Here*/}
                        </div>
                        {/* Coupon & Check out Ends here*/}
                        <div className={`${items?.length === 0 ? 'flex' : 'hidden'} flex-col mt-[28px`}>
                            <p className='text-center text-[#757575]'>There are no items in this cart</p>
                            <Link to="/" className='text-center'>
                                <button className='btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm mt-[25px]'>Continue Shopping</button>
                            </Link>
                        </div>
                    </div></section>
                {/* Cart Ends Here */}
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

export default Cart
