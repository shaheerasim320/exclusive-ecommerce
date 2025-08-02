import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, setAccessToken } from '../slices/authSlice';
import { fetchWishlist } from '../slices/wishlistSlice';
import { fetchCart } from '../slices/cartSlice';
import MergeModal from '../components/modals/MergeModal';
import { useLocation, useNavigate } from "react-router-dom";
import { getWithExpiry } from '../utils/expiringLocalStorage';
import api from '../api/axiosInstance';


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist)
  const { items: cartItems } = useSelector((state) => state.cart)
  const dispatch = useDispatch();
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email) => emailRegex.test(email);

  // Handle form submit to perform login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = formData;
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      const result = await dispatch(login(formData)).unwrap();

      if (login.fulfilled.match(result)) {
        setErrorMessage("");
        dispatch(setAccessToken(result.payload.accessToken));

        // Fetch guest wishlist and cart and use their returned values
        const guestWishlist = await dispatch(fetchWishlist()).unwrap();
        const guestCart = await dispatch(fetchCart()).unwrap();
        const shouldShowModal = guestWishlist.length > 0 || guestCart.length > 0;

        setShowMergeModal(shouldShowModal);
        if (!shouldShowModal) {
          performRedirect();
        }
      } else {
        setErrorMessage(result.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }

  };
  const performRedirect = async () => {
    const redirectIntent = getWithExpiry("postAuthRedirect"); 

    if (redirectIntent && redirectIntent.type == "buyNow") {
      localStorage.removeItem("postAuthRedirect");
      const item = {
        product: redirectIntent.product,
        quantity: redirectIntent.quantity,
      };
      if (redirectIntent.color) {
        item.color = redirectIntent.color;
      }
      if (redirectIntent.size) {
        item.size = redirectIntent.size;
      }

      try {
        const res = await api.post("/billing/create-billing-record", {
          items: [item]
        });

        if (res.data && res.data.billingId) {
          const billingPublicId = res.data.billingId;
          console.log("Billing record created with public ID:", billingPublicId);

          navigate(`/billing?billingID=${billingPublicId}`);

        }

      } catch (error) {
        console.error("Error creating billing record:", error);
      }
      return;
    }

    const redirectURL = location.state?.from || "/";
    navigate(redirectURL);
  };
  const handleOnClose = () => {
    setShowMergeModal(false);
    performRedirect();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {showMergeModal && <MergeModal onClose={handleOnClose} />}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 ">
            <img
              src="/images/dl.beatsnoop 1.png"
              alt="BeatSnoop Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
              <p className="text-gray-600 mb-4">Enter your credentials to access your account</p>

              {(errorMessage || error && error!="No refresh token") && (
                <div className="text-red-500 text-sm my-3">
                  {errorMessage || error}
                </div>
              )}

              <button
                onClick={() => window.location.href = "http://127.0.0.1:5001/exclusive-ecommerce-backend/us-central1/api/v1/users/google"}
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


              {/* Login Form */}
              <div className="space-y-6">
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="/password-form?forget-my-password" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full text-white py-3 px-4 rounded-xl font-medium transition-all duration-200
    ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#DB4444] hover:bg-red-600 focus:ring-red-500"}`}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
