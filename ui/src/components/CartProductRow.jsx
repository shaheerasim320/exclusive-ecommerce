import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';
import axios from 'axios';
import Loader from './Loader';


const CartProductRow = ({ product, cartItemID, qty, updateQuantity, color, size, onRemove }) => {
    const [quantity, setQuantity] = useState("0" + qty)
    const [increaseSignHovered, setIncreaseSignHovered] = useState(false)
    const [decreaseSignHovered, setDecreaseSignHovered] = useState(false)
    const [loading, setLoading] = useState(false);
    const hasUpdatedSubtotal = useRef(false);

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
        <tr className=" py-6 px-8  shadow">
            {loading && <td className="w-screen flex items-center justify-center"><Loader /></td>}
            <td className="grid grid-cols-4 items-center">
                <div className={`product ${loading ? "hidden" : "flex"} items-center`}>
                    <div className="image flex">
                        <div className="icon w-14 h-14 flex items-center justify-center select-none">
                            <img src={product && product?.mainImage} alt="Product Image" />
                        </div>
                        <div className="cancel w-5 h-5 bg-[#DB4444] relative top-[1px] right-[57px] rounded-full cursor-pointer select-none" onClick={handleRemove}>
                            <img src="/images/cancel.svg" alt="cross" className="mx-auto my-[5px]" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h6 className="title text-[16px] select-none">{product && product?.title}</h6>
                        {product && product?.stock == 0 ? (<span className="text-[13px] text-[#DB4444]"> Out Of Stock</span>) : ""}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
                <div className="price text-center">
                    {product?.discount > 0 ? (<div className="flex gap-[10px] justify-center"><span className="text-[16px] text-[#DB4444]">${Math.round(calculateDiscountPrice(product?.price, product?.discount))}</span><span className="text-[16px] text-[#888888]"><del>${product?.price}</del></span></div>) : (<div><span className="text-[16px] text-[#DB4444]">${product && product?.price}</span></div>)}
                </div>
                <div className="text-center">
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
                <div className="subtotal text-center">
                    <span className="text-[16px] select-none">${product && product?.discount ? Math.round(calculateDiscountPrice(product?.price, product?.discount) * qty) : product?.price * qty}</span>
                </div>
            </td>
            <td colSpan={3} className={`${loading ? "hidden" : "flex"} items-center justify-between `}>

            </td>
        </tr>
    );
}

export default CartProductRow
