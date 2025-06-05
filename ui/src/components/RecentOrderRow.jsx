import React, { useEffect, useState } from 'react'
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator'

const RecentOrderRow = ({ order }) => {
    console.log(order)
    const date = new Date(order?.orderDate)
    const [total, setTotal] = useState("")
    useEffect(() => {
        if (order) {
            setTotal(order.totalAmount)
        }
    })
    return (
        <tr className="w-[945px] p-[15px] h-[102px] mx-auto flex items-center shadow">
            {/* Separate td */}
            <td className="text-[16px] w-[300px]">{order?.orderId}</td>
            {/* Grouped tds */}
            <td colSpan={3} className="w-[615px]">
                {/* Container for flex layout */}
                <div className="details flex w-full justify-between items-center">
                    <span className="text-[16px]">{String(date.getMonth() + 1).padStart(2, "0") + "/" + String(date.getDate()).padStart(2, "0") + "/" + String(date.getFullYear())}</span>
                    <div className="flex gap-[2px] items-center">
                        <div className="icon w-[54px] h-[54px] flex items-center justify-center">
                            <img src={order?.products[0].image} alt="product" />
                        </div>
                        <span className={`${order?.products.length>1?"":"hidden"} ml-[5px]`}>&amp; More</span>
                    </div>
                    <span className="text-[16px]">${total}</span>
                </div>
            </td>
        </tr>
    )
}

export default RecentOrderRow
