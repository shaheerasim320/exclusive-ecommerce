import React from 'react'

const Card = ({ card, isCheck, onSelect }) => {
    const handleSelect = () => {
        onSelect(card.id)
    }
    return (
        <div className="card">
            <div className={`relative ${card && card.brand=="visa"?"bg-[#9B9B9B]":"bg-black opacity-85"} h-[250px] w-[430px] rounded-[8px]  overflow-hidden z-20`}>
                <div className="flex">
                    <img src="images/chip.png" alt="chip" className="w-[32px] h-[24px] relative top-[2rem] left-[1.5rem]" />
                    <div className="bg-[#C4C4C4] opacity-5 w-[241px] h-[241px] rounded-full absolute -top-28 left-[16rem] z-10"></div>
                </div>
                <div className="card-Number flex relative top-[5rem] left-[2rem]">
                    <span className="text-white text-[22px]">* * * * &nbsp; * * * * &nbsp; * * * * &nbsp; {card&&card.last4}</span>
                </div>
                <div className="flex ">
                    <img src="images/Vector.png" alt="vector" className="relative top-[5.25rem] right-[1rem] w-[350px]" />
                    {card&&card.brand=="visa"?(<img src="images/visa-card.png" alt="visa" className="w-[40px] h-[16px] relative top-[8.5rem] object-contain" />):card&&card.brand=="mastercard"?(<img src="images/mastercard.png" alt="mastercard" className="w-[50px] h-[28px] relative top-[8.5rem] object-contain" />):(<img src="images/union-pay.png" alt="unionpay" className="w-[60px] h-[40px] relative top-[8.5rem] object-contain" />)}
                </div>
                <div className="info text-white flex justify-between w-[290px] px-4 bottom-[0.25rem]  relative">
                    <div className="name flex flex-col">
                        <span className="text-[10px]">Card Holder Name</span>
                        <span className="text-[14px] max-w-[170px]">{card && card.name}</span>
                    </div>
                    <div className="expiry-date flex flex-col">
                        <span className="text-[10px]">Expiry Date</span>
                        <span className="text-[14px]">{String(card&&card.exp_month).padStart(2,"0")}/{String(card&&card.exp_year)}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center my-[1rem]">
                <input type="checkbox" id="use-payment-method" className="peer hidden" />
                <label htmlFor="use-payment-method" className={`flex items-center cursor-pointer relative w-6 h-6 border-2  rounded-md ${isCheck == (card && card.id) ? "bg-[#DB4444] border-[#DB4444]" : "border-gray-300"} select-none`} onClick={handleSelect}>
                    <span className={`absolute inset-0 ${isCheck == (card && card.id) ? "flex" : "hidden"} justify-center items-center text-xl invert `}><img src="images/tick-icon.png" alt="tick-icon" /></span>
                </label>
                <span className="ml-2 cursor-pointer select-none" onClick={handleSelect}>Use this as payment method</span>
            </div>
        </div>
    )
}

export default Card
