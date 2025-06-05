import React from 'react'

const SizeComponent = ({size,isSelected,onClick}) => {
    return (
        <div onClick={onClick}>
            <div className={`size-box w-[32px] h-[32px] rounded-sm flex items-center justify-center cursor-pointer border-[1.5px] ${isSelected?'border-[#DB4444] bg-[#DB4444]':'border-black'}  border-opacity-30 group hover:bg-[#DB4444] hover:border-[#DB4444]`}>
                <h6 className={`text-box text-[14px] ${isSelected?'text-white':'text-black'} group-hover:${isSelected?'':'invert'} select-none`}>{size}</h6>
            </div>
        </div>
    )
}

export default SizeComponent
