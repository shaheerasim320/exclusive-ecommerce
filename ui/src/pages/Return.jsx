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
    const { user } = useSelector(state => state.user)
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        } else {
            dispatch(getReturnedOrders())
        }
    }, [user])
    return (
        <div>
            {loading && <Loader/>}
            <div className={`${loading?"hidden":""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/manage-my-account" className="text-[#605f5f] text-[14px] hover:text-black">My Account</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/orders" className="text-[#605f5f] text-[14px] hover:text-black">My Orders</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/returns" className="text-[14px]">My Returns</Link>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px] mx-auto mb-[120px] flex justify-between">
                    <Aside setActive='returns' />
                    <div className="returns w-[900px]">
                        <div className="heading  mb-[9px]">
                            <span className="text-[25px] font-400">My Returns</span>
                        </div>
                        <div className={`${!returns || returns?.length === 0 ? 'flex' : 'hidden'} flex-col mt-[28px]`}>
                            <p className='text-center text-[#757575]'>No returns yet</p>
                            <Link to="/" className='text-center'>
                                <button className='btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm mt-[25px]'>Continue Shopping</button>
                            </Link>
                        </div>
                        <table className={`${!returns || returns?.length == 0 ? "hidden" : ""}`}>
                            <tbody>
                                {returns && returns.map((order) => (
                                    <tr>
                                        <Cancel_ReturnOrderRow order={order} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Return
