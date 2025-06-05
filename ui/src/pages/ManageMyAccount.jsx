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
    const { user } = useSelector(state => state.user)
    const { defaultShippingAddress, defaultBillingAddress, loading, error } = useSelector(state => state.address)
    const { recentOrders,loading:OrderLoading } = useSelector(state => state.order)
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
            {(loading|| OrderLoading) && <Loader />}
            <div className={`${(loading || OrderLoading) ? "hidden" : ""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/manage-my-account" className="text-[14px]">My Account</Link>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px] h-[675px] mx-auto mb-[120px] flex gap-[40px]">
                    <Aside setActive='manage-my-account' />
                    <div className="outer-box flex flex-col gap-[40px]">
                        <div className="manage-my-account w-[945px] h-[215px] flex gap-[35px]">
                            <div className="personal-profile w-[300px] h-[215px] flex flex-col gap-[7px] p-[10px] shadow-md">
                                <div className="title text-[14px] flex items-center">
                                    <h5 className="text-[20px]">Personal Profile</h5>
                                    <div className="border-l  h-[16px] border-black mx-[5px]" />
                                    <span><Link to="/my-profile" className="text-[#DB4444] hover:text-[#A33737]">EDIT</Link></span>
                                </div>
                                <div className="name">
                                    <h5 className="text-[18px]">{user?.fullName}</h5>
                                </div>
                                <div className="email">
                                    <h5 className="text-[14px] text-[#767676]">{user?.email}</h5>
                                </div>
                            </div>
                            <div className="address-book flex gap-[5px] w-[610px] h-[215px] shadow-md">
                                <div className="default-shipping-address w-[300px] h-[215px] flex flex-col gap-[7px] p-[10px]">
                                    <div className="title text-[14px] flex items-center">
                                        <h5 className="text-[20px]">Address Book</h5>
                                        <div className="border-l  h-[16px] border-black mx-[5px]" />
                                        <span><Link to="/address-book" className="text-[#DB4444] hover:text-[#A33737]">EDIT</Link></span>
                                    </div>
                                    <div className="name">
                                        <h5 className="text-[12px]">DEFAULT SHIPPING ADDRESS</h5>
                                    </div>
                                    <div className="address flex flex-col">
                                        {!defaultShippingAddress ? (<span className="text-[14px] text-[#767767]">No address set</span>) : (
                                            <>
                                                <h5 className="text-[16px] font-semibold">{defaultShippingAddress?.name}</h5>
                                                <span className="text-[14px]">{defaultShippingAddress?.address}</span>
                                                <span className="text-[14px]">{defaultShippingAddress?.city + " , " + defaultShippingAddress?.province + " , " + defaultShippingAddress?.country}</span>
                                                <span className="text-[14px]">{defaultShippingAddress?.phoneNumber}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="border-r h-[180px] my-[20px]" />
                                <div className="default-billing-address w-[300px] h-[215px] flex flex-col gap-[7px] p-[10px]">
                                    <div className="name mt-[32px]">
                                        <h5 className="text-[12px]">DEFAULT BILLING ADDRESS</h5>
                                    </div>
                                    <div className="address flex flex-col">
                                        {defaultBillingAddress == null ? (<span className="text-[14px] text-[#767767]">No address set</span>) : (
                                            <>
                                                <h5 className="text-[16px] font-semibold">{defaultBillingAddress?.name}</h5>
                                                <span className="text-[14px]">{defaultBillingAddress?.address}</span>
                                                <span className="text-[14px]">{defaultBillingAddress?.city + " , " + defaultBillingAddress?.province + " , " + defaultBillingAddress?.country}</span>
                                                <span className="text-[14px]">{defaultBillingAddress?.phoneNumber}</span>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="orders w-[945px] h-[420px]">
                            <div className="heading my-[14px]">
                                <h5>Recent Orders</h5>
                            </div>
                            {/* Orders */}
                            <table>
                                {/* Table Head */}
                                <thead className="w-[945px] h-[72px] flex items-center shadow">
                                    <tr className="w-[900px] h-[24px] flex items-center justify-between mx-auto">
                                        <th className="font-normal">Order #</th>
                                        <th className="font-normal">Placed On</th>
                                        <th className="font-normal">Items</th>
                                        <th className="font-normal">Total</th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody className="flex flex-col">
                                    {recentOrders && recentOrders.map((order) => (
                                        <RecentOrderRow
                                            key={order._id}
                                            order={order}
                                        />
                                    ))}
                                    {!recentOrders || recentOrders.length === 0 ? (
                                        <tr className="w-[945px] p-[15px] h-[55px] mx-auto flex items-center justify-center shadow">
                                            <td colSpan="100%" className="text-center">
                                                No orders placed yet
                                            </td>
                                        </tr>
                                    ) : ""}
                                </tbody>
                            </table>
                            {/* Orders End */}
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default ManageMyAccount
