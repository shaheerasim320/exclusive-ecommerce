import React from 'react'

const SizeComponent = ({ size, isSelected, onClick }) => {
    return (
        <div onClick={onClick}>
            {/* Adjusted width, height, and font size for responsiveness */}
            <div className={`size-box w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center cursor-pointer border-[1.5px] 
            ${isSelected ? 'border-[#DB4444] bg-[#DB4444]' : 'border-black'} 
            border-opacity-30 group hover:bg-[#DB4444] hover:border-[#DB4444] transition-all duration-200`}>
                <h6 className={`text-sm md:text-base ${isSelected ? 'text-white' : 'text-black'} group-hover:${isSelected ? '' : 'invert'} select-none`}>{size}</h6>
            </div>
        </div>
    );
}

export default SizeComponent
