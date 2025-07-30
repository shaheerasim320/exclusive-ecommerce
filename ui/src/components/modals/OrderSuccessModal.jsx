import React from 'react'

const OrderSuccessModal = ({ onClose }) => {
    const handleCloseModal = () => {
        onClose()
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md py-8 px-6 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-scale-in" style={{ opacity: 1, transform: 'scale(1)' }}>
                <div className="flex justify-center mb-6">
                    <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-[#e8e6ff] flex items-center justify-center flex-shrink-0">
                        <img src="/images/success-icon.png" alt="success-icon" className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px] object-contain rounded-full"/>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center">
                    <h2 className='font-inter text-xl sm:text-2xl font-semibold mb-2 leading-tight text-gray-900'>Order Placed Successfully!</h2>
                    <div className="flex flex-col items-center mb-6">
                        <span className='text-sm sm:text-base text-gray-600 mb-1'>Thank you for your order</span>
                        <span className='text-sm sm:text-base text-gray-600'>View my orders for order history</span>
                    </div>
                    <button className='w-full py-3 bg-[#DB4444] rounded-md text-white font-medium hover:bg-[#E07575] transition-colors duration-200 max-w-[280px]' onClick={handleCloseModal}>
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccessModal