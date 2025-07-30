import React from 'react';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';

const OrderRow = ({ order, width = 900, clickable, onClick }) => {
    const handleClick = () => {
        if (clickable) {
            onClick(order._id, order.orderId)
        }
    }
    return (
        // Changed fixed width to full width and added responsive shadow and margin
        <div className={`store-product w-full shadow-md rounded-lg mb-4 p-4 md:p-6 ${clickable ? "cursor-pointer hover:shadow-lg transition-shadow duration-200" : ""}`} onClick={handleClick}>
            {/* Order ID and Status: Flexbox for spacing, responsive font sizes */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-200 mb-3">
                <div className="seller-shop-name font-bold text-lg md:text-xl mb-2 sm:mb-0">{order?.orderId}</div>
                <div className="status rounded-full bg-[#ecf0f7] text-sm md:text-base py-1 px-4 text-gray-800">
                    {order?.orderStatus}
                </div>
            </div>

            {/* Individual Order Items */}
            {order?.products.map((product, index) => (
                <div key={index} className="order-item flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-100 last:border-b-0">
                    {/* Item Image and Description */}
                    <div className="item w-full sm:w-1/2 flex gap-4 items-center mb-4 sm:mb-0">
                        <div className="img w-20 h-20 flex items-center justify-center flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                            <img
                                src={product?.image || `https://placehold.co/80x80/E0E0E0/000000?text=Product`}
                                alt="product-image"
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/E0E0E0/000000?text=Error"; }}
                            />
                        </div>
                        <div className="desc flex flex-col">
                            <div className="title text-base md:text-lg font-medium mb-1">{product?.name}</div>
                            <div className="add-info text-xs md:text-sm text-gray-500">
                                {product?.color && `Color: ${product?.color}`}
                                {product?.color && product?.size && ` | `}
                                {product?.size && `Size: ${product?.size}`}
                            </div>
                            {order?.orderStatus === 'Returned' || order?.orderStatus === 'Cancelled' ? (
                                <div className="reason text-xs md:text-sm text-gray-500 mt-1">Reason: {order?.reason}</div>
                            ) : null}
                        </div>
                    </div>
                    {/* Price and Quantity */}
                    <div className="flex flex-col sm:flex-row sm:w-1/2 justify-between items-start sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                        <div className="price text-base md:text-lg font-semibold w-full sm:w-1/2 text-left sm:text-center">
                            ${(product?.discount && product?.discount !== 0
                                ? Math.round(calculateDiscountPrice(product?.price, product?.discount))
                                : product?.price)?.toFixed(2)}
                        </div>
                        <div className="Quantity text-sm md:text-base text-gray-700 w-full sm:w-1/2 text-left sm:text-right">
                            <span className="text-gray-500">Qty : </span>{product?.quantity}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrderRow;
