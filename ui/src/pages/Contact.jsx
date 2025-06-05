import React from 'react'

const Contact = () => {
    return (
        <div>
            <div>
                {/* Breadcrumbs */}
                <div className="nav w-[1156px] h-[21px] my-[34px] mx-auto">
                    <a href="../pages/homepage.html" className="text-[#605f5f] text-[14px] hover:text-black">Home</a><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><a href="#" className="text-[14px]">Contact</a>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Contact Section */}
                <section className="contact w-[1170px] h-[457px] mx-auto mb-[100px] mt-[63px] flex gap-[31px]">
                    {/* Contact Details */}
                    <div className="contact-details w-[340px] h-[457px] shadow">
                        <div className="inner-box w-[270px] h-[366px] my-[45px] mx-auto">
                            {/* Call */}
                            <div className="call flex flex-col gap-[21px]">
                                <div className="header flex items-center gap-[15px]">
                                    {/* Icon */}
                                    <div className="icon w-[40px] h-[40px] rounded-full bg-[#DB4444]">
                                        <img src="/images/call.svg" alt="call" className="mx-auto py-[8px]" />
                                    </div>
                                    {/* Icon Ends */}
                                    {/* Title */}
                                    <div className="title">
                                        <h5 className="text-[16px]">Call To Us</h5>
                                    </div>
                                    {/* Title Ends */}
                                </div>
                                {/* Info  */}
                                <div className="info flex flex-col gap-[7px]">
                                    <p className="text-[14px]">We are available 24/7, 7 days a week.</p>
                                    <p className="text-[14px]">Phone: +8801611112222</p>
                                </div>
                                {/* Info Ends*/}
                            </div>
                            {/* Call Ends */}
                            {/* Separation */}
                            <div className="border-t my-[21px]" />
                            {/* Separation Ends */}
                            {/* Write */}
                            <div className="write flex flex-col gap-[21px]">
                                <div className="header flex items-center gap-[15px]">
                                    {/* Icon */}
                                    <div className="icon w-[40px] h-[40px] rounded-full bg-[#DB4444]">
                                        <img src="/images/email.svg" alt="email" className="mx-auto py-[12px]" />
                                    </div>
                                    {/* Icon Ends */}
                                    {/* Title */}
                                    <div className="title">
                                        <h5 className="text-[16px]">Write To Us</h5>
                                    </div>
                                    {/* Title Ends */}
                                </div>
                                {/* Info  */}
                                <div className="info flex flex-col gap-[16px]">
                                    <p className="text-[14px]">Fill out our form and we will contact you within 24 hours.</p>
                                    <p className="text-[14px]">Emails: customer@exclusive.com</p>
                                    <p className="text-[14px]">Emails: support@exclusive.com</p>
                                </div>
                                {/* Info Ends*/}
                            </div>
                            {/* Write Ends */}
                        </div>
                        {/* Inner Box Ends */}
                    </div>
                    {/* Contact Details Ends Here */}
                    {/* Message */}
                    <div className="message w-[800px] h-[457px] shadow">
                        <div className="inner-message-box w-[737px] h-[377px] my-[40px] mx-auto flex flex-col gap-[32px]">
                            {/* Personal Details */}
                            <div className="personal-details w-[737px] h-[50px] flex gap-[16px]">
                                <input type="name" placeholder="Your Name *" className="w-[235px] bg-[#F5F5F5] px-[9px]" />
                                <input type="email" placeholder="Your Email *" className="w-[235px] bg-[#F5F5F5] px-[9px]" />
                                <input type="phone" placeholder="Your Phone *" className="w-[235px]  bg-[#F5F5F5] px-[9px]" />
                            </div>
                            {/* Personal Details End*/}
                            {/* Message Box */}
                            <div className="message-box w-[737px] h-[207px]">
                                <textarea name="message-box" id="message-box" placeholder="Enter Your Message" className="bg-[#F5F5F5] resize-none w-[737px] h-[207px] py-[3px] px-[6px]" defaultValue={""} />
                            </div>
                            {/* Message Box End */}
                            {/* Button */}
                            <div className="btn flex justify-end">
                                <button className="btn-1 mx-0">Send Message</button>
                            </div>
                            {/* Button Ends Here */}
                        </div>
                    </div>
                    {/* Message Details End Here */}
                </section>
                {/* Contact Section Ends Here */}
            </div>

        </div>
    )
}

export default Contact
