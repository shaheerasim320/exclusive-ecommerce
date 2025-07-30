import React from 'react';

const ErrorModal = ({ onClose, message, btnMessage = null }) => {
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-8">
        <div className="bg-white rounded-md shadow-md w-full max-w-sm py-4 px-6 sm:px-8">
          {/* Image */}
          <div className="flex justify-center mb-4">
            <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full bg-[#e8e6ff] flex items-center justify-center">
              <img
                src="/images/crying-icon.png"
                alt="crying-icon"
                className="w-[90px] h-[90px] md:w-[150px] md:h-[150px] object-contain rounded-full"
              />
            </div>
          </div>

          {/* Message */}
          <h2 className="text-center text-base md:text-lg font-semibold mb-4">
            {message}
          </h2>

          {/* Button */}
          <button
            onClick={handleCloseModal}
            className="w-full bg-[#DB4444] hover:bg-[#E07575] text-white py-2 rounded-md transition-colors duration-200"
          >
            {btnMessage || 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
