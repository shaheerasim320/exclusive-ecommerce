import React from 'react'

const EmailSentModal = ({ name, onClose, onResend }) => {
    const handleCloseModal = () => {
        onClose();
    }
    const handleResendMail = () => {
        onResend();
    }
    return (
        <div>
            <div className="backdrop inset-0 bg-black opacity-50 z-40 fixed"></div>
            <div className="z-50 inset-0 fixed flex items-center justify-center">
                <div className="bg-white rounded-[5px] ">
                    <div className="image w-[280px] h-[170px] flex items-center justify-center  mx-auto mt-[12px]">
                        <div className="img w-[150px] h-[150px] rounded-full bg-[#e8e6ff]">
                            <img src="\images\email-icon.png" alt="crying-icon" className='w-[150px] h-[150px] rounded-full object-contain' />
                        </div>
                    </div>
                    <div className="content flex flex-col w-[520px] items-center">
                        <h2 className='font-inter text-[24px] font-[550] my-[7px] text-center mx-auto'>Check your inbox, please!</h2>
                        <p className='w-[440px] text-center'>Hey {name}, to start using Exclusive, we need to verify your email. We've already sent out the verification link. Please check it and confirm it's really you.</p>
                        <button className='my-[20px] bg-[#DB4444] rounded-[18px] text-white py-[6px] px-[37px] mx-auto hover:bg-[#E07575]' onClick={handleCloseModal} >Sure</button>
                        <div className="flex items-center mb-[44px] gap-[6px]">
                            <span className="text-[14px]">Didn't get the email? </span><span className="text-[#DB4444] hover:text-[#E07575] text-[14px] cursor-pointer" onClick={handleResendMail}>Resend Verification Email</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EmailSentModal
