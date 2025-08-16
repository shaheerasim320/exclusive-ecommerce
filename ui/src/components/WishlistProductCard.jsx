import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';

const WishlistProductCard = ({ product, productId, wishlistItemID, onDelete, onAddToCart, color, size }) => {
    const [deleteHovered, setDeleteHovered] = useState(false);
    const [cartHovered, setCartHovered] = useState(false);

    const handleDeleteClick = () => {
        onDelete(wishlistItemID);
    };

    const handleCartClick = () => {
        if (product?.stock === 0) return;
        onAddToCart(wishlistItemID, product);
    };

    return (
        <div className="w-full flex flex-col justify-between h-full">
            {/* Product Image & Actions */}
            <div className="relative">
                {/* Badge */}
                <div className={`${product?.stock === 0 ? "bg-[#DB4444]" : product?.new ? "bg-[#00FF66]" : product?.discount > 0 || product?.flashSaleDiscount > 0 ? "bg-[#DB4444]" : "hidden"} absolute top-2 left-2 text-white text-xs px-2 py-1 rounded`}>
                    {product?.stock === 0 ? "Out Of Stock" : product?.new ? "NEW" : product?.flashSaleDiscount > 0 ? `- ${product?.flashSaleDiscount}%` : `- ${product?.discount}%`}
                </div>

                {/* Delete Icon */}
                <div className="absolute top-2 right-2 bg-white rounded-full p-1 sm:p-2 cursor-pointer" onMouseEnter={() => setDeleteHovered(true)} onMouseLeave={() => setDeleteHovered(false)} onClick={handleDeleteClick}>
                    <Icon icon="material-symbols:delete-outline" className={`${deleteHovered ? "text-[#DB4444] fill-[#DB4444]" : ""} w-4 h-4 sm:w-5 sm:h-5`} />
                </div>

                {/* Product Image */}
                <div className="bg-[#F5F5F5] aspect-square flex items-center justify-center p-2 sm:p-4">
                    <img src={product?.mainImage} alt="product" className="max-h-full object-contain" />
                </div>
            </div>

            {/* Product Title */}
            <div className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-800 line-clamp-2">
                {product?.title}
            </div>

            {/* Price and Add to Cart */}
            <div className="mt-auto flex items-center justify-between pt-2">
                <div className="price flex gap-2 sm:gap-3 items-center">
                    {(product?.discount > 0 || product?.flashSaleDiscount > 0) && (
                        <p className="text-[#DB4444] font-semibold text-[16px]">
                            ${product?.flashSaleDiscount > 0 ? Math.round(calculateDiscountPrice(product.price, product.flashSaleDiscount)) : Math.round(calculateDiscountPrice(product.price, product.discount))}
                        </p>
                    )}
                    <p className={`text-sm ${product?.discount > 0 || product?.flashSaleDiscount > 0 ? "text-[#888888]" : "text-[#DB4444] font-semibold"}`}>
                        {product?.discount > 0 || product?.flashSaleDiscount > 0 ? <del>${product?.price}</del> : <span>${product?.price}</span>}
                    </p>
                </div>

                {/* Cart Icon */}
                <div className={`${cartHovered ? "bg-[#CCC]" : "bg-[#F5F5F5]"} p-1.5 sm:p-2 rounded-md cursor-pointer`} onMouseEnter={() => setCartHovered(true)} onMouseLeave={() => setCartHovered(false)} onClick={handleCartClick}>
                    <Icon icon="mdi:cart-outline" className={`${cartHovered ? "invert" : ""} w-4 h-4 sm:w-5 sm:h-5`} />
                </div>
            </div>
        </div >
    );
};

export default WishlistProductCard;
