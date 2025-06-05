import { Link } from "react-router-dom";

const AddressBookRow = ({ address, isClick, selectedAddress, onSelect, onEdit }) => {
    const handleEditButton = () => {
        onEdit(address._id)
    }
    const handleSelect = () => {
        onSelect(address._id)
    }
    return (
        <tr className="w-[900px]  h-[102px] flex items-center  shadow">
            <td className="w-[850px] flex mx-auto gap-[20px] items-center">
                <span className="text-[16px] w-[140px]">{address?.name}</span>
                <span className="text-[15px] w-[160px]">{address?.address}</span>
                <span className="text-[16px] w-[156px] ">{address?.city + " , " + address?.province}</span>
                <span className="text-[16px] text-center">{"+" + address?.phoneNumber}</span>
                <span className="text-[12px] text-center flex flex-col min-w-[135px]">
                    <span>
                        {address.defaultShippingAddress ? "Default Shipping Address" : ""}
                    </span>
                    <span>
                        {address.defaultBillingAddress ? "Default Billing Address" : ""}
                    </span>
                </span>
                <span>
                    {!isClick ? (
                        <span className="text-[16px] text-[#DB4444] hover:text-[#A33737] cursor-pointer" onClick={handleEditButton}>EDIT</span>
                    ) : (
                        <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddress === address._id}
                            onChange={handleSelect}
                        />
                    )}
                </span>
            </td>
        </tr>
    );
};

export default AddressBookRow;
