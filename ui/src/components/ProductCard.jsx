import React, { useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator';
import ProductModal from './modals/ProductModal';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onWishlistToggle, onCartClick, isWishlistSelected, isAddToCartSelected }) => {
    const [wishlistHovered, setWishlistHovered] = useState(false);
    const [cartHovered, setCartHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [actionToPerform, setActionToPerform] = useState("");
    const handleWishlistToggle = () => {
        onWishlistToggle(product._id)
    }
    const handleCartClick = () => {
        if (product.stock == 0) return;
        if (product?.sizes || product?.colors) {
            setActionToPerform("cart");
            setIsModalOpen(true);
            setPendingAction(() => (size, color) => {
                onCartClick(product._id, 1, size, color)
            })
        } else {
            onCartClick(product._id, 1);
        }
    }
    const closeModal = (isActionConfirmed, size = null, color = null) => {
        setIsModalOpen(false);
        if (pendingAction) {
            if (isActionConfirmed) {
                pendingAction(size, color);
            } else {
                toast.error("Required Option Not Selected");
            }
            setPendingAction(null);
        }
    }
    const ProductCardComponent = (
        <div>
            {isModalOpen && <ProductModal product={product} onClose={closeModal} action={actionToPerform} />}
            <div className=" w-full flex flex-col justify-between h-full ">
                <div className="relative">
                    <div className={`${product?.stock === 0 ? "bg-[#DB4444]" : product?.new ? "bg-[#00FF66]" : product?.discount > 0 || product?.flashSaleDiscount > 0 ? "bg-[#DB4444]" : "hidden"} absolute top-2 left-2 text-white text-xs px-2 py-1 rounded`}>
                        {product?.stock === 0 ? "Out Of Stock" : product?.new ? "NEW" : product?.flashSaleDiscount > 0 ? `- ${product?.flashSaleDiscount}%` : `- ${product?.discount}%`}
                    </div>
                    <div
                        className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer"
                        onMouseEnter={() => setWishlistHovered(true)}
                        onMouseLeave={() => setWishlistHovered(false)}
                        onClick={handleWishlistToggle}
                    >
                        <Icon icon={wishlistHovered || isWishlistSelected ? "mdi:heart" : "mdi:heart-outline"} className={`${wishlistHovered || isWishlistSelected ? "text-[#DB4444] fill-[#DB4444]" : ""}`} />
                    </div>

                    <div className="bg-[#F5F5F5] aspect-square flex items-center justify-center p-4">
                        <img src={product?.mainImage} alt="product" className="max-h-full object-contain" />
                    </div>
                </div>

                <div className="mt-3 text-sm font-medium text-gray-800">{product?.title}</div>

                <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="price flex gap-3 items-center">
                        {(product?.discount > 0 || product?.flashSaleDiscount > 0) && (
                            <p className="text-[#DB4444] font-semibold text-[16px]">
                                ${product?.flashSaleDiscount > 0 ? Math.round(calculateDiscountPrice(product.price, product.flashSaleDiscount)) : Math.round(calculateDiscountPrice(product.price, product.discount))}
                            </p>
                        )}
                        <p className={`text-sm ${product?.discount > 0 || product?.flashSaleDiscount > 0 ? "text-[#888888]" : "text-[#DB4444] font-semibold"}`}>
                            {product?.discount > 0 || product?.flashSaleDiscount > 0 ? <del>${product?.price}</del> : <span>${product?.price}</span>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
    return !wishlistHovered ? (
        <Link to={`/products/${product?.slug}/${product?.productCode}`}>
            {ProductCardComponent}
        </Link>
    ) : (
        ProductCardComponent
    );
};

export default ProductCard;
