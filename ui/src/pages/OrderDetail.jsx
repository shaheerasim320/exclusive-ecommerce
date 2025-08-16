import React, { useEffect, useState } from 'react'
import OrderRow from '../components/OrderRow'
import Aside from '../components/Aside'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrder, getCancelledOrders, getOrderByID, getPlacedOrders, getRecentOrders } from '../slices/orderSlice'
import Loader from '../components/Loader'

const OrderDetail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { order, loading } = useSelector(state => state.order)
    const [subTotal, setSubTotal] = useState("")
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [total, setTotal] = useState("")
    const orderID = location?.state?.orderID
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    useEffect(() => {
        dispatch(getOrderByID({ orderID }))
            .unwrap()
            .catch(error => navigate("/p404"));

    }, [orderID])
    useEffect(() => {
        if (order) {
            setSubTotal(order.subtotal)
            setCouponDiscount(order.couponDiscountAmount)
            setTotal(order.totalAmount)
        }
    }, [order])
    const handleCancel = async () => {
        await dispatch(cancelOrder({ orderID: orderID })).unwrap()
        await dispatch(getPlacedOrders()).unwrap()
        await dispatch(getCancelledOrders()).unwrap()
        await dispatch(getOrderByID({ orderID })).unwrap()
    }
    return (
        <div className='md:mt-28 mt-40'>
            {loading &&<div className="flex h-screen justify-center"><Loader /></div>}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs - Made responsive */}
                {/* Breadcrumbs */}
                <div className="nav w-full px-4 md:px-8 lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/orders" className="text-[#605f5f] text-sm hover:text-black">My Orders</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <span className="text-sm">Order Detail</span>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}

                <section className="w-full px-4 md:px-8 lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">
                    <Aside /> {/* Aside component is assumed responsive */}
                    <div className="order-details-main w-full lg:w-3/4">
                        <div className='mt-8'>
                            {order && order.products.length > 0 ? (
                                <OrderRow key={order._id} order={order} clickable={false} onCancel={handleCancel} />
                            ) : (
                                !loading && <p className="text-center text-gray-500">No order details found.</p>
                            )}
                        </div>
                            
                        {/* Order Info and Customer Info/Total Summary */}
                        <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
                            {/* Order Info */}
                            <div className="order-info w-full md:w-1/2 p-4 shadow-md rounded-md bg-white">
                                <div className="wrapper flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className="basic-info mb-4 sm:mb-0">
                                        <div className="order-no text-base md:text-lg font-medium">Order {order && order.orderId}</div>
                                        <div className="date text-sm text-[#9E9E9E]">Placed on {order?.orderDate ? String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear()) : 'N/A'}</div>
                                        {order?.orderStatus === 'returned' && order.returnedDate ? (<div className="returned-date text-sm text-[#9E9E9E]">Returned on {String(new Date(order?.returnedDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.returnedDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.returnedDate).getFullYear())}</div>) : null}
                                        {order?.orderStatus == 'cancelled' && order.cancelledDate ? (<div className="cancellation-date text-sm text-[#9E9E9E]">Cancelled on {String(new Date(order?.cancelledDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.cancelledDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.cancelledDate).getFullYear())}</div>) : null}
                                    </div>
                                    <div className={`${(order?.orderStatus === "pending") ? "" : "hidden cursor-text"}`}>
                                        <button className="bg-[#DB4444] h-10 px-4 text-white rounded-md hover:bg-[#E07575] transition-colors duration-200" onClick={handleCancel}>Cancel Order</button>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info and Total Summary */}
                            <div className="customer-info-total-summary w-full md:w-1/2 flex flex-col gap-4">
                                {/* Customer Info */}
                                <div className="customer-info w-full p-4 shadow-md rounded-md bg-white">
                                    <h3 className="text-lg md:text-xl font-semibold mb-2">Shipping Address</h3>
                                    <div className="name text-base font-medium">{order && order?.shippingAddress?.name}</div>
                                    <div className="address text-base text-gray-700 overflow-hidden text-wrap">{order?.shippingAddress?.address + " , " + order?.shippingAddress?.city + " , " + order?.shippingAddress?.province + " , " + order?.shippingAddress?.country}</div>
                                    <div className="phone-no text-base text-gray-700">{"+" + order?.shippingAddress?.phoneNumber}</div>
                                </div>
                                {/* Total Summary */}
                                <div className="total-summary w-full p-4 shadow-md rounded-md bg-white">
                                    <h3 className="text-lg md:text-xl font-semibold mb-2">Total Summary</h3>
                                    <div className="flex justify-between text-sm md:text-base mb-1">
                                        <div className="subtotal">Subtotal ({order?.products?.length || 0} item{order?.products?.length === 1 ? '' : 's'})</div>
                                        <div className="amount">${subTotal}</div>
                                    </div>
                                    <div className="flex justify-between text-sm md:text-base mb-1">
                                        <div className="shipping-fee">Shipping Fee</div>
                                        <div className="amount">${order?.shippingFee}</div>
                                    </div>
                                    <div className={`${order?.couponDiscountAmount !== 0 ? "flex" : "hidden"} justify-between text-sm md:text-base mb-1`}>
                                        <div className="coupon">Coupon Discount</div>
                                        <div className="amount text-[#DB4444]">-${couponDiscount}</div>
                                    </div>
                                    <div className="border-b-[1.5px] py-2 mb-2" />
                                    <div className="flex justify-between text-base md:text-lg font-semibold">
                                        <div className="total">Total</div>
                                        <div className="amount">${total}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default OrderDetail
