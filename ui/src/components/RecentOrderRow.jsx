import React, { useEffect, useState } from 'react'
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator'

const RecentOrderRow = ({ order }) => {
    const [total, setTotal] = useState("")

    useEffect(() => {
        if (order) {
            setTotal(order.totalAmount)
        }
    }, [order]); // Added dependency array for useEffect

    const formattedDate = new Date(order?.orderDate).toLocaleDateString("en-US", {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    return (
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center p-4 border-b border-gray-200 last:border-b-0">
            {/* Order ID - Always visible */}
            <div className="flex-1 mb-2 sm:mb-0 sm:w-1/4">
                <span className="text-sm font-medium text-gray-800">
                    {order?.orderId}
                </span>
            </div>

            {/* Placed On (Date) - Hidden on mobile, visible on sm and up */}
            <div className="flex-1 hidden sm:block sm:w-1/4">
                <span className="text-sm text-gray-500">
                    {formattedDate}
                </span>
            </div>

            {/* Items (Image) - Visible on both mobile and desktop */}
            <div className="flex-1 flex items-center gap-2 mb-2 sm:mb-0 sm:w-1/4">
                <div className="icon w-8 h-8 flex-shrink-0">
                    <img
                        src={order?.products?.[0]?.image || "https://placehold.co/32x32/cccccc/000000?text=Product"}
                        alt="product"
                        className="w-full h-full object-contain rounded"
                    />
                </div>
                {/* & More text */}
                <span className={`${order?.products?.length > 1 ? "" : "hidden"} text-xs text-gray-600`}>
                    & More
                </span>
            </div>

            {/* Total - Always visible */}
            <div className="flex-1 flex justify-end sm:justify-start md:justify-end sm:w-1/4">
                <span className="text-base font-semibold text-gray-900">
                    ${total}
                </span>
            </div>
        </div>
    );
}

export default RecentOrderRow;