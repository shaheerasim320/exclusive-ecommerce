import React from 'react'
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator'

const BillingProductRow = ({ product, quantity, color, size,adjustWidth=false }) => {
    return (
        <tr className=" my-[12px] px-[7px] flex items-center justify-between shadow ">
            <td>
                {/* Product Title & Image */}
                <div className={`product-title-image flex items-center gap-[13px] ${adjustWidth?"w-[171px]":""}`}>
                    {/* Image */}
                    <div className="icon w-[54px] h-[54px] flex items-center justify-center">
                        <img src={product && product.mainImage} alt="product" className="object-contain max-w-[54px] max-h-[54px]" />
                    </div>
                    {/* Image Ends Here */}
                    {/* Title  */}
                    <div className={`title flex flex-col`}>
                        <h6 className={`${adjustWidth?"w-[96px] text-[14px]":"text-[16px]"}`}>{product && product.title}</h6>
                        <div className={`flex ${adjustWidth?"gap-[5px]":"gap-[12px]"}`}>
                            <span className={`${adjustWidth?"text-[10px]":"text-[12px]"} text-[#A6A6A6] ${color ? '' : 'hidden'}`}>{"Color: " + color}</span>
                            <span className={`${adjustWidth?"text-[10px]":"text-[12px]"} text-[#A6A6A6] ${size ? '' : 'hidden'}`}>{"Size: " + size}</span>
                        </div>

                    </div>
                    {/* Title  End Here*/}
                </div>
                {/* Product Title & Image Ends Here*/}
            </td>
            <td colSpan={2} className="h-[24px] w-[249px] flex justify-between">
                {/* Price*/}
                <div className="price">
                    {product.discount!=0?(<div className="flex gap-[10px]"><span className="text-[16px] text-[#DB4444]">${Math.round(calculateDiscountPrice(product.price,product.discount))}</span><span className="text-[16px] text-[#888888]"><del>${product.price}</del></span></div>):(<div><span className="text-[16px] text-[#DB4444]">${product && product.price}</span></div>)}
                </div>
                {/* Price Ends Here */}
                {/* Qty */}
                <div className="qty flex gap-[5px]">
                    <div className="label">
                        <span className="text-[#605f5f]">Qty:</span>
                    </div>
                    <div className="value"><span>{product && quantity}</span></div>
                </div>
                {/* Qty Ends Here*/}
            </td>
        </tr>
    )
}

export default BillingProductRow
