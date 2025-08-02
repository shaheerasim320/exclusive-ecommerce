import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import EmailSentModal from '../components/modals/EmailSentModal';
import { useNavigate } from 'react-router-dom';
import { isValidPhoneNumber } from 'libphonenumber-js';
import api from '../api/axiosInstance';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); 

  
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phoneNumber: value
    });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email) => emailRegex.test(email);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  const isValidPassword = (password) => passwordRegex.test(password);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true); 

    const { fullName, email, password, phoneNumber, gender } = formData;

    if(fullName==""){
      setErrorMessage("Please enter a valid name.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("Password must have at least 1 uppercase, 1 lowercase, 1 number, and be at least 6 characters long.");
      setIsSubmitting(false);
      return;
    }

    if (!isValidPhoneNumber("+" + phoneNumber)) {
      setErrorMessage("Please enter a valid phone number.");
      setIsSubmitting(false);
      return;
    }

    if (gender === "") {
      setErrorMessage("Please select a valid gender.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/users/signup", formData);
      if (response?.status === 201) {
        setShowEmailSentModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleResendClick = async () => {
    try {
      const response = await api.post("/users/resend-token", { email: formData.email });
      if (response?.status == 200) {
        setShowEmailSentModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  }

  const handleCloseClick = () => {
    setShowEmailSentModal(false);
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {showEmailSentModal && <EmailSentModal name={formData.fullName} onResend={handleResendClick} onClose={handleCloseClick} />}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row min-h-[700px]">
          {/* Left Side - Shopping Cart Image */}
          <div className="lg:w-1/2">
            <img
              src="/images/dl.beatsnoop 1.png"
              alt="BeatSnoop Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Sign Up Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600 mb-4">Enter your details below</p>

              {/* Error Message */}
              {errorMessage && <div className="text-red-500 text-sm my-3">{errorMessage}</div>}

              <button
                onClick={() => window.location.href = "https://exclusive-ecommerce-backend.vercel.app/api/v1/users/google"}
                className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 mb-6 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Sign Up Form */}
              <div className="space-y-6">
                {/* Full Name Field */}
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent"
                    placeholder="Full Name"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent"
                    placeholder="Email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent pr-12"
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Phone Number Field */}
                <div className="relative">
                  <PhoneInput
                    country={'pk'}
                    value={formData.phoneNumber}
                    onChange={handlePhoneChange}
                    specialLabel=""
                    placeholder="Phone Number"
                    required
                    inputStyle={{ width: "100%" }}
                  />
                </div>

                {/* Gender Field */}
                <div>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent text-gray-600"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                {/* Create Account Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#DB4444] hover:bg-red-600 text-white"
                    }`}
                >
                  {isSubmitting ? "Creating..." : "Create Account"}
                </button>

              </div>

              {/* Sign In Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
