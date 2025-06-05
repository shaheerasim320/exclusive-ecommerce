import React, { useEffect, useState } from 'react'
import OrderRow from '../components/OrderRow'
import Aside from '../components/Aside'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelOrder, getOrderByID } from '../slices/orderSlice'
import Loader from '../components/Loader'

const OrderDetail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
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
        await dispatch(getOrderByID({ orderID })).unwrap()
    }
    return (
        <div>
            {loading && <Loader />}
            <section className={`w-[1170px]  mx-auto mb-[120px] ${loading ? "hidden" : "flex"} justify-between`}>
                <Aside mt={28} />
                <div className="order-details-main">
                    <div className='mt-[28px]'>
                        {order && order.products.length > 0 ? <OrderRow key={order.orderID} order={order} width={945} clickable={false} onCancel={handleCancel} /> : ""}
                    </div>
                    <div className="order-info mt-[10px] w-[945px] p-[15px] shadow">
                        <div className="wrapper flex justify-between">

                            <div className="basic-info">
                                <div className="order-no">Order {order && order.orderId}</div>
                                <div className="date text-[#9E9E9E]">Placed on {String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear())}</div>
                                {order?.orderStatus == 'Returned' ? (<div className="returned-date text-[#9E9E9E]">Returned on {order?.returnedDate}</div>) : ''}
                                {order?.orderStatus == 'cancelled' ? (<div className="cancellation-date text-[#9E9E9E]">Cancelled on {String(new Date(order?.cancelledDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.cancelledDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.cancelledDate).getFullYear())}</div>) : ''}
                            </div>
                            <div className={`${(order?.orderStatus == "pending") ? "" : "hidden cursor-text"}`}>
                                <button className="bg-[#DB4444] h-[40px] w-[110px] text-white hover:bg-[#E07575]" onClick={handleCancel}>Cancel Order</button>
                            </div>
                        </div>
                    </div>
                    <div className="customer-info-total-summary mt-[10px] w-[945px] flex justify-between ">
                        <div className="customer-info w-[440px] p-[15px] shadow">
                            <div className="name text-[16px]">{order && order?.shippingAddress?.name}</div>
                            <div className="address text-[16px] overflow-hidden">{order?.shippingAddress?.address + " , " + order?.shippingAddress?.city + " , " + order?.shippingAddress?.province + " , " + order?.shippingAddress?.country}</div>
                            <div className="phone-no text-[16px]">{"+" + order?.shippingAddress?.phoneNumber}</div>
                        </div>
                        <div className="total-summary w-[440px]  p-[15px] shadow">
                            <h3 className="text-[18px]">Total Summary</h3>
                            <div className="flex justify-between text-[14px]">
                                <div className="subtotal">Subtotal({order?.order?.products?.length} item)</div>
                                <div className="amount">${subTotal}</div>
                            </div>
                            <div className="flex justify-between text-[14px]">
                                <div className="shipping-fee">Shipping Fee</div>
                                <div className="amount">${order?.shippingFee}</div>
                            </div>
                            <div className={`${order?.couponDiscountAmount != 0 ? "flex" : "hidden"} justify-between text-[14px]`}>
                                <div className="coupon">Coupon Discount</div>
                                <div className="amount text-[#DB4444]">-${couponDiscount}</div>
                            </div>
                            <div className="border-b-[1.5px] py-[4px]" />
                            <div className="flex justify-between text-[14px]">
                                <div className="total">Total</div>
                                <div className="amount text-[18px]">${total}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default OrderDetail
