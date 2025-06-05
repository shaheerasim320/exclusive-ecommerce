import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCardRow = ({ card, onDelete }) => {
    const handleDelete = () =>{
        onDelete(card.id)
    }
    return ( 
        <tr className="w-[900px] p-[15px] h-[102px] flex items-center mx-auto gap-[11px] shadow">
            <td className="text-[16px] w-[247px] flex items-center gap-[16px]">
                <img 
                    src={card?.brand === "visa" ? "/images/visa.png" :
                          card?.brand === "union" ? "/images/union-pay.png" :
                          "/images/master-card.png"} 
                    alt="card" 
                    className="w-[40px] h-[40px]" 
                />
                <span className="text-center">**********{card?.last4}</span>
            </td>
            <td className="w-[590px] flex justify-between">
                <span>{card?.exp_month < 10 ? "0" + card?.exp_month : card?.exp_month}/{card?.exp_year}</span>
                <span className="text-[14px] text-[#DB4444] hover:text-[#A33737] cursor-pointer" onClick={handleDelete}>DELETE</span>
            </td>
        </tr>
    );
};

export default PaymentCardRow;
