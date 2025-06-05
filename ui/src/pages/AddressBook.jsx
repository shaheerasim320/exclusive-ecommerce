import React, { useEffect, useState } from 'react'
import AddressBookRow from '../components/AddressBookRow'
import Aside from '../components/Aside'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { getSavedAddresses, setDefaultBillingAddress, setDefaultShippingAddress } from '../slices/addressSlice'

const AddressBook = () => {
    const { user } = useSelector(state => state.user)
    const { savedAddresses, loading, error } = useSelector(state => state.address)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [isDefaultShippingAddressClicked, setIsDefaultShippingAddressClicked] = useState(false)
    const [isDefaultBillingAddressClicked, setIsDefaultBillingAddressClicked] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null);
    useEffect(() => {
        dispatch(getSavedAddresses())
    }, [dispatch])
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    const handleButtonClick = async () => {
        if (isDefaultBillingAddressClicked) {
            await dispatch(setDefaultBillingAddress({ addressID: selectedAddress })).unwrap();
            await dispatch(getSavedAddresses()).unwrap()
            setIsDefaultBillingAddressClicked(false);
        } else if (isDefaultShippingAddressClicked) {
            await dispatch(setDefaultShippingAddress({ addressID: selectedAddress })).unwrap();
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
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <a href="../pages/index.html" className="text-[#605f5f] text-[14px] hover:text-black">Home</a><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><a href="../pages/manage-my-account.html" className="text-[#605f5f] text-[14px] hover:text-black">My Account</a><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><a href="#" className="text-[14px]">Address Book</a>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px]  mx-auto mb-[120px] flex justify-between">
                    <Aside setActive='address-book' />
                    <div className="address-book w-[900px]">
                        <div className="heading  mb-[9px] flex justify-between">
                            <span className="text-[25px] font-400">Address Book</span>
                            <div className={`items-center gap-[13px] ${savedAddresses && savedAddresses?.length != 0 ? "flex" : "hidden"}`}>
                                <span className="text-[12px] text-[#DB4444] cursor-pointer hover:text-[#A33737]" onClick={() => { setIsDefaultShippingAddressClicked(true); setIsDefaultBillingAddressClicked(false) }}>Make default shipping address</span>
                                <span>|</span>
                                <span className="text-[12px] text-[#DB4444] cursor-pointer hover:text-[#A33737]" onClick={() => { setIsDefaultBillingAddressClicked(true); setIsDefaultShippingAddressClicked(false) }}>Make default billing address</span>
                            </div>
                        </div>
                        <table>
                            <thead className="w-[900px] h-[50px] flex items-center shadow">
                                <tr className="w-[850px] mx-auto flex justify-between">
                                    <th className="font-normal">Full Name</th>
                                    <th className="font-normal">Address</th>
                                    <th className="font-normal">Postcode</th>
                                    <th className="font-normal">Phone Number</th>
                                    <th />
                                    <th />
                                </tr>
                            </thead>
                            <tbody className="flex flex-col w-[900px]">
                                {savedAddresses && savedAddresses.map((address) => (
                                    <AddressBookRow
                                        key={address._id}
                                        address={address}
                                        isClick={isDefaultBillingAddressClicked || isDefaultShippingAddressClicked}
                                        selectedAddress={selectedAddress}
                                        onSelect={handleSelectedAddress}
                                        onEdit={handleEditAddress}
                                    />
                                ))}
                                {!savedAddresses || savedAddresses?.length === 0 ? (
                                    <tr className="w-[900px] p-[15px] h-[46px] flex items-center mx-auto shadow justify-center text-[#A6A6A6]">
                                        <td colSpan="6" className="text-center">No Address Found</td>
                                    </tr>
                                ) : ""}
                            </tbody>
                        </table>
                        <div className={`flex justify-end mt-[14px] `}>
                            <button className="bg-[#DB4444] text-white w-[214px] h-[56px]" onClick={handleButtonClick}>{isDefaultBillingAddressClicked || isDefaultShippingAddressClicked ? "SAVE" : "ADD NEW ADDRESS"}</button>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default AddressBook
