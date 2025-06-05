import React from 'react'

const EmailConfirmModal = ({ onClick, account = false }) => {
    const handleClick = () => {
        onClick()
    }
    return (
        <div>
            <div className="backdrop inset-0 bg-black opacity-50 z-40 fixed"></div>
            <div className="z-50 inset-0 fixed flex items-center justify-center">
                <div className="bg-white rounded-[5px] h-[410px]">
                    <div className="image w-[280px] h-[170px] flex items-center justify-center mx-auto mt-[12px]">
                        <div className="img w-[150px] h-[150px] rounded-full bg-[#e8e6ff]">
                            <img src="\images\tick-icon.png" alt="crying-icon" className='w-[150px] h-[150px] rounded-full object-contain' />
                        </div>
                    </div>
                    <div className="content flex flex-col w-[520px] gap-[11px] items-center">
                        <h2 className='font-inter text-[24px] font-[550] my-[7px] text-center mx-auto'>Email is Verified!</h2>
                        <p className='w-[420px] text-center'>Your {account?"account":"email"} has successfully verified. You can now go back to the login page to access Exclusive</p>
                        <button className='my-[20px] bg-[#DB4444] rounded-[18px] text-white py-[6px] px-[37px] mx-auto hover:bg-[#E07575]' onClick={handleClick}>Go to Login Page</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default EmailConfirmModal
