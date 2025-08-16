import React from 'react'
import { Link } from 'react-router-dom'

const P404 = () => {
    return (
        <div className='md:mt-28 mt-40'>
            <div>
                {/* Breadcrumbs - Made responsive with fluid width, padding, and adjusted text sizes */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1156px] mx-auto py-4 md:py-6">
                    <Link to="/" className="text-[#605f5f] text-sm md:text-base hover:text-black">Home</Link>
                    <span className="mx-2 text-sm md:text-base text-[#605f5f]">/</span>
                    <span className="text-sm md:text-base">404 Error</span>
                </div>
                {/* Breadcrumbs Ends Here*/}

                {/* Error Section - Made responsive with fluid width, dynamic gaps, and centered content */}
                <section className="error w-full max-w-2xl mx-auto flex flex-col gap-10 md:gap-16 my-16 md:my-24 px-4">
                    <div className="header">
                        {/* Heading - Adjusted font size for responsiveness */}
                        <h1 className="text-6xl md:text-8xl lg:text-[110px] text-center font-semibold">404 Not Found</h1>
                        {/* Paragraph - Adjusted text alignment and padding */}
                        <p className="text-center text-base md:text-lg mt-4">Your visited page not found. You may go home page.</p>
                    </div>
                    {/* Button - Centered and made full width on small screens, then fixed width on larger screens */}
                    <div className="btn flex justify-center mx-auto">
                        <Link to="/" className="w-full sm:w-auto">
                            <button className="btn-1 bg-[#DB4444] text-white py-3 px-8 rounded-sm text-base font-semibold hover:bg-[#E07575] transition-colors duration-200 w-full sm:w-[251px] max-w-[251px] mx-auto">
                                Back to home page
                            </button>
                        </Link>
                    </div>
                </section>
                {/* Error Ends Here */}
            </div>
        </div>
    )
}

export default P404
