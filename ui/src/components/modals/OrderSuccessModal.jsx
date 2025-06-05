import React from 'react'

const OrderSuccessModal = ({onClose}) => {
    const handleCloseModal = () =>{
        onClose()
    }
    return (
        <div className="min-h-[300px]">
            <div className="backdrop inset-0 bg-black opacity-50 z-40 fixed"></div>
            <div className="modal z-50 fixed inset-0 flex items-center justify-center">
                <div className="w-[320px] h-[400px] bg-white rounded-md shadow-md">
                    <div className="image w-[280px] h-[170px] flex items-center justify-center  mx-auto mt-[12px]">
                        <div className="img w-[150px] h-[150px] rounded-full bg-[#e8e6ff]">

                        <img src="\images\success-icon.png" alt="success-icon" className='w-[150px] h-[150px] rounded-full'/>
                        </div>
                    </div>
                    <div className="content flex flex-col">
                        <h2 className='font-inter text-[24px] font-[550] w-[260px] my-[7px] text-center mx-auto'>Order Placed Successfully!</h2>
                        <div className="flex flex-col w-[280px] mx-auto items-center">
                            <span className='text-[14px] text-[#8E8C8C]'>Thank you for your order</span>
                            <span className='text-[14px] text-[#8E8C8C]'>View my orders for order history</span>
                        </div>
                        <button className='w-[280px] h-[44px] mt-[20px] bg-[#DB4444] rounded-md text-white mx-auto hover:bg-[#E07575]' onClick={handleCloseModal}>Continue Shopping</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccessModal
