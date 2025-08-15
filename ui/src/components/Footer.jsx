import React, { useState } from 'react';
import { Send, Facebook, Twitter, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import NewsletterSuccessModal from './modals/NewsletterSuccessModal';

const Footer = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();

        if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post("/users/subscribe-newsletter", {
                email: trimmedEmail
            });
            setIsModalOpen(true);
            setEmail('');
        } catch (error) {
            toast.error("Subscription failed")
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='font-inter'>
            <footer className="bg-black text-white py-8 md:py-12">
                {/* Main Footer */}
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

                        {/* Column 1 - Subscribe */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-1">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-4">Exclusive</h3>
                                <h4 className="text-xl mb-4">Subscribe</h4>
                                <p className="mb-4 text-gray-300">Get 10% off your order</p>

                                <div className="">
                                    <div className="flex items-center border-2 border-white rounded-sm bg-black w-full overflow-hidden">
                                        <input
                                            type="email"
                                            value={email}
                                            id='subscribEmail'
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter Your Email"
                                            className="bg-transparent border-0 outline-none flex-1 py-2 px-3 text-white placeholder-gray-400 w-[70%]"
                                        />
                                        <button
                                            disabled={!isValidEmail(email) || loading}
                                            onClick={handleEmailSubmit}
                                            className={`h-full px-3 py-2 flex items-center justify-center rounded-r-sm transition-colors ${(!isValidEmail(email) || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                                }`}
                                        >
                                            {loading ? (
                                                <span className="text-white text-xs whitespace-nowrap">Sending...</span>
                                            ) : (
                                                <Send size={20} className="text-white" />
                                            )}
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Column 2 - Support */}
                        <div className="col-span-1">
                            <div className="mb-6">
                                <h4 className="text-xl mb-4">Support</h4>
                                <ul className="space-y-3">
                                    <li>
                                        <a
                                            href="https://www.google.com/maps/search/?api=1&query=111+Bijoy+Sarani,+Dhaka,+DH+1515,+Bangladesh"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 hover:text-white transition-colors flex items-start gap-2"
                                        >
                                            <MapPin size={16} className="mt-1 flex-shrink-0" />
                                            <span className="text-sm md:text-base">111 Bijoy Sarani, Dhaka, DH 1515, Bangladesh</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="mailto:exclusive@gmail.com"
                                            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Mail size={16} />
                                            <span>exclusive@gmail.com</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="tel:+88015-88888-9999"
                                            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Phone size={16} />
                                            <span>+88015-88888-9999</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 3 - Account */}
                        <div className="col-span-1">
                            <div className="mb-6">
                                <h4 className="text-xl mb-4">Account</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link to="/manage-my-account" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            My Account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/login" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Login/Register
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/cart" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/wishlist" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Wishlist
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Shop
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 4 - Quick Links */}
                        <div className="col-span-1">
                            <div className="mb-6">
                                <h4 className="text-xl mb-4">Quick Link</h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/terms-of-use" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Terms Of Use
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/faq" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            FAQ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contact" className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                            Contact
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Column 5 - Download App */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-1">
                            <div className="mb-6">
                                <h4 className="text-xl mb-4">Download App</h4>
                                <p className="text-sm text-gray-300 mb-4">Save $3 with App New User Only</p>

                                {/* QR Code and App Store Badges */}
                                <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4 mb-6">
                                    <div className="flex gap-4 items-center">
                                        {/* QR Code Placeholder */}
                                        <div className="w-20 h-20  flex items-center justify-center">
                                            <img src="/images/Qr Code.png" alt="qr-code" className="object-cover" />
                                        </div>

                                        {/* App Store Badges */}
                                        <div className="flex flex-col gap-2">
                                            <img src="/images/google-store-badge.png" alt="google-badge" className='w-32 h-14 object-cover' />
                                            <img src="/images/apple-store-badge.png" alt="apple-badge" className='w-32 h-10 object-cover border-[0.1px] border-[#A4A3A3] rounded-md' />
                                        </div>
                                    </div>
                                </div>

                                {/* Social Media Icons */}
                                <div className="flex items-center gap-6">
                                    <a
                                        href="https://www.facebook.com/exclusive"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                    <a
                                        href="https://www.x.com/exclusive"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Twitter size={20} />
                                    </a>
                                    <a
                                        href="https://www.instagram.com/exclusive"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Instagram size={20} />
                                    </a>
                                    <a
                                        href="https://www.linkedin.com/exclusive"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Footer */}
                <div className="border-t border-gray-800 mt-8 pt-6">
                    <div className="container mx-auto px-4">
                        <p className="text-center text-gray-500 text-sm md:text-base">
                            © Copyright Exclusive 2025. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
            {isModalOpen && (
                <NewsletterSuccessModal onClose={() => setIsModalOpen(false)} />
            )}
            <ToastContainer
                position="bottom-right" // Position of the toast message
                autoClose={3000} // Duration in milliseconds before toast disappears
                hideProgressBar={false} // Hide progress bar for simplicity
                closeOnClick={true} // Allow closing the toast by clicking
                pauseOnHover
            />
        </div>
    );
};

export default Footer;
