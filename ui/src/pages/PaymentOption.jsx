import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PaymentCardRow from '../components/PaymentCardRow'
import Aside from '../components/Aside'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { getSavedCards, removeCard } from '../slices/cardSlice'

const PaymentOption = () => {
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const { savedCards, loading, error } = useSelector(state => state.card)
    useEffect(() => {
        dispatch(getSavedCards())
    }, [dispatch])
    const handleDelete = async (cardID) => {
        await dispatch(removeCard({ paymentMethodId: cardID })).unwrap()
        await dispatch(getSavedCards()).unwrap()
    }
    return (
        <div>
            {loading && <Loader />}
            <div>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/manage-my-account" className="text-[#605f5f] text-[14px] hover:text-black">My Account</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/my-profile" className="text-[#605f5f] text-[14px] hover:text-black">My Profile</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/payment-options" className="text-[14px]">Payment Options</Link>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px]  mx-auto mb-[120px] flex justify-between">
                    <Aside setActive='payment-options' />
                    <div className="payment-options w-[900px]">
                        <div className="heading  mb-[9px]">
                            <span className="text-[25px] font-400">Payment Options</span>
                        </div>
                        <table>
                            <thead className=" w-[900px] h-[50px] flex items-center shadow">
                                <tr className="w-[860px] mx-auto flex ">
                                    <th className="font-normal w-[247px] text-left">Card Number</th>
                                    <th className="font-normal w-[570px] text-left">Expiry Date</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody className="flex flex-col w-[900px]">
                                {savedCards && savedCards.map((cardItem, index) => (
                                    <PaymentCardRow key={cardItem._id || index} card={cardItem} onDelete={handleDelete} />
                                ))}
                                {!savedCards || savedCards.length === 0 ? (
                                    <tr className="w-[900px] p-[15px] h-[46px] flex items-center mx-auto shadow justify-center text-[#A6A6A6]">
                                        <td>No payment options found</td>
                                    </tr>
                                ) : ""}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default PaymentOption
