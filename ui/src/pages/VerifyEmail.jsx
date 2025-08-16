import React, { useEffect, useState } from 'react'
import EmailConfirmModal from '../components/modals/EmailConfirmModal'
import ErrorModal from '../components/modals/ErrorModal'
import Loader from '../components/Loader'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/axiosInstance'


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token")
  const [showLoader, setShowLoader] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [error, setError] = useState("")
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false)

  useEffect(() => {
    const verify = async () => {
      try {
        setShowLoader(true);
        const response = await api.post(`/users/verify/${token}`);
        if (response?.status == 200) {
          setShowEmailConfirmModal(true);
        }
      } catch (err) {
       setError(err?.response?.data?.message || "An error occurred. Please try again.");
      }finally{
        setShowLoader(false);
      }
    };
    if (token) {
      verify();
    } else {
      navigate("/p404")
    }
  }, [token]);


  const handleClose = () => {
    setShowErrorModal(false)
    navigate("/resend-link", { state: { fromVerificationFail: true } });
  }

  const handleLoginPageClick = () => {
    setShowEmailConfirmModal(false)
    navigate("/login")
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:mt-28 mt-40">
      {showEmailConfirmModal && <EmailConfirmModal onClick={handleLoginPageClick} />}
      {error!="" && (
        <ErrorModal
          message={error}
          btnMessage="Resend Verification Email"
          onClose={handleClose}
        />
      )}
      {showLoader && <div className="flex justify-center"><Loader /></div>}
    </div>
  );

}

export default VerifyEmail
