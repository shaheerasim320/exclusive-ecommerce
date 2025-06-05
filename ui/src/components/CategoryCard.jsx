import { Icon } from '@iconify/react'
import React from 'react'

const CategoryCard = ({category}) => {
    return (
        <div>
            <div className="w-44 h-36 flex items-center justify-center hover:bg-[#DB4444] hover:text-white group cursor-pointer">
                <div className="main-content flex flex-col items-center">
                    <div className="image">
                    <Icon icon={category.icon} className="w-14 h-14"/>
                    </div>
                    <div className="text">
                        <p className="inline-block text-[16px] text-center">{category.name}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CategoryCard
