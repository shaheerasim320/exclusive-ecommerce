import React, { useState } from 'react';

const EmailSentModal = ({ name, onClose, onResend }) => {
  const [isResending, setIsResending] = useState(false);

  const handleCloseModal = () => {
    onClose();
  };

  const handleResendMail = async () => {
    if (isResending) return; // Prevent multiple clicks while resending
    setIsResending(true);
    try {
      await onResend();
      // Optionally show a success message here for resend
    } catch (error) {
      console.error("Resend failed:", error);
      // Optionally show an error message here
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

      <div className="z-50 fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md md:max-w-[550px] mx-auto shadow-lg transform transition-all duration-300 ease-in-out scale-95 sm:scale-100 opacity-0 sm:opacity-100" style={{ opacity: 1, transform: 'scale(1)' }}>
          <div className="flex justify-center mt-4 mb-4 sm:mb-6">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-[#e8e6ff] flex items-center justify-center flex-shrink-0">
              <img src="/images/email-icon.png" alt="email-icon" className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px] object-contain rounded-full" />
            </div>
          </div>

          <div className="flex flex-col items-center px-6 pb-6 text-center">
            <h2 className="text-xl md:text-2xl font-semibold mt-4 leading-tight">Check your inbox, please!</h2>
            <p className="text-sm sm:text-base mt-2 max-w-[90%] md:max-w-[440px] leading-relaxed text-gray-700">
              Hey {name}, to start using Exclusive, we need to verify your email.
              We've already sent out the verification link. Please check it and confirm it's really you.
            </p>

            <button className="mt-6 bg-[#DB4444] hover:bg-[#E07575] text-white py-2.5 px-8 rounded-full text-base font-semibold transition-all duration-200 w-full sm:w-auto max-w-[280px]" onClick={handleCloseModal}>
              Sure
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 mt-4 text-sm md:text-base"> {/* Adjusted gap and text size */}
              <span>Didn't get the email?</span>
              <span className={`text-[#DB4444] hover:text-[#E07575] cursor-pointer font-medium ${isResending ? 'opacity-50 pointer-events-none' : ''} px-2 py-1 rounded-sm`} onClick={handleResendMail}>
                {isResending ? 'Resending...' : 'Resend Verification Email'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSentModal;