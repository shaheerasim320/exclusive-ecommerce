import React, { useEffect } from 'react'
import Aside from '../components/Aside'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getReturnedOrders } from '../slices/orderSlice'
import Cancel_ReturnOrderRow from '../components/Cancel_ReturnOrderRow'
import Loader from '../components/Loader'

const Return = () => {
    const dispatch = useDispatch()
    const { returns, loading } = useSelector(state => state.order)
    const { user } = useSelector(state => state.auth)
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    return (
        <div>
            {loading && <div className="flex h-screen justify-center"><Loader /></div>}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs - Made responsive */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/orders" className="text-[#605f5f] text-sm hover:text-black">My Orders</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/returns" className="text-sm">My Returns</Link>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}

                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">

                    <div className="returns w-full">
                        <div className="heading mb-4 md:mb-6">
                            <span className="text-xl md:text-2xl font-semibold">My Returns</span>
                        </div>

                        {/* Conditional display for no returns */}
                        <div className={`${!returns || returns?.length === 0 ? 'flex' : 'hidden'} flex-col items-center mt-8 text-center`}>
                            <p className='text-base md:text-lg text-[#757575]'>No returns yet</p>
                            <Link to="/" className='mt-6'>
                                <button className='bg-[#DB4444] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#E07575] transition-colors duration-200 w-full max-w-[211px]'>
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>

                        {/* Returns List - Using flexbox for responsiveness */}
                        <div className={`${!returns || returns?.length === 0 ? "hidden" : "flex flex-col gap-4"}`}>
                            {returns && returns.map((order) => (
                                <Cancel_ReturnOrderRow order={order} key={order._id} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Return
