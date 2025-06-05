import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { calculateDiscountPrice } from "../../functions/DiscountPriceCalculator";

export default function AddToCartModal({ product, onClose, onConfirm }) {
    const navigate = useNavigate();
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    const handleOnClick = () => {
        const color = selectedColor != "" ? selectedColor : null;
        const size = selectedSize != "" ? selectedSize : null;
        onConfirm(color, size);
    }
    const handleGoToProductClick = () => {
        navigate(`/products/${product.slug}/${product.productCode}`)
    }
    const canAdd = (!product?.colors?.length || selectedColor) && (!product?.sizes?.length || selectedSize);

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black opacity-50"></div>

            {/* Modal container fixed to right, 100vh height */}
            <div className="fixed top-0 right-0 z-50 h-screen w-full max-w-md bg-white p-6 flex flex-col gap-6 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h4 className="text-black font-semibold text-lg">ADD</h4>
                    <button className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition" onClick={onClose}>
                        X
                    </button>
                </div>

                {/* Product Info */}
                <Link to={`/products/${product.slug}/${product.productCode}`}>
                    <div className="flex gap-4">
                        <img
                            src={product?.mainImage}
                            alt="product-image"
                            className="w-28 h-36 object-contain"
                        />
                        <div className="flex flex-col justify-center">
                            <h3 className="uppercase font-medium text-gray-800">
                                {product?.title}
                            </h3>
                            <span className="text-[#DB4444]">${product?.discount > 0 ? Math.round(calculateDiscountPrice(product.price, product.discount)) : product.price}</span>
                        </div>
                    </div>
                </Link>

                {product?.colors?.length > 0 && (
                    <div className={`${product?.colors ? "" : "hidden"}`}>
                        <h4 className="text-xs uppercase text-gray-700 mb-2">
                            {!selectedColor ? "Select Color" : `Selected Color: ${selectedColor}`}
                        </h4>
                        <div className="flex space-x-2">
                            {product?.colors?.map((color, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedColor(color.toLowerCase())}
                                    className={`w-6 h-6 rounded-full border-2 ${selectedColor === color.toLowerCase()
                                        ? "border-gray-700"
                                        : "border-gray-300"
                                        }`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                ></button>
                            ))}
                        </div>
                    </div>
                )}


                {product?.sizes?.length > 0 && (
                    <div className={`${product?.sizes ? "flex flex-col" : "hidden"}`}>
                        <h4 className="text-xs uppercase text-gray-700 mb-2">
                            {!selectedSize ? "Select Size" : `Selected Size: ${selectedSize}`}
                        </h4>
                        <div className="flex space-x-2">
                            {product?.sizes?.map((size, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 border rounded ${selectedSize === size
                                        ? "bg-gray-700 text-white"
                                        : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}


                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                    <button className={`bg-[#DB4444] ${canAdd ? "hover:bg-[#E07575]" : ""} text-white rounded-sm py-3 transition`} disabled={!canAdd} onClick={handleOnClick}>
                        ADD
                    </button>
                    <button className="py-3 rounded-sm border border-black hover:border-gray-400 transition" onClick={handleGoToProductClick}>
                        GO TO PRODUCT
                    </button>
                </div>
            </div>
        </>
    );
}
