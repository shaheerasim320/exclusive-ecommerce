import React from 'react';

const NewsletterSuccessModal = ({ onClose }) => {
  return (
    <div>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

      {/* Modal */}
      <div className="z-50 fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-sm sm:max-w-md md:max-w-[500px] mx-auto shadow-lg transform transition-all duration-300 ease-in-out scale-95 sm:scale-100" style={{ opacity: 1, transform: 'scale(1)' }}>
          
          {/* Icon */}
          <div className="flex justify-center mt-6 mb-4 sm:mb-6">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px] rounded-full bg-green-100 flex items-center justify-center">
              <img
                src="/images/tick-icon.png" // Add this image to your public folder or adjust path
                alt="success-icon"
                className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] object-contain"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-6 pb-6 text-center">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">
              You're Subscribed!
            </h2>
            <p className="text-sm sm:text-base mt-2 max-w-[90%] md:max-w-[420px] leading-relaxed text-gray-700">
              Thanks for subscribing to our newsletter. You’ll now be the first to know about our latest products, exclusive deals, and exciting news!
            </p>

            {/* Button */}
            <button
              className="mt-6 bg-[#DB4444] hover:bg-[#E07575] text-white py-2.5 px-8 rounded-full text-base font-semibold transition-all duration-200 w-full sm:w-auto max-w-[280px]"
              onClick={onClose}
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default NewsletterSuccessModal;
