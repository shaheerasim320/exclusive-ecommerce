import React from 'react'

const ErrorModal = ({ onClose, message, btnMessage=null }) => {
    const handleCloseModal = () => {
        onClose();
    }
    return (
        <div>
            <div className="backdrop inset-0 bg-black opacity-50 z-40 fixed"></div>
            <div className="modal z-50 fixed inset-0 flex items-center justify-center">
                <div className="w-[320px] bg-white rounded-md shadow-md">
                    <div className="image w-[280px] h-[170px] flex items-center justify-center  mx-auto mt-[12px]">
                        <div className="img w-[150px] h-[150px] rounded-full bg-[#e8e6ff]">
                            <img src="\images\crying-icon.png" alt="crying-icon" className='w-[150px] h-[150px] rounded-full object-contain' />
                        </div>
                    </div>
                    <div className="content flex flex-col">
                        <h2 className='font-inter text-[24px] font-[550] w-[260px] my-[7px] text-center mx-auto'>{message}</h2>
                        <button className='w-[280px] h-[44px] my-[20px] bg-[#DB4444] rounded-md text-white mx-auto hover:bg-[#E07575]' onClick={handleCloseModal}>{btnMessage?btnMessage:'Continue Shopping'}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorModal
