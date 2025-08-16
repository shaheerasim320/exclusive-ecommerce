import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';

const Contact = () => {
    const [state, handleSubmit] = useForm("mkgzeyla");

    if (state.succeeded) {
        return (
            <div className="w-full max-w-6xl mx-auto my-24 text-center md:mt-36 mt-48">
                <h2 className="text-2xl font-bold text-[#DB4444]">Thanks for your message!</h2>
                <p className="mt-4 text-gray-700">We'll get back to you within 24 hours.</p>
                <Link to="/" className="inline-block mt-8 bg-[#DB4444] text-white hover:bg-[#E07575] rounded-sm px-6 py-2">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 lg:px-0 md:mt-36 mt-48">
            {/* Breadcrumbs */}
            <div className="w-full max-w-6xl mx-auto my-8">
                <div className="text-sm text-[#605f5f]">
                    <Link to="/" className="hover:text-black">Home</Link>
                    <span className="mx-2">/</span>
                    <span className="text-black">Contact</span>
                </div>
            </div>

            {/* Contact Section */}
            <section className="w-full max-w-6xl mx-auto mb-24 flex flex-col lg:flex-row gap-8">
                {/* Contact Details */}
                <div className="w-full lg:w-[340px] shadow">
                    <div className="w-full px-6 py-10">
                        {/* Call */}
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#DB4444] flex items-center justify-center">
                                    <img src="/images/call.svg" alt="call" className="w-5" />
                                </div>
                                <h5 className="text-base font-medium">Call To Us</h5>
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p>We are available 24/7, 7 days a week.</p>
                                <p>Phone: +8801611112222</p>
                            </div>
                        </div>

                        <div className="border-t my-6" />

                        {/* Write */}
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#DB4444] flex items-center justify-center">
                                    <img src="/images/email.svg" alt="email" className="w-5" />
                                </div>
                                <h5 className="text-base font-medium">Write To Us</h5>
                            </div>
                            <div className="text-sm text-gray-700 space-y-3">
                                <p>Fill out our form and we will contact you within 24 hours.</p>
                                <p>Emails: customer@exclusive.com</p>
                                <p>Emails: support@exclusive.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:flex-1 shadow">
                    <div className="w-full px-6 py-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your Name *"
                                    name="name"
                                    className="flex-1 px-4 py-2 bg-[#F5F5F5] outline-none text-sm rounded-sm"
                                    required
                                />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Your Email *"
                                    name="email"
                                    className="flex-1 px-4 py-2 bg-[#F5F5F5] outline-none text-sm rounded-sm"
                                    required
                                />

                                <ValidationError 
                                    prefix="Email" 
                                    field="email"
                                    errors={state.errors}
                                    className="text-red-500 text-sm"
                                />
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Your Phone *"
                                    name="phone"
                                    className="flex-1 px-4 py-2 bg-[#F5F5F5] outline-none text-sm rounded-sm"
                                />
                            </div>
                            <textarea
                                id="message"
                                placeholder="Enter Your Message"
                                name="message"
                                className="w-full h-52 px-4 py-2 resize-none bg-[#F5F5F5] outline-none text-sm rounded-sm"
                                required
                            />
                            <ValidationError 
                                prefix="Message" 
                                field="message"
                                errors={state.errors}
                                className="text-red-500 text-sm"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={state.submitting}
                                    className={`text-white rounded-sm px-6 py-2 transition-colors duration-200 ${
                                        state.submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#DB4444] hover:bg-[#E07575]'
                                    }`}
                                >
                                    {state.submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
