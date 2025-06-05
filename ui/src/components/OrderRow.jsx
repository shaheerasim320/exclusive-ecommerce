import React from 'react';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';

const OrderRow = ({ order, width = 900, clickable, onClick }) => {
    console.log(order)
    const handleClick = () => {
        if (clickable) {
            onClick(order._id, order.orderId)
        }
    }
    return (
        <div className={`store-product w-[${width}px] shadow ${clickable ? "cursor-pointer" : ""}`} onClick={handleClick}>
            <div className="w-[880px] mx-auto flex py-[14px] justify-between">
                <div className="seller-shop-name font-[700]">{order?.orderId}</div>
                <div className="status rounded-[100px] bg-[#ecf0f7] text-[14px] py-[4px] px-[12px] ">
                    {order?.orderStatus}
                </div>
            </div>
            <div className="border-b-[1.5px]" />
            {order?.products.map((product, index) => (
                <div key={index} className="order-item w-[880px] mx-auto py-[14px] flex">
                    <div className="item w-[400px] h-[100px] flex gap-[15px]">
                        <div className="img w-[80px] h-[80px] items-center justify-center flex">
                            <img src={product?.image} alt="product-image" />
                        </div>
                        <div className="desc">
                            <div className="title h-[32px]">{product?.name}</div>
                            <div className="add-info text-[#bbb]">
                                {product?.color ? `Color: ${product?.color}` : product?.size ? `Size: ${product?.size}` : ""}
                            </div>
                            {order?.orderStatus === 'Returned' || order?.orderStatus === 'Cancelled' ? (
                                <div className="reason text-[#bbb]">Reason: {order?.reason}</div>
                            ) : null}
                        </div>
                    </div>
                    <div className="price w-[180px]">
                        ${product?.discount && product?.discount !== 0
                            ? Math.round(calculateDiscountPrice(product?.price, product?.discount))
                            : product?.price}
                    </div>
                    <div className="Quantity">
                        <span className="text-[#757575]">Qty : </span>{product?.quantity}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrderRow;
