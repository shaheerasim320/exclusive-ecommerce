import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PaymentCardRow from '../components/PaymentCardRow';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { getSavedCards, removeCard } from '../slices/cardSlice';

const PaymentOption = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const { savedCards, loading, error } = useSelector(state => state.card);

    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } });
        }
        dispatch(getSavedCards());
    }, [dispatch]);

    const handleDelete = async (cardID) => {
        try {
            await dispatch(removeCard({ paymentMethodId: cardID })).unwrap();
            await dispatch(getSavedCards()).unwrap();
        } catch (error) {
            console.error("Failed to remove card:", error);
        }
    };

    return (
        <div>
            {loading && <Loader />}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/manage-my-account" className="text-[#605f5f] text-sm hover:text-black">My Account</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/payment-options" className="text-sm">Payment Options</Link>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}

                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">

                    <div className="payment-options w-full lg:flex-grow"> 
                        <div className="heading flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
                            <span className="text-xl md:text-2xl font-semibold">Payment Options</span>
                        </div>

                        <div className="w-full">
                            <div className="hidden md:flex bg-gray-50 h-auto py-3 px-4 items-center shadow rounded-t-md">
                                <div className="w-1/2 font-normal text-sm md:text-base text-left">Card Number</div>
                                <div className="w-1/3 font-normal text-sm md:text-base text-left">Expiry Date</div>
                                <div className="w-auto font-normal text-sm md:text-base text-right ml-auto">Action</div>
                            </div>

                            <div className="flex flex-col w-full shadow rounded-b-md md:border-t-0 border border-gray-200">
                                {savedCards && savedCards.length > 0 ? (
                                    savedCards.map((cardItem) => (
                                        <PaymentCardRow key={cardItem.id} card={cardItem} onDelete={handleDelete} />
                                    ))
                                ) : (
                                    <div className="w-full p-4 flex items-center justify-center text-[#A6A6A6] text-center bg-white rounded-b-md">
                                        No payment options found
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PaymentOption;