import React, { useEffect, useState } from 'react'
import AddressRow from '../AddressRow';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getSavedAddresses } from '../../slices/addressSlice';

const ChangeAddressModal = ({ defaultAddress, onSave, onCancel }) => {
    const [queryParam] = useSearchParams()
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const { savedAddresses, loading, error } = useSelector(state => state.address)
    const [selectedAddress, setSelectedAddress] = useState(!defaultAddress ? null : defaultAddress);
    const [addressSelected, setAddressSelected] = useState(true);
    const handleSelect = (addressID) => {
        setSelectedAddress(addressID)
    }
    useEffect(() => {
        dispatch(getSavedAddresses())
    }, [dispatch]);
    const handleEdit = (addressID) => {
        const billingID = (queryParam.get("billingID"))
        const proceedToCheckout = (queryParam.get("proceedToCheckout"))
        const redirectURL = (location.pathname + "?" + `${!proceedToCheckout ? `buyNow=true&billingID=${billingID}` : `proceedToCheckout=true&billingID=${billingID}`}`)
        navigate("/address?update=true", { state: { addressID: addressID, redirectURL: redirectURL } });
    }
    const handleSave = () => {
        selectedAddress == null ? setAddressSelected(false) : onSave(selectedAddress);
    }
    const handleCancel = () => {
        onCancel();
    }
    const handleAddNewAddressClick = () => {
        const billingID = (queryParam.get("billingID"))
        const proceedToCheckout = (queryParam.get("proceedToCheckout"))
        const redirectURL = (location.pathname + "?" + `${!proceedToCheckout ? `buyNow=true&billingID=${billingID}` : `proceedToCheckout=true&billingID=${billingID}`}`)
        navigate("/address?create=true", { state: { redirectURL: redirectURL } });
    }
    return (
        <div>
            <div className="backdrop z-40 inset-0 fixed bg-black opacity-50"></div>
            <div className="z-50 fixed inset-0 flex items-center justify-center">
                {loading && <Loader />}
                <div className={`bg-[#e8e7e7] p-4 ${loading ? "hidden" : "flex"} flex-col gap-2`}>
                    <h1 className="font-bold text-center text-lg">Shipping Addresses</h1>
                    <span className={`text-[13px] text-[#DB4444] ${!addressSelected ? "" : "hidden"}`}>Please select an address</span>
                    <div className="addresses min-w-[36rem] max-h-80 flex flex-col overflow-y-auto overflow-x-hidden gap-2">
                        {savedAddresses && savedAddresses.map((address, index) => (
                            <AddressRow key={index} address={address} isCheck={selectedAddress} onSelect={handleSelect} OnEdit={handleEdit} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-end">
                            <button className="w-[168px] h-[40px] bg-[#47B2CA] text-white text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:bg-[#85BCCA]" onClick={handleAddNewAddressClick}>ADD NEW ADDRESS</button>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button className="w-[168px] h-[40px] bg-white text-black border-[1.5px] border-black border-opacity-30 text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:border-opacity-70" onClick={handleCancel}>Cancel</button>
                            <button className="w-[168px] h-[40px] bg-[#DB4444] text-white text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:bg-[#E07575]" onClick={handleSave}>SAVE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeAddressModal
