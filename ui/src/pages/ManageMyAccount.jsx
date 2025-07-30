import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import RecentOrderRow from '../components/RecentOrderRow'
import Aside from '../components/Aside'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { getDefaultBillingAddress, getDefaultShippingAddress } from '../slices/addressSlice'
import { getRecentOrders } from '../slices/orderSlice'


const ManageMyAccount = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const { defaultShippingAddress, defaultBillingAddress, loading, error } = useSelector(state => state.address)
    const { recentOrders, loading: OrderLoading } = useSelector(state => state.order)
    useEffect(() => {
        dispatch(getDefaultBillingAddress())
        dispatch(getDefaultShippingAddress())
        dispatch(getRecentOrders())
    }, [dispatch])
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    return (
        <div>
            {(loading || OrderLoading) && <Loader />} {/* Show loader when any data is loading */}

            {/* Content area, hidden if loading */}
            <div className={`${(loading || OrderLoading) ? "hidden" : ""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/manage-my-account" className="text-sm">My Account</Link>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}

                {/* Main Content Section */}
                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">
                    

                    <div className="outer-box flex flex-col gap-8 w-full lg:w-[945px]">
                        {/* Personal Profile and Address Book */}
                        <div className="manage-my-account w-full flex flex-col md:flex-row md:gap-8 lg:gap-[35px]">
                            {/* Personal Profile Card */}
                            <div className="personal-profile w-full md:w-[calc(50%-16px)] lg:w-[300px] flex flex-col gap-2 p-4 shadow-md rounded-md">
                                <div className="title flex items-center">
                                    <h5 className="text-xl md:text-2xl font-semibold">Personal Profile</h5>
                                    <div className="border-l h-4 border-black mx-2" />
                                    <span><Link to="/my-profile" className="text-[#DB4444] hover:text-[#A33737] text-sm">EDIT</Link></span>
                                </div>
                                <div className="name">
                                    <h5 className="text-lg md:text-xl">{user?.fullName}</h5>
                                </div>
                                <div className="email">
                                    <h5 className="text-sm text-[#767676]">{user?.email}</h5>
                                </div>
                            </div>

                            {/* Address Book Section */}
                            <div className="address-book flex flex-col sm:flex-row sm:gap-4 md:gap-2 w-full md:w-[calc(50%-16px)] lg:w-[610px] shadow-md rounded-md p-4">
                                {/* Default Shipping Address */}
                                <div className="default-shipping-address w-full sm:w-1/2 flex flex-col gap-2">
                                    <div className="title flex items-center mb-2">
                                        <h5 className="text-xl md:text-2xl font-semibold">Address Book</h5>
                                        <div className="border-l h-4 border-black mx-2" />
                                        <span><Link to="/address-book" className="text-[#DB4444] hover:text-[#A33737] text-sm">EDIT</Link></span>
                                    </div>
                                    <div className="name">
                                        <h5 className="text-xs uppercase text-[#767676]">DEFAULT SHIPPING ADDRESS</h5>
                                    </div>
                                    <div className="address flex flex-col text-sm">
                                        {!defaultShippingAddress ? (<span className="text-[#767767]">No address set</span>) : (
                                            <>
                                                <h5 className="text-base font-semibold">{defaultShippingAddress?.name}</h5>
                                                <span>{defaultShippingAddress?.address}</span>
                                                <span>{defaultShippingAddress?.city + " , " + defaultShippingAddress?.province + " , " + defaultShippingAddress?.country}</span>
                                                <span>{defaultShippingAddress?.phoneNumber}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Divider for larger screens, horizontal for smaller */}
                                <div className="hidden sm:block border-l lg:h-[180px] my-4 sm:my-0 lg:my-[20px]" />
                                <div className="block sm:hidden border-b w-full my-4 border-gray-200" />


                                {/* Default Billing Address */}
                                <div className="default-billing-address w-full sm:w-1/2 flex flex-col gap-2">
                                    <div className="name mb-2 sm:mt-[32px]"> {/* Adjusted margin for alignment */}
                                        <h5 className="text-xs uppercase text-[#767676]">DEFAULT BILLING ADDRESS</h5>
                                    </div>
                                    <div className="address flex flex-col text-sm">
                                        {defaultBillingAddress == null ? (<span className="text-[#767767]">No address set</span>) : (
                                            <>
                                                <h5 className="text-base font-semibold">{defaultBillingAddress?.name}</h5>
                                                <span>{defaultBillingAddress?.address}</span>
                                                <span>{defaultBillingAddress?.city + " , " + defaultBillingAddress?.province + " , " + defaultBillingAddress?.country}</span>
                                                <span>{defaultBillingAddress?.phoneNumber}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Section */}
                        <div className="orders w-full h-auto">
                            <div className="heading my-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <h5 className="text-xl md:text-2xl font-semibold">Recent Orders</h5>
                                {/* Header for desktop */}
                                <div className="hidden sm:grid grid-cols-4 gap-2 w-full mt-4 sm:mt-0 bg-gray-50 p-2 rounded font-medium text-gray-700 text-sm md:text-base">
                                    <span>Order #</span>
                                    <span>Placed On</span>
                                    <span>Items</span>
                                    <span className="text-right">Total</span>
                                </div>
                            </div>
                            {/* Orders List */}
                            <div className="flex flex-col gap-3 w-full">
                                {recentOrders && recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <RecentOrderRow key={order._id} order={order} />
                                    ))
                                ) : (
                                    <div className="w-full p-4 flex items-center justify-center text-center text-[#767767] text-base bg-gray-50 rounded shadow">
                                        No orders placed yet
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ManageMyAccount
