import React, { useEffect, useState } from 'react'
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator'

const RecentOrderRow = ({ order }) => {
    const date = new Date(order?.orderDate)
    const [total, setTotal] = useState("")
    useEffect(() => {
        if (order) {
            setTotal(order.totalAmount)
        }
    })

    return (
        // Changed to a div for better layout control and responsiveness
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center p-4 border-b border-gray-200 last:border-b-0">
            {/* Order ID and Date - Grouped for Mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:w-1/4 mb-2 sm:mb-0">
                <span className="text-sm font-medium text-gray-800">
                    {order?.orderId ? `${order.orderId.substring(0, 8)}...` : 'N/A'}
                </span>
                <span className="text-xs text-gray-500 mt-1 sm:hidden">
                    {String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear())}
                </span>
            </div>

            {/* Product Image and Total - Grouped for Mobile */}
            <div className="flex items-center justify-between w-full sm:w-3/4">
                <div className="flex items-center gap-2">
                    {/* Product Image */}
                    <div className="icon w-8 h-8 flex-shrink-0">
                        <img
                            src={order?.products?.[0]?.image || "https://placehold.co/32x32/cccccc/000000?text=Product"}
                            alt="product"
                            className="w-full h-full object-contain rounded"
                        />
                    </div>
                    {/* "& More" text */}
                    <span className={`${order?.products?.length > 1 ? "" : "hidden"} text-xs text-gray-600`}>& More</span>
                </div>
                
                {/* Total */}
                <span className="text-base font-semibold text-gray-900">${total}</span>
            </div>

            {/* Date - Visible only on larger screens */}
            <span className="hidden sm:block text-sm text-gray-500 ml-auto">{String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear())}</span>
        </div>
    );
}

export default RecentOrderRow