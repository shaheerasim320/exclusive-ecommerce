import React, { useState } from 'react'

const AddressRow = ({ address, isCheck, onSelect, OnEdit }) => {
    const handleEdit = () => {
        OnEdit(address._id)
    }
    const handleSelect = () => {
        onSelect(address._id)
    }

    return (
        <div className="p-4 border-black border-[1.25px] bg-white flex flex-col gap-[0.4rem]">
            <div className="flex justify-between">
                <span>{address && address.name}</span>
                <span className="text-[#DB4444] hover:text-[#D88888] cursor-pointer" onClick={handleEdit}>Edit</span>
            </div>
            <div className="address flex flex-col">
                <span>{address && address.address}</span>
                <span>{address?.city + ", " + address?.province + ", " + address?.country}</span>
            </div>
            <div className="flex items-center">
                <input type="checkbox" id="use-shipping-address" className="peer hidden" />
                <label htmlFor="use-shipping-address" className={`flex items-center cursor-pointer relative w-6 h-6 border-2  rounded-md ${isCheck == (address && address._id) ? "bg-[#DB4444] border-[#DB4444]" : "border-gray-300"} select-none`} onClick={handleSelect}>
                    <span className={`absolute inset-0 ${isCheck == (address && address._id) ? "flex" : "hidden"} justify-center items-center text-xl invert `}><img src="images/tick-icon.png" alt="tick-icon" /></span>
                </label>
                <span className="ml-2 cursor-pointer select-none" onClick={handleSelect}>Use this as the shipping address</span>
            </div>
        </div>
    )
}

export default AddressRow
