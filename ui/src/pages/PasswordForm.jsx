import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '../api/axiosInstance';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [token, setToken] = useState('');
    const [isReset, setIsReset] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordMismatchError, setPasswordMismatchError] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        const reset = params.get('reset');
        const create = params.get('create');

        if ((reset === 'true' || create === 'true') && !tokenFromUrl) {
            navigate('/p404');
        } else {
            if (tokenFromUrl) {
                setToken(tokenFromUrl);
                setShowPasswordFields(true);
            }
            if (reset === 'true') {
                setIsReset(true);
                setIsCreate(false);
            } else if (create === 'true') {
                setIsCreate(true);
                setIsReset(false);
            }
        }
    }, [location, navigate]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/users/password-reset', { email });
            setMessage(response.data.message);
            setError("");
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again');
            setMessage("");
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMismatchError(''); // Clear any previous errors

        if (formData.password !== formData.confirmPassword) {
            setPasswordMismatchError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/users/reset-password', { token, password: formData.password });
            setMessage(response.data.message);
            setError("");
            setFormData({ password: '', confirmPassword: '' });
            setShowPasswordFields(false);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
            setMessage("");
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-7xl w-full">
                <div className="flex flex-col lg:flex-row min-h-[600px]">
                    <div className="lg:w-1/2 ">
                        <img
                            src="/images/dl.beatsnoop 1.png"
                            alt="BeatSnoop Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right Side - Conditional Form */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                                {isReset ? 'Reset Password' : isCreate ? 'Create Password' : 'Forgot Password?'}
                            </h1>
                            <p className="text-gray-600 mb-8 text-center">
                                {isReset ? 'Enter your new password to reset your account.' : isCreate ? 'Create a new password to finish your account setup.' : 'Enter your email to receive a password reset link.'}
                            </p>

                            {/* Email Form (if no token) */}
                            {!showPasswordFields && !isReset && !isCreate && (
                                <>
                                    <div className="relative mb-4">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent pr-12"
                                            placeholder="Email"
                                            required
                                        />
                                    </div>
                                    <button
                                        onClick={handleEmailSubmit}
                                        className="w-full bg-[#DB4444] text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200"
                                    >
                                        Send Reset Link
                                    </button>
                                </>
                            )}

                            {/* Password Form (if token is present) */}
                            {showPasswordFields && !message && (
                                <>
                                    {/* Password Field */}
                                    <div className="relative mb-4">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent pr-12"
                                            placeholder="Password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="relative mb-4">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent pr-12"
                                            placeholder="Confirm Password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    {passwordMismatchError && (
                                        <div className="text-red-500 text-center mb-4">{passwordMismatchError}</div>
                                    )}
                                    <button
                                        onClick={handlePasswordSubmit}
                                        className="w-full bg-[#DB4444] text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200"
                                    >
                                        {isReset ? 'Reset Password' : 'Create Password'}
                                    </button>
                                </>
                            )}

                            {/* Error or Success Message */}
                            {message && (
                                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-sm mx-auto my-10 animate-fade-in-up">
                                    {/* Success message */}
                                    <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <div className="text-center">
                                        <h2 className="text-2xl font-semibold text-gray-800">Success!</h2>
                                        <p className="text-gray-600 mt-2">{message}</p>
                                    </div>

                                    {/* Call-to-action buttons */}
                                    <div className="mt-6 w-full space-y-4">
                                        {/* Continue to Shop button */}
                                        <button
                                            onClick={() => navigate('/')}
                                            className="w-full bg-[#DB4444] text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200"
                                        >
                                            Continue To Shop
                                        </button>
                                        {/* Continue to Login button */}
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200"
                                        >
                                            Continue to Login
                                        </button>
                                    </div>
                                </div>
                            )}
                            {error && <div className="text-red-500">{error}</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
