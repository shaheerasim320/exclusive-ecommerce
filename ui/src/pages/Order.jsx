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
    const { user } = useSelector(state => state.user)
    const { orders,loading } = useSelector(state => state.order)
    const dispatch = useDispatch()
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        } else {
            dispatch(getPlacedOrders())
        }
    }, [user])
    const handleClick = (orderID,orderNum) => {
        navigate(`/order-detail?orderID=${orderNum}`, { state: { orderID: orderID } })
    }

    return (
        <div>
            {loading && <Loader/>}
            <div className={`${loading?"hidden":""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link>
                        <span className="m-[11px] text-[14px] text-[#605f5f]">/</span>
                        <Link to="/orders" className="text-[14px]">My Orders</Link>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here */}
                <section className="w-[1170px] mx-auto mb-[120px] flex justify-between">
                    <Aside setActive="orders" />
                    <div className="orders w-[900px]">
                        <div className="heading  mb-[9px]">
                            <span className="text-[25px] font-400">My Orders</span>
                        </div>
                        <div className={`${!orders || orders?.length === 0 ? 'flex' : 'hidden'} flex-col mt-[28px]`}>
                            <p className='text-center text-[#757575]'>No orders placed yet</p>
                            <Link to="/" className='text-center'>
                                <button className='btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm mt-[25px]'>Continue Shopping</button>
                            </Link>
                        </div>
                        <table className={`${!orders || orders?.length == 0 ? "hidden" : ""}`}>
                            <tbody>
                                <tr>
                                    <td>
                                        {orders && orders.map(ord => (
                                            <OrderRow order={ord} onClick={handleClick}  key={ord._id} clickable={true}/>
                                        ))}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default Order;
