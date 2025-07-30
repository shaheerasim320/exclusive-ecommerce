import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); // Track if the token is present
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [token, setToken] = useState('');
  const [isReset, setIsReset] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for token and flow type (reset or create) in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    const reset = params.get('reset');
    const create = params.get('create');
    
    if ((reset === 'true' || create === 'true') && !tokenFromUrl) {
      // If both reset and create are true, but no token is provided, redirect to /p404
      navigate('/p404');
    } else {
      if (tokenFromUrl) {
        setToken(tokenFromUrl);
        setShowPasswordFields(true); // Token present, show password reset fields
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

  // Handle the email submission for password reset
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/users/password-reset', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  // Handle the password reset form submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/v1/users/reset-password', { token, password: formData.password });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setMessage('');
    }
  };

  // Handle input changes for both email and password form
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                    <input
                      type="email"
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
              {showPasswordFields && (
                <>
                  {/* Password Field */}
                  <div className="relative mb-4">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent pr-12"
                      placeholder="Password"
                      required
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative mb-4">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-[#DB4444] focus:outline-none transition-colors bg-transparent pr-12"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>

                  <button
                    onClick={handlePasswordSubmit}
                    className="w-full bg-[#DB4444] text-white py-3 px-4 rounded-xl font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200"
                  >
                    {isReset ? 'Reset Password' : 'Create Password'}
                  </button>
                </>
              )}

              {/* Error or Success Message */}
              {message && <div className="text-green-500">{message}</div>}
              {error && <div className="text-red-500">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
