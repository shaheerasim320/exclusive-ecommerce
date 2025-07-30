import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import OrderRow from '../components/OrderRow'
import Aside from '../components/Aside'
import { useDispatch, useSelector } from 'react-redux'
import { getPlacedOrders } from '../slices/orderSlice'
import Loader from '../components/Loader'

const Order = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)
    const { orders, loading } = useSelector(state => state.order)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    const handleClick = (orderID, orderNum) => {
        navigate(`/order-detail?orderID=${orderNum}`, { state: { orderID: orderID } })
    }

    return (
        <div>
            {loading && <div className="flex h-screen justify-center"><Loader /></div>}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs - Made responsive */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/orders" className="text-sm">My Orders</Link>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here */}

                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">

                    <div className="orders w-full">
                        <div className="heading mb-4 md:mb-6">
                            <span className="text-xl md:text-2xl font-semibold">My Orders</span>
                        </div>

                        {/* Conditional display for no orders */}
                        <div className={`${!orders || orders?.length === 0 ? 'flex' : 'hidden'} flex-col items-center mt-8 text-center`}>
                            <p className='text-base md:text-lg text-[#757575]'>No orders placed yet</p>
                            <Link to="/" className='mt-6'>
                                <button className='bg-[#DB4444] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#E07575] transition-colors duration-200 w-full max-w-[211px]'>
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>

                        {/* Orders Table - Using flexbox for responsiveness */}
                        <div className={`${!orders || orders?.length === 0 ? "hidden" : "flex flex-col gap-4"}`}>
                            {orders && orders.map(ord => (
                                <OrderRow order={ord} onClick={handleClick} key={ord._id} clickable={true} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Order;
