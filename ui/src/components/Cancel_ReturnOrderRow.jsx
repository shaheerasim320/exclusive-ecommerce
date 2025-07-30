import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Cancel_ReturnOrderRow = ({ order }) => {
    const navigate = useNavigate()
    const handleButton = () => {
        navigate(`/order-detail?orderID=${order.orderId}`, { state: { orderID: order._id } })
    }
    return (
        // Main container for each return item, now a responsive div
        <div className="return-card w-full shadow-md rounded-lg mb-4 p-4 md:p-6 bg-white">
            {/* Header section with order date, number, and more details button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-200 mb-3">
                <div className="order-date-and-order-num mb-2 sm:mb-0">
                    <div className="ordered-date text-sm md:text-base text-gray-600">Requested on {String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear())}</div>
                    <div className="order-number text-xs md:text-sm text-gray-500">
                        Order <span className="text-[#1A9CB7] cursor-pointer hover:text-[#127F90]" onClick={handleButton}>#{order.orderId}</span>
                    </div>
                </div>
                {/* More Details button */}
                <span className="text-sm md:text-base text-[#DB4444] hover:text-[#A33737] cursor-pointer" onClick={handleButton}>MORE DETAILS</span>
            </div>

            {/* Products within this return */}
            {order?.products.map((product, index) => (
                <div key={index} className="order-item flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-100 last:border-b-0">
                    {/* Product Image and Description */}
                    <div className="item w-full sm:w-1/2 flex gap-4 items-center mb-4 sm:mb-0">
                        <div className="img w-20 h-20 flex items-center justify-center flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                            <img
                                src={product.image || `https://placehold.co/80x80/E0E0E0/000000?text=Product`}
                                alt="product-image"
                                className="w-full h-full object-contain"
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/E0E0E0/000000?text=Error"; }}
                            />
                        </div>
                        <div className="desc flex flex-col">
                            <div className="title text-base md:text-lg font-medium mb-1">{product.name}</div>
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
                    {/* Quantity and Status */}
                    <div className="flex flex-col sm:flex-row sm:w-1/2 justify-between items-start sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
                        <div className="Quantity text-sm md:text-base text-gray-700 w-full sm:w-1/2 text-left sm:text-center">
                            <span className="text-gray-500">Qty : </span>{product.quantity}
                        </div>
                        <div className="status rounded-full bg-[#ecf0f7] text-sm md:text-base py-1 px-4 text-gray-800 w-full sm:w-auto text-left sm:text-right">
                            {order.orderStatus}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Cancel_ReturnOrderRow;
