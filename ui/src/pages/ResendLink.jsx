import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmailSentModal from '../components/modals/EmailSentModal';
import ErrorModal from '../components/modals/ErrorModal';
import api from '../api/axiosInstance';

export default function ResendVerificationLink() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.fromVerificationFail) {
      navigate("/p404");
    }
  }, [location.state, navigate]);


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = (email) => emailRegex.test(email);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.post("/users/resend-token", { email });
      if (response?.status == 200) {
        setName(response.data.name);
        setShowEmailSentModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendClick = async () => {
    try {
      const response = await api.post("/users/resend-token", { email });
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

  const handleErrorModalClose = () => {
    if (error == "Your email is already verified. Please log in instead.") {
      setError("")
      navigate("/login")
    } else {
      setError("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 md:mt-28 mt-40">
      {showEmailSentModal && <EmailSentModal name={name} onClose={handleCloseClick} onResend={handleResendClick} />}
      {error != "" && error != "Please enter a valid email address." && <ErrorModal message={error} btnMessage={error == "Your email is already verified. Please log in instead." ? "Log in" : "Retry"} onClose={handleErrorModalClose} />}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          <div className="lg:w-1/2 ">
            <img
              src="/images/dl.beatsnoop 1.png"
              alt="BeatSnoop Logo"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Resend Verification Link Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Resend Verification Link</h1>
              <p className="text-gray-600 mb-8 text-center">
                Enter your email to receive a new verification link.
              </p>
              {/* Error Message */}
              {error != "Your email is already verified. Please log in instead." && <div className="text-red-500 text-sm my-3">{error}</div>}
              {/* Email Form */}
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
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#DB4444] hover:bg-red-600 text-white'
                  }`}
              >
                {isSubmitting ? "Sending..." : "Send Verification Link"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
