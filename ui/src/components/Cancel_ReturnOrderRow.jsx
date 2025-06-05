import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Cancel_ReturnOrderRow = ({ order }) => {
    const navigate = useNavigate()
    const handleButton = () => {
        navigate(`/order-detail?orderID=${order.orderId}`, { state: { orderID: order._id } })
    }
    console.log(order)
    return (
        <>
            {/* Wrap the content of the row with <td> elements */}
            <td colSpan="4">
                <div className="return w-[900px] shadow">
                    <div className="w-[880px] mx-auto flex py-[14px] justify-between items-center">
                        <div className="order-date-and-order-num">
                            <div className="ordered-date text-[14px]">Requested on {String(new Date(order?.orderDate).getMonth() + 1).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getDate()).padStart(2, "0") + "/" + String(new Date(order?.orderDate).getFullYear())}</div>
                            <div className="order-number text-[12px]">Order <span className="text-[#1A9CB7] cursor-pointer" onClick={handleButton}>#{order.orderId}</span></div>
                        </div>
                        <span className="text-[#DB4444] hover:text-[#A33737] cursor-pointer" onClick={handleButton}>MORE DETAILS</span>
                    </div>
                    <div className="border-b-[1.5px]" />
                    {order?.products.map((product, index) => (
                        <div key={index} className="order-item w-[880px] mx-auto py-[14px] flex">
                            <div className="item w-[400px] h-[100px] flex gap-[15px]">
                                <div className="img w-[80px] h-[80px] items-center justify-center flex">
                                    <img src={product.image} alt="product-image" />
                                </div>
                                <div className="desc">
                                    <div className="title h-[32px]">{product.name}</div>
                                    <div className="add-info text-[#bbb]">{product?.color ? `Color: ${product?.color}` : product?.size ? `Size: ${product?.size}` : ""}</div>
                                </div>
                            </div>
                            <div className="Quantity w-[180px]"><span className="text-[#757575]">Qty : </span>{product.quantity}</div>
                            <div className="status rounded-[100px] bg-[#ecf0f7] text-[14px] py-[4px] px-[12px] h-[32px] ">{order.orderStatus}</div>
                        </div>
                    ))}
                </div>
            </td>
        </>
    )
}

export default Cancel_ReturnOrderRow;
