import React, { useEffect } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';
import { Link } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import Loader from './Loader'

const WishlistProductCard = ({ product, productId, wishlistItemID, onDelete, onAddToCart, color, size }) => {

    const [loading, setLoading] = useState(false);
    const linkAdd = `/product-detail/${productId}`;
    const [deleteHovered, setDeleteHovered] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [wishlistHovered, setWishlistHovered] = useState(false);
    const [cartHovered, setCartHovered] = useState(false);

    const handleCardHover = (state) => {
        setIsCardHovered(state);
    };

    const handleDeleteClick = () => {
        onDelete(wishlistItemID);
    }
    const handleCartClick = () => {
        if (product?.stock == 0) return
        onAddToCart(wishlistItemID,product);
    }
    return (
        <div >
            <div className=" w-full flex flex-col justify-between h-full ">
                <div className="relative">
                    <div className={`${product?.stock === 0 ? "bg-[#DB4444]" : product?.new ? "bg-[#00FF66]" : product?.discount > 0 ? "bg-[#DB4444]" : "hidden"} absolute top-2 left-2 text-white text-xs px-2 py-1 rounded`}>
                        {product?.stock === 0 ? "Out Of Stock" : product?.new ? "NEW" : `- ${product?.discount}%`}
                    </div>
                    <div
                        className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer"
                        onMouseEnter={() => setDeleteHovered(true)}
                        onMouseLeave={() => setDeleteHovered(false)}
                        onClick={handleDeleteClick}
                    >
                        <Icon icon="material-symbols:delete-outline" className={`${deleteHovered ? "text-[#DB4444] fill-[#DB4444]" : ""}`} />
                    </div>

                    <div className="bg-[#F5F5F5] aspect-square flex items-center justify-center p-4">
                        <img src={product?.mainImage} alt="product" className="max-h-full object-contain" />
                    </div>
                </div>

                <div className="mt-3 text-sm font-medium text-gray-800">{product?.title}</div>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="price flex gap-3 items-center">
                        {product?.discount > 0 && (
                            <p className="text-[#DB4444] font-semibold text-[16px]">
                                ${Math.round(calculateDiscountPrice(product?.price, product?.discount))}
                            </p>
                        )}
                        <p className={`text-sm ${product?.discount > 0 ? "text-[#888888]" : "text-[#DB4444] font-semibold"}`}>
                            {product?.discount > 0 ? <del>${product?.price}</del> : <span>${product?.price}</span>}
                        </p>
                    </div>
                    <div
                        className={`${cartHovered ? "bg-[#CCC]" : "bg-[#F5F5F5]"} p-2 rounded-md cursor-pointer`}
                        onMouseEnter={() => setCartHovered(true)}
                        onMouseLeave={() => setCartHovered(false)}
                        onClick={handleCartClick}
                    >
                        <Icon icon="mdi:cart-outline" className={`${cartHovered ? "invert" : ""}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishlistProductCard
