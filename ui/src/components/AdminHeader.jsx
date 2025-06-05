import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AdminHeader = () => {
    const navigate = useNavigate()
    const { user } = useSelector(state => state.user)
    return (
        <div className="h-[15vh] w-full flex  items-center">
            <div className="logo">
                <div className="h-[60px] flex items-center justify-center cursor-pointer" onClick={() => navigate("/")}>
                    <span className="text-black text-2xl px-[25px] font-bold">EXCLUSIVE</span>
                </div>
            </div>
            <div className="wrapper flex justify-between w-full ml-[6.5rem]">
                <div className="search">
                    <div className="search px-4 py-2 bg-[#F5F5F5] w-[515px]  flex gap-[10px]">
                        <img src="/images/search.svg" alt="search" className="cursor-pointer" />
                        <input type="text" placeholder="What are you looking for?" className="bg-[#F5F5F5] w-[515px] border-0 focus:outline-none focus:border-0" />
                    </div>
                </div>
                <div className="buttons w-[313px] flex items-center justify-between">
                    <div className="message cursor-pointer">
                        <img src="\images\bell-icon.svg" alt="bell-icon" className="w-[28px] h-[28px]" />
                    </div>
                    <div className="profile-icon mr-[3.5rem] flex items-center gap-[14px] group hover:cursor-pointer">
                        {/* Child Icon */}
                        <div className="icon bg-[#89b9f8] rounded-sm h-[38px] w-[38px] flex items-center justify-center group">
                            <img src="/images/user.svg" alt="search" className="invert" />
                        </div>

                        {/* Child Info */}
                        <div className="info flex flex-col group overflow-hidden">
                            <span className="text-[14px] overflow-hidden">{user?.fullName}</span>
                            <span className="text-[12px]">{user?.role.charAt(0).toUpperCase()+user?.role.slice(1)}</span>
                        </div>

                        {/* Child Dropdown Icon */}
                        <div className="dropdown-icon group">
                            <img src="/images/decrease.svg" alt="" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AdminHeader
