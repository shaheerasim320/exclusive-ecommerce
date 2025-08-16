import React, { useEffect } from 'react'
import { useState } from 'react';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';
import Loader from './Loader';


const CartProductRow = ({ product, cartItemID, qty, updateQuantity, color, size, onRemove }) => {
    const [quantity, setQuantity] = useState("0" + qty)
    const [loading, setLoading] = useState(false);

    const handleUpdateQuantity = (quantity) => {
        updateQuantity(cartItemID, quantity)
    }
    const handleRemove = () => {
        onRemove(cartItemID)
    }
    useEffect(() => {
        if (product && product?.stock == 0) {
            setQuantity("00")
        } else if (product && qty > product?.stock) {
            setQuantity("0" + product?.stock)
        }
    }, [product])

    const handleQuantityChange = (cartItemID, quantity) => {
        updateQuantity(cartItemID, quantity);
    };
    return (
        // Changed to a grid container that stacks on mobile and uses the same column layout as the header on desktop
        <div className="grid grid-cols-1 sm:grid-cols-4 py-6 px-4 sm:px-8 shadow">
            {loading && <div className="w-full flex items-center justify-center col-span-4"><Loader /></div>}

            {/* Product section now spans the full width on mobile */}
            <div className={`product w-full ${loading ? "hidden" : "flex"} items-center col-span-1 sm:col-span-1`}>
                <div className="relative">
                    <div className="icon w-16 h-16 flex items-center justify-center select-none">
                        <img src={product && product?.mainImage} alt="Product Image" />
                    </div>
                    <div className="cancel absolute top-0 left-0 w-5 h-5 bg-[#DB4444] rounded-full cursor-pointer select-none" onClick={handleRemove}>
                        <img src="/images/cancel.svg" alt="cross" className="mx-auto my-[5px]" />
                    </div>
                </div>
                <div className="flex flex-col ml-4">
                    <h6 className="title text-[16px] select-none">{product && product?.title}</h6>
                    {product && product?.stock == 0 ? (<span className="text-[13px] text-[#DB4444]">Out Of Stock</span>) : ""}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 flex-wrap">
                        {color && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Color:</span>
                                <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} title={color}></span>
                                <span className="capitalize">{color}</span>
                            </div>
                        )}
                        {size && (
                            <div className="flex items-center gap-1">
                                <span className="font-medium">Size:</span>
                                <span className="uppercase">{size}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Price, Quantity, and Subtotal sections are now direct grid items */}
            <div className="price w-full flex justify-end items-center sm:justify-center mt-4 sm:mt-0">
                {product?.discount > 0 || product?.flashSaleDiscount > 0 ? (
                    <div className="flex flex-col gap-1 items-end sm:items-center">
                        <span className="text-[16px] text-[#DB4444]">${product?.flashSaleDiscount > 0 ? Math.round(calculateDiscountPrice(product.price, product.flashSaleDiscount)) : Math.round(calculateDiscountPrice(product.price, product.discount))}</span>
                        <span className="text-[14px] text-[#888888]"><del>${product?.price}</del></span>
                    </div>
                ) : (
                    <div><span className="text-[16px] text-[#DB4444]">${product && product?.price}</span></div>
                )}
            </div>

            <div className="w-full flex justify-end items-center sm:justify-center mt-4 sm:mt-0">
                <select
                    value={qty}
                    onChange={(e) => handleQuantityChange(cartItemID, parseInt(e.target.value))}
                    className="border px-2 py-1"
                >
                    {[...Array(product?.stock).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                </select>
            </div>

            <div className="subtotal w-full flex justify-end items-center sm:justify-center mt-4 sm:mt-0">
                <span className="text-[16px] select-none font-semibold">
                    ${product && (product.discount > 0 || product.flashSaleDiscount > 0) ? Math.round((product.flashSaleDiscount > 0 ? calculateDiscountPrice(product.price, product.flashSaleDiscount) : calculateDiscountPrice(product.price, product.discount)) * qty) : product.price * qty}
                </span>
            </div>
        </div>
    );
}

export default CartProductRow