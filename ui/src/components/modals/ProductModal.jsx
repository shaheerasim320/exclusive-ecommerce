import React, { useState } from 'react';

const ProductModal = ({ product, onClose, action }) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");


  const handleButton = () => {
    if (product?.colors && !selectedColor) {
      alert("Please select color.");
      return;
    }else if (product?.sizes && !selectedSize){
      alert("Please select size.");
      return;
    }
    if(product?.sizes && product?.colors){
      onClose(true,selectedSize,selectedColor);
    }else if(product?.sizes){
      onClose(true,selectedSize,null)
    }else{
      onClose(true,null,selectedColor)
    }
  };

  const handleClose=()=>{
    onClose(false)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose}></div>

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
          >
            X
          </button>

          {/* Modal Content */}
          <h2 className="text-2xl font-semibold mb-4">{product?.title}</h2>
          <div className="mb-4">
            <h4 className="text-lg">Price: ${product?.price}</h4>
          </div>

          {/* Colors */}
          <div className={`${product?.colors?'':'hidden'} mb-4`}>
            <h4 className="text-lg">Colors:</h4>
            <div className="flex space-x-2 mt-2">
              {product?.colors?.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color.toLowerCase())}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedColor === color.toLowerCase() ? 'border-gray-700' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() }}
                ></button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className={`${product?.sizes?'flex':'hidden'} mb-4 items-center gap-[4px]`}>
            <h4 className="text-lg">Sizes:</h4>
            <div className="flex space-x-2 mt-2">
              {product?.sizes?.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size ? 'bg-gray-700 text-white' : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Wishlist Button */}
          <button
            onClick={handleButton}
            className="bg-red-500 text-white w-full py-2 rounded-md"
          >
            {action==='wishlist'?"Add To Wishlist":"Add To Cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
