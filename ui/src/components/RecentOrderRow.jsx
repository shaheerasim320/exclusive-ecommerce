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
        // Adjusted for full width on small screens, flexible padding, and dynamic height
        <tr className="w-full px-4 py-3 flex items-center shadow-sm border-b border-gray-200 last:border-b-0 rounded-md">
            {/* Order ID: Responsive width */}
            <td className="text-sm md:text-base w-1/4 break-words">
                {order?.orderId ? `${order.orderId.substring(0, 8)}...` : 'N/A'}
            </td>
            {/* Grouped details: Responsive width and flex layout */}
            <td className="w-3/4"> {/* Occupy remaining width */}
                <div className="details flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-2">
                    {/* Date: Responsive font size */}
                    <span className="text-xs sm:text-sm md:text-base">{String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear())}</span>
                    <div className="flex gap-2 items-center">
                        {/* Product Image: Responsive sizing and placeholder */}
                        <div className="icon w-10 h-10 flex items-center justify-center flex-shrink-0">
                            <img
                                src={order?.products?.[0]?.image || "https://placehold.co/40x40/cccccc/000000?text=Product"} // Placeholder image
                                alt="product"
                                className="max-w-full max-h-full object-contain rounded"
                            />
                        </div>
                        {/* "& More" text: Responsive visibility and margin */}
                        <span className={`${order?.products?.length > 1 ? "" : "hidden"} text-xs sm:text-sm md:text-base ml-1`}>&amp; More</span>
                    </div>
                    {/* Total: Responsive font size */}
                    <span className="text-sm md:text-base font-semibold">${total}</span>
                </div>
            </td>
        </tr>
    );
}

export default RecentOrderRow
