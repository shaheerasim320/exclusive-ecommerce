import React, { useState } from 'react';
import { Link } from 'react-router-dom'


const Aside = ({mt=0,setActive=""}) => {
    const [activePage,setActivePage]=useState(setActive)
    const handleClick=(click)=>{
        setActivePage(click)
    }
    return (
        <aside className={`w-[185px] h-[250px] mt-[${mt}px]`}>
            <ul>
                <li><Link to="/manage-my-account" className={`text-[16px] font-medium ${activePage=='manage-my-account'?'text-[#DB4444]':'hover:text-[#DB4444]'}`} onClick={() => handleClick("manage-my-account")}>Manage My Account</Link>
                    <ul className="ml-[30px] flex flex-col gap-[6px] text-[16px] my-[10px]">
                        <li><Link to="/my-profile" className={`text-[16px] ${activePage=='my-profile'?'text-[#DB4444]':'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("my-profile")}>My Profile</Link></li>
                        <li><Link to="/address-book" className={`text-[16px] ${activePage=='address-book'?'text-[#DB4444]':'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("address-book")}>Address Book</Link></li>
                        <li><Link to="/payment-options" className={`text-[16px] ${activePage=='payment-options'?'text-[#DB4444]':'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("payment-options")}>My Payment Options</Link></li>
                    </ul>
                </li>
                <li><Link to="/orders" className={`text-[16px] font-medium ${activePage=='orders'?'text-[#DB4444]':'hover:text-[#DB4444]'}`} onClick={() => handleClick("orders")}>My Orders</Link>
                    <ul className="ml-[30px] flex flex-col gap-[6px] text-[16px] my-[10px]">
                        <li><Link to="/returns" className={`text-[16px] ${activePage=='returns'?'text-[#DB4444]':'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("returns")}>My Returns</Link></li>
                        <li><Link to="/cancellation" className={`text-[16px] ${activePage=='cancellation'?'text-[#DB4444]':'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("cancellation")}>My Cancellations</Link></li>
                    </ul>
                </li>
                <li><Link to="/wishlist" className="text-[16px] font-medium hover:text-[#DB4444]">My Wishlist</Link>
                </li>
            </ul>
        </aside>
    )
}

export default Aside
