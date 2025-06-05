import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className='font-inter'>
            <footer className="bg-black text-white h-max py-4">
                {/* Main Footer Starts Here */}
                <div className="main-footer w-[73rem] h-max grid grid-cols-5 m-auto gap-5">
                    {/* Col-1 Starts Here  */}
                    <div className="col-1">
                        <div className="heading my-3">
                            <p className=" text-2xl font-bold">Exclusive</p>
                        </div>
                        <ul>
                            <li className="text-[20px]">Subscribe</li>
                            <li className="my-3">Get 10% off your order</li>
                            <li>
                                <div className="emailSubscribe  bg-black  flex items-center border-2 border-white rounded-sm text-white py-2 w-max px-2">
                                    <input type="email" name="subscribeEmail" autoComplete="off" id="email" placeholder="Enter Your Email" className="bg-black  border-0 focus:outline-none focus:border-0 w-44" />
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 16 16" className="text-color-primary w-6 h-6 text-lg cursor-pointer max-2xl:w-5 max-2xl:h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.91L1.78 1.5L15 7.44899V8.3999L1.78 14.33L1 13.91L2.58311 8L1 1.91ZM3.6118 8.5L2.33037 13.1295L13.5 7.8999L2.33037 2.83859L3.6118 7.43874L9 7.5V8.5H3.6118Z" /></svg>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Col-1 End Here  */}
                    {/* Col-2 Starts Here  */}
                    <div className="col-2">
                        <div className="heading my-3">
                            <p className="text-[20px]">Support</p>
                        </div>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="https://www.google.com/maps/search/?api=1&query=111+Bijoy+Sarani,+Dhaka,+DH+1515,+Bangladesh" className="text-[16px] hover:text-[#c1c0bf]">111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh</Link></li>
                            <li><Link to="mailto:exclusive@gmail.com" className="hover:text-[#c1c0bf]">exclusive@gmail.com</Link></li>
                            <li><Link to="tel:+88015-88888-9999" className="hover:text-[#c1c0bf]">+88015-88888-9999</Link></li>
                        </ul>
                    </div>
                    {/* Col-2 Ends Here  */}
                    {/* Col-3 Starts Here  */}
                    <div className="col-3">
                        <div className="heading my-3">
                            <p className="text-[20px]">Account</p>
                        </div>
                        <ul className="flex flex-col gap-2">
                            <li><Link to="/manage-my-account" className="hover:text-[#c1c0bf]">My Account</Link></li>
                            <li><Link to="/signup" className="hover:text-[#c1c0bf]">Login/Register</Link></li>
                            <li><Link to="/cart" className="hover:text-[#c1c0bf]">Cart</Link></li>
                            <li><Link to="/wishlist" className="hover:text-[#c1c0bf]">Wishlist</Link></li>
                            <li><Link to="/" className="hover:text-[#c1c0bf]">Shop</Link></li>
                        </ul>
                    </div>
                    {/* Col-3 Ends Here  */}
                    {/* Col-4 Starts Here  */}
                    <div className="col-4 ">
                        <div className="heading my-3">
                            <p className="text-[20px]">Quick Link</p>
                        </div>
                        <ul className="flex flex-col gap-2">
                            <li><Link to="/privacy-policy" className="hover:text-[#c1c0bf]">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-use" className="hover:text-[#c1c0bf]">Terms Of Use</Link></li>
                            <li><Link to="/faq" className="hover:text-[#c1c0bf]">FAQ</Link></li>
                            <li><Link to="/contact" className="hover:text-[#c1c0bf]">Contact</Link></li>
                        </ul>
                    </div>
                    {/* Col-4 Ends Here  */}
                    {/* Col-5 Starts Here  */}
                    <div className="col-5">
                        <div className="heading my-3">
                            <p className="text-[20px]">Download App</p>
                        </div>
                        <ul className="flex flex-col gap-3">
                            <li className=" text-[13px]">Save $3 with App New User Only</li>
                            <li className="">
                                <div className="grid grid-cols-2 w-48">
                                    <div className="">
                                        <img src="/images/Qr Code.png" alt="qrcode" className=""/>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <img src="/images/google-store-badge.png" alt="google-store-badge" className="" />
                                        <img src="/images/apple-store-badge.png" alt="apple-store-badge" className=" border-[1px] border-[#9A9A9A] rounded-md w-[6.5rem] " />
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="social-icons flex items-center gap-9 ">
                                    <a href="https://www.facebook.com/exclusive" target="_blank" rel="noopener noreferrer">
                                        <img src="/images/facebook.svg" alt="Facebook" className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.x.com/exclusive" target="_blank" rel="noopener noreferrer">
                                        <img src="/images/x.svg" alt="X" className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.instagram.com/exclusive" target="_blank" rel="noopener noreferrer">
                                        <img src="/images/insta.svg" alt="Instagram" className="w-5 h-5" />
                                    </a>
                                    <a href="https://www.linkedin.com/exclusive" target="_blank" rel="noopener noreferrer">
                                        <img src="/images/Icon-Linkedin.svg" alt="Linkedin" className="w-5 h-5" />
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    {/* Col-5 Ends Here  */}
                </div>
                {/* Main Footer Ends Here */}
                {/* Sub Footer Starts Here */}
                <div className="sub-footer flex flex-col mt-9 gap-5">
                    <div className="border-t " />
                    <p className="text-[16px] text-center text-[#2e2e2e]">© Copyright Exclusive 2024. All rights reserved.</p>
                </div>
                {/* Sub Footer Ends Here */}
            </footer>
        </div>
    )
}

export default Footer
