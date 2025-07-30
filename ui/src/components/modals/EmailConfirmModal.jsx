import React from 'react';

const EmailConfirmModal = ({ onClick, account = false }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"> 
        <div className="bg-white rounded-lg w-full max-w-[520px] mx-auto py-8 px-6 sm:px-8 shadow-lg transform transition-all duration-300 ease-in-out scale-95 sm:scale-100 opacity-0 sm:opacity-100" style={{ opacity: 1, transform: 'scale(1)' }}>
          <div className="flex justify-center mt-2 mb-4">
            <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] bg-[#e8e6ff] rounded-full flex items-center justify-center flex-shrink-0">
              <img src="/images/tick-icon.png" alt="tick-icon" className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[120px] md:h-[120px] object-contain rounded-full"/>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">Email is Verified!</h2>
            <p className="text-sm md:text-base max-w-[400px] leading-relaxed text-gray-700">
              Your {account ? 'account' : 'email'} has successfully verified.
              You can now go back to the login page to access Exclusive.
            </p>
            <button
              onClick={handleClick}
              className="mt-4 bg-[#DB4444] hover:bg-[#E07575] text-white py-2.5 px-8 rounded-full text-base font-semibold transition-colors duration-200 w-full sm:w-auto max-w-[280px]">
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmModal;