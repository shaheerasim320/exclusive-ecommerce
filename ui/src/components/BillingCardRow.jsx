import React from 'react'
import { Link } from 'react-router-dom'

const BillingCardRow = ({ card, onChange }) => {
    const handleOnChangeClick = () => {
        onChange()
    }
    return (
        <tr className="w-[427px] pl-[7px] flex shadow">
            <td className="text-[16px] w-[180px] flex items-center gap-[16px]">
                <img src={card?.brand == "visa" ? "/images/visa.png" : card?.brand == "union" ? "/images/union-pay.png" : "/images/master-card.png"} alt="card" className="w-[40px] h-[40px]" />
                <span className="text-center">**********{card?.last4}</span>
            </td>
            <td className="text-[16px] w-[133px] flex items-center ml-[12px]">
                <span>{card?.exp_month.toString().length == 1 ? "0" + card?.exp_month : card?.exp_month}/{card?.exp_year}</span>
            </td>
            <td className="flex items-center">
                <span  className="text-[14px] text-[#DB4444] hover:text-[#A33737] cursor-pointer" onClick={handleOnChangeClick}>CHANGE</span>
            </td>
        </tr>
    )
}

export default BillingCardRow
