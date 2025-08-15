import { Link } from "react-router-dom";

const AddressBookRow = ({ address, isClick, selectedAddress, onSelect, onEdit }) => {
    const handleEditButton = () => {
        onEdit(address._id)
    }
    const handleSelect = () => {
        onSelect(address._id)
    }
    return (
        <div className={`w-full bg-white shadow rounded-lg p-4 flex flex-col md:grid md:grid-cols-5 gap-2 items-start md:items-center ${isClick && selectedAddress === address._id ? 'bg-blue-50' : ''}`}>
            {/* Name */}
            <div className="w-full md:w-auto font-medium text-base text-gray-800 truncate">{address?.name}</div>
            {/* Address */}
            <div className="w-full md:w-auto text-sm md:text-base text-gray-700 truncate">{`${address?.address}, ${address?.city}`}</div>
            {/* Phone */}
            <div className="w-full md:w-auto text-sm md:text-base text-gray-700">{`+${address?.phoneNumber}`}</div>
            {/* Default Status */}
            <div className="w-full md:w-auto text-xs md:text-sm flex flex-col justify-center text-gray-500">
                <span>{address.defaultShippingAddress ? "Default Shipping Address" : ""}</span>
                <span>{address.defaultBillingAddress ? "Default Billing Address" : ""}</span>
            </div>
            {/* Actions */}
            <div className="w-full md:w-auto flex justify-end md:justify-end items-center ">
                {!isClick ? (
                    <span className="text-base text-[#DB4444] hover:text-[#A33737] cursor-pointer" onClick={handleEditButton}>EDIT</span>
                ) : (
                    <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddress === address._id}
                        onChange={handleSelect}
                        className="w-5 h-5 cursor-pointer"
                    />
                )}
            </div>
        </div>
    );
};

export default AddressBookRow;
