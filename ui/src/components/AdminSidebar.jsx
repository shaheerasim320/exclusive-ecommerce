import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({pageName}) => {
    const [active, setActive] = useState(pageName);
    const navigate = useNavigate()
    const handleClick = (pageName) => {
        navigate(`/admin/${pageName}`)
    }
    useEffect(()=>{
        setActive(pageName)
    })
    return (
        <div className="w-[260px] h-[80vh] flex flex-col gap-[20px] items-center">
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "dashboard" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer `} onClick={()=>handleClick("dashboard")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/dashboard-icon.svg" alt="dashboard-icon" className="object-contain"/>
                </div>
                <span>Dashboard</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "orders" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer `} onClick={()=>handleClick("orders")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/order-icon.svg" alt="order-icon" className="object-contain"/>
                </div>
                <span>Orders</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "products" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer `} onClick={()=>handleClick("products")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/icon-product.svg" alt="product-icon" className="object-contain" />
                </div>
                <span>Products</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "category" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer`} onClick={()=>handleClick("category")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/category-icon.png" alt="category-icon" className="object-contain" />
                </div>
                <span>Categories</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "sub-category" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer`} onClick={()=>handleClick("sub-category")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/sub-categories.png" alt="category-icon" className="object-contain"/>
                </div>
                <span>Sub Categories</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "customers" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer `} onClick={()=>handleClick("customers")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/customer-icon.svg" alt="customer-icon" className="object-contain" />
                </div>
                <span>Customers</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "reports" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer`} onClick={()=>handleClick("reports")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/report-icon.svg" alt="report-icon" className="object-contain" />
                </div>
                <span>Reports</span>
            </div>
            <div className={`tab w-[245px] h-[52px] flex items-center gap-[10px] px-[10px] rounded-md ${active == "flash-sale" ? "bg-[#F5F5F5]" : "hover:bg-[#F5F5F5]"} cursor-pointer`} onClick={()=>handleClick("flash-sale")}>
                <div className="icon w-[36px] h-[36px] p-[6px] flex justify-center">
                    <img src="/images/flash-sale-icon.png" alt="flash-sale-icon" className="object-contain" />
                </div>
                <span>Flash Sale</span>
            </div>
        </div>
    )
}

export default AdminSidebar
