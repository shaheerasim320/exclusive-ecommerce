import React from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import RevenueAnalytics from '../../components/RevenueAnalytics'
import TopCategories from '../../components/TopCategories'
import OrderTable from '../../components/OrderTable';

const AdminDashboard = () => {
  return (
    <div className="flex h-full">
      {/* Sidebar - Fixed Position */}
      <AdminSidebar pageName={"dashboard"}/>
      
      {/* Main Content - Make it scrollable */}
      <div className="flex-1 p-4">
        <div className="card flex gap-[20px]">
          <div className="card-1 flex flex-col justify-between w-[304px] h-[120px] rounded-md bg-[#F5F5F5] px-[12px] py-[10px]">
            <div className="title-icon flex justify-between items-center">
              <h3>Total Sales</h3>
              <div className="icon flex w-[32px] h-[32px] bg-white items-center justify-center">
                <img src="/images/sales-icon.svg" alt="sales" className="w-[28px] h-[28px]" />
              </div>
            </div>
            <div className="count flex justify-between items-center">
              <span className="font-bold text-[20px]">$983,410</span>
              <div className="comparision flex flex-col">
                <span className="text-[14px] text-right text-green-500 font-bold">+3.34%</span>
                <span className="text-[10px]">vs last week</span>
              </div>
            </div>
          </div>
          <div className="card-2 flex flex-col justify-between w-[304px] h-[120px] rounded-md bg-[#F5F5F5] px-[12px] py-[10px]">
            <div className="title-icon flex justify-between items-center">
              <h3>Total Orders</h3>
              <div className="icon flex w-[32px] h-[32px] bg-white items-center justify-center">
                <img src="/images/order-icon.svg" alt="sales" className="w-[28px] h-[28px]" />
              </div>
            </div>
            <div className="count flex justify-between items-center">
              <span className="font-bold text-[20px]">58,375</span>
              <div className="comparision flex flex-col">
                <span className="text-[14px] text-right text-[#DB4444] font-bold">-2.89%</span>
                <span className="text-[10px]">vs last week</span>
              </div>
            </div>
          </div>
          <div className="card-3 flex flex-col justify-between w-[304px] h-[120px] rounded-md bg-[#F5F5F5] px-[12px] py-[10px]">
            <div className="title-icon flex justify-between items-center">
              <h3>Total Customers</h3>
              <div className="icon flex w-[32px] h-[32px] bg-white items-center justify-center">
                <img src="/images/user.svg" alt="sales" className="w-[28px] h-[28px] invert" />
              </div>
            </div>
            <div className="count flex justify-between items-center">
              <span className="font-bold text-[20px]">10,243</span>
              <div className="comparision flex flex-col">
                <span className="text-[14px] text-right text-green-500 font-bold">+8%</span>
                <span className="text-[10px]">vs last week</span>
              </div>
            </div>
          </div>
        </div>
        <div className="charts flex justify-between mt-[1.6rem]">
          <RevenueAnalytics />
          <TopCategories />
        </div>
        <div className="order-table mt-[1.6rem]">
          <OrderTable/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
