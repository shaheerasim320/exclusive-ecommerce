import React, { useState } from 'react';
import { Link } from 'react-router-dom'


const Aside = ({mt=0,setActive=""}) => {
    const [activePage,setActivePage]=useState(setActive)
    const handleClick=(click)=>{
        setActivePage(click)
    }
    return (
        // Adjusted width, height, and margin for responsiveness
        // Added flex-col for vertical stacking and gap-2 for spacing
        // Added responsive classes for padding and rounded corners
        <aside className={`w-full lg:w-[200px] h-auto p-4 lg:p-0 rounded-md lg:rounded-none bg-gray-100 lg:bg-transparent shadow-md lg:shadow-none flex flex-col gap-2 mt-${mt / 4}`}> {/* mt conversion to Tailwind units */}
            <ul>
                {/* Main menu item, adjusted font size and hover effect */}
                <li>
                    <Link to="/manage-my-account" className={`text-base md:text-lg font-medium ${activePage === 'manage-my-account' ? 'text-[#DB4444]' : 'hover:text-[#DB4444]'}`} onClick={() => handleClick("manage-my-account")}>Manage My Account</Link>
                    {/* Sub-menu, adjusted margin, flex direction, gap, and font size */}
                    <ul className="ml-4 flex flex-col gap-1 text-sm md:text-base my-2">
                        <li><Link to="/my-profile" className={`${activePage === 'my-profile' ? 'text-[#DB4444]' : 'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("my-profile")}>My Profile</Link></li>
                        <li><Link to="/address-book" className={`${activePage === 'address-book' ? 'text-[#DB4444]' : 'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("address-book")}>Address Book</Link></li>
                        <li><Link to="/payment-options" className={`${activePage === 'payment-options' ? 'text-[#DB4444]' : 'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("payment-options")}>My Payment Options</Link></li>
                    </ul>
                </li>
                {/* Main menu item, adjusted font size and hover effect */}
                <li>
                    <Link to="/orders" className={`text-base md:text-lg font-medium ${activePage === 'orders' ? 'text-[#DB4444]' : 'hover:text-[#DB4444]'}`} onClick={() => handleClick("orders")}>My Orders</Link>
                    {/* Sub-menu, adjusted margin, flex direction, gap, and font size */}
                    <ul className="ml-4 flex flex-col gap-1 text-sm md:text-base my-2">
                        <li><Link to="/returns" className={`${activePage === 'returns' ? 'text-[#DB4444]' : 'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("returns")}>My Returns</Link></li>
                        <li><Link to="/cancellation" className={`${activePage === 'cancellation' ? 'text-[#DB4444]' : 'text-[#858585] hover:text-[#DB4444]'}`} onClick={() => handleClick("cancellation")}>My Cancellations</Link></li>
                    </ul>
                </li>
                {/* Main menu item, adjusted font size and hover effect */}
                <li>
                    <Link to="/wishlist" className="text-base md:text-lg font-medium hover:text-[#DB4444]">My Wishlist</Link>
                </li>
            </ul>
        </aside>
    )
}

export default Aside
