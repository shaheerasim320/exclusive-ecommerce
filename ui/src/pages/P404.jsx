import React from 'react'
import { Link } from 'react-router-dom'

const P404 = () => {
    return (
        <div>
            <div>
                {/* Breadcrumbs */}
                <div className="nav w-[1156px] h-[21px] my-[34px] mx-auto">
                    <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><span className="text-[14px]">404 Error</span>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Error */}
                <section className="error w-[829px]  mx-auto flex flex-col gap-[71px] my-[93px]">
                    <div className="header">
                        <h1 className="text-[110px] text-center">404 Not Found</h1>
                        <p className="text-center">Your visited page not found. You may go home page.</p>
                    </div>
                    <div className="btn flex">
                        <Link to="/" className="mx-auto"><button className="btn-1 rounded-sm w-[251px] max-w-[251px]">Back to home page</button></Link>
                    </div>
                </section>
                {/* Error Ends Here */}
            </div>

        </div>
    )
}

export default P404
