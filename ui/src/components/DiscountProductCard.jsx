import React from 'react'
import { calculateDiscountPrice } from '../functions/DiscountPriceCalculator'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductModal from './modals/ProductModal';
import { useDispatch, useSelector } from 'react-redux';
import { setDelayedAction } from '../slices/userSlice';


const DiscountProductCard = ({ product, onWishlistToggle, onCartClick, isWishlistSelected, isAddToCartSelected }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const [isWishlistHovered, setIsWishlistHovered] = useState(false);
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [isCartHovered, setIsCartHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
    const [actionToPerform, setActionToPerform] = useState("");

    const handleWishlistHover = (state) => {
        setIsWishlistHovered(state);
    };

    const handleCardHover = (state) => {
        setIsCardHovered(state);
    };

    const handleWishlistToggle = () => {
        onWishlistToggle(product._id);
    };
    const handleAddToCart = () => {
        if (product.stock == 0) return;
        if (isAddToCartSelected) return;
        if (product?.sizes || product?.colors) {
            setActionToPerform("cart");
            setIsModalOpen(true);
            setPendingAction(() => (size, color) => {
                addProductToCart(product._id, color, size)
            });
        } else {
            addProductToCart(product._id)
        }
    };


    const addProductToCart = (id, color = null, size = null) => {
        onCartClick(id, 1, color, size)
    }

    const closeModal = (isActionConfirmed, size = null, color = null) => {
        setIsModalOpen(false);
        if (pendingAction) {
            if (isActionConfirmed) {
                pendingAction(size, color);
            } else {
                toast.error("Required Option Not Selected")
            }
            setPendingAction(null);
        }
    };
    return (
        <div onMouseEnter={() => handleCardHover(true)} onMouseLeave={() => { handleCardHover(false) }} className={`${isCartHovered && isAddToCartSelected ? '' : 'hover'} select-none`}>
            {/* Card Starts Here */}
            <div className="discount-card">
                {/* Image Container Starts Here */}
                <div className="image w-[270px] h-[250px] bg-[#f5f5f5] flex flex-col items-center ">
                    {/* Wishlish & Discount/New Container Starts Here */}
                    <div className="buttons flex items-center justify-between w-[250px] m-auto pt-[4px]">
                        <Link to={`/product/${product._id}`}>
                            {product && product.stock == 0 ? (<div className="w-[80px] h-[26px] bg-[#DB4444] rounded-md relative">
                                <p className="text-[12px] text-white text-center py-[4px]">Out Of Stock</p>
                            </div>) : product.new ? (<div className="category-product w-[55px] h-[26px] bg-[#00FF66] rounded-md relative">
                                <p className="text-[12px] text-white text-center py-[4px]">NEW</p>
                            </div>) : (<div className="discount-percent w-[55px] h-[26px] bg-[#DB4444] rounded-md relative">
                                <p className="text-[12px] text-white text-center py-[4px]">{"-" + (Math.round(product.discount * 10) / 10) + "%"}</p>
                            </div>)}
                        </Link>
                        {isModalOpen && <ProductModal product={product} onClose={closeModal} action={actionToPerform} />}
                        <div className="wishlist w-[34px] h-[34px] bg-white rounded-full cursor-pointer" onMouseEnter={() => handleWishlistHover(true)} onMouseLeave={() => handleWishlistHover(false)} onClick={handleWishlistToggle}>
                            <svg className="m-auto relative top-[8px] hover:fill-[#DB4444]" width={18} height={16} viewBox="0 0 18 16" fill={isWishlistSelected ? '#DB4444' : 'none'} xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 1C2.7912 1 1 2.73964 1 4.88594C1 6.61852 1.7 10.7305 8.5904 14.8873C8.71383 14.961 8.85552 15 9 15C9.14448 15 9.28617 14.961 9.4096 14.8873C16.3 10.7305 17 6.61852 17 4.88594C17 2.73964 15.2088 1 13 1C10.7912 1 9 3.35511 9 3.35511C9 3.35511 7.2088 1 5 1Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    {/* Wishlist & Discount/New Container Ends Here */}
                    <Link to={`/product/${product._id}`}>
                        <div className="image w-[190px] h-[180px] flex justify-center items-center">
                            <img src={product.mainImage} alt="product-image" className=" m-auto my-[50px]" />
                        </div>
                    </Link>
                    <div className={`addtocart invisble w-[270px] h-[45px] rounded-sm bg-black justify-center items-center relative opacity-0 ${isAddToCartSelected ? '' : 'cursor-pointer'} ${(isWishlistHovered === false) && isCardHovered && product.stock != 0 ? "flex opacity-100" : ""} transition-opacity duration-5000 `} onClick={handleAddToCart} onMouseEnter={() => setIsCartHovered(true)} onMouseLeave={() => setIsCartHovered(false)}>
                        <p className="text-[16px] text-center font-poppins text-white">{isAddToCartSelected ? 'Added To Cart' : 'Add To Cart'}</p>
                    </div>
                </div>
                <Link to={`/product/${product._id}`}>
                    {/* Contents Start Here */}
                    <div className="contents-box w-[195px] h-[84px] flex flex-col gap-[7px]  mt-[6px]">
                        {/* Title */}
                        <div className="title w-[270px]">
                            <h3 className="text-[16px]">{product.title}</h3>
                        </div>
                        {/* Title Ends */}
                        {/* Price */}
                        <div className="price flex gap-[12px]">
                            <p className="discounted-price text-[#db4444] text-[16px] inline-block">{"$" + Math.round(calculateDiscountPrice(product.price, product.discount))}</p>
                            <p className="original-price text-[#888888] inline-block"><del>{"$" + product.price}</del></p>
                        </div>
                        {/* Price Ends */}
                        {/* Rating  */}
                        <div className="ratings flex items-center gap-[8px]">
                            {/* Stars */}
                            <div className="stars flex">
                                <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                </svg>
                                <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                </svg>
                                <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                </svg>
                                <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="#FFAD33" />
                                </svg>
                                <svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.25" d="M14.673 7.17173C15.7437 6.36184 15.1709 4.65517 13.8284 4.65517H11.3992C10.7853 4.65517 10.243 4.25521 10.0617 3.66868L9.33754 1.32637C8.9309 0.0110567 7.0691 0.0110564 6.66246 1.32637L5.93832 3.66868C5.75699 4.25521 5.21469 4.65517 4.60078 4.65517H2.12961C0.791419 4.65517 0.215919 6.35274 1.27822 7.16654L3.39469 8.78792C3.85885 9.1435 4.05314 9.75008 3.88196 10.3092L3.11296 12.8207C2.71416 14.1232 4.22167 15.1704 5.30301 14.342L7.14861 12.9281C7.65097 12.5432 8.34903 12.5432 8.85139 12.9281L10.6807 14.3295C11.7636 15.159 13.2725 14.1079 12.8696 12.8046L12.09 10.2827C11.9159 9.71975 12.113 9.10809 12.5829 8.75263L14.673 7.17173Z" fill="black" />
                                </svg>
                            </div>
                            {/* Stars End */}
                            {/* No. Of Reviews */}
                            <div className="reviews">
                                <p className="text-[#888888]">({product.reviews})</p>
                            </div>
                            {/* No. of Reviews Ends */}
                        </div>
                        {/* Ratings End */}
                    </div>
                    {/* Contents End Here */}
                </Link>
            </div>
            {/* Card Ends Here */}
            <ToastContainer
                position="bottom-right" // Position of the toast message
                autoClose={3000} // Duration in milliseconds before toast disappears
                hideProgressBar={false} // Hide progress bar for simplicity
                closeOnClick={true} // Allow closing the toast by clicking
                pauseOnHover
            />
        </div>
    )
}

export default DiscountProductCard
