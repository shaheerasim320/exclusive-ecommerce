import React, { useEffect, useState } from 'react'
import AddressBookRow from '../components/AddressBookRow'
import Aside from '../components/Aside'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { getSavedAddresses, setDefaultBillingAddress, setDefaultShippingAddress } from '../slices/addressSlice'

const AddressBook = () => {
    const { user } = useSelector(state => state.auth)
    const { savedAddresses, loading, error } = useSelector(state => state.address)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [isDefaultShippingAddressClicked, setIsDefaultShippingAddressClicked] = useState(false)
    const [isDefaultBillingAddressClicked, setIsDefaultBillingAddressClicked] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null);
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    const handleButtonClick = async () => {
        if (isDefaultBillingAddressClicked) {
            await dispatch(setDefaultBillingAddress({ addressId: selectedAddress })).unwrap();
            await dispatch(getSavedAddresses()).unwrap()
            setIsDefaultBillingAddressClicked(false);
        } else if (isDefaultShippingAddressClicked) {
            await dispatch(setDefaultShippingAddress({ addressId: selectedAddress })).unwrap();
            await dispatch(getSavedAddresses()).unwrap()
            setIsDefaultShippingAddressClicked(false);
        } else {
            navigate("/address?create=true")
        }
    }
    const handleEditAddress = (addressID) => {
        navigate("/address?update=true", { state: { addressID: addressID } });
    }
    const handleSelectedAddress = (addressID) => {
        setSelectedAddress(addressID)
    }
    return (
        <div>
            {loading && <Loader />}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs - Made responsive with fluid width, padding, and adjusted text sizes */}
                {/* Breadcrumbs */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/manage-my-account" className="text-[#605f5f] text-sm hover:text-black">My Account</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/address-book" className="text-sm">Address Book</Link>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Breadcrumbs Ends Here*/}

                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">

                    <div className="address-book w-full">
                        <div className="heading flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6">
                            <span className="text-xl md:text-2xl font-semibold">Address Book</span>
                            <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-0 ${savedAddresses && savedAddresses?.length !== 0 ? "flex" : "hidden"}`}>
                                <span
                                    className="text-xs md:text-sm text-[#DB4444] cursor-pointer hover:text-[#A33737]"
                                    onClick={() => { setIsDefaultShippingAddressClicked(true); setIsDefaultBillingAddressClicked(false); }}
                                >
                                    Make default shipping address
                                </span>
                                <span className="hidden sm:inline-block">|</span>
                                <span
                                    className="text-xs md:text-sm text-[#DB4444] cursor-pointer hover:text-[#A33737]"
                                    onClick={() => { setIsDefaultBillingAddressClicked(true); setIsDefaultShippingAddressClicked(false); }}
                                >
                                    Make default billing address
                                </span>
                            </div>
                        </div>

                        <div className="overflow-x-auto w-full"> {/* Added overflow for small screens */}
                            {/* Responsive header for desktop */}
                            <div className="hidden md:grid grid-cols-5 gap-2 w-full bg-gray-50 p-2 rounded font-medium text-gray-700 text-sm md:text-base">
                                <span>Full Name</span>
                                <span>Address</span>
                                <span>Phone Number</span>
                                <span>Default Status</span>
                                <span className="text-right">Actions</span>
                            </div>
                            {/* Address List */}
                            <div className="flex flex-col gap-3 w-full">
                                {savedAddresses && savedAddresses.length > 0 ? (
                                    savedAddresses.map((address) => (
                                        <AddressBookRow
                                            key={address._id}
                                            address={address}
                                            isClick={isDefaultBillingAddressClicked || isDefaultShippingAddressClicked}
                                            selectedAddress={selectedAddress}
                                            onSelect={handleSelectedAddress}
                                            onEdit={handleEditAddress}
                                        />
                                    ))
                                ) : (
                                    <div className="w-full p-4 flex items-center justify-center text-[#A6A6A6] text-center bg-gray-50 rounded shadow">
                                        No Address Found
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center sm:justify-end mt-6">
                            <button
                                className={`bg-[#DB4444] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#E07575] transition-colors duration-200 w-full sm:w-[214px]`}
                                onClick={handleButtonClick}
                                disabled={(isDefaultBillingAddressClicked || isDefaultShippingAddressClicked) && !selectedAddress} // Disable save if no address is selected
                            >
                                {isDefaultBillingAddressClicked || isDefaultShippingAddressClicked ? "SAVE" : "ADD NEW ADDRESS"}
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddressBook
