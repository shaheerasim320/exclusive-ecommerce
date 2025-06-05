import React, { useEffect, useState } from 'react'
import EmailConfirmModal from '../components/modals/EmailConfirmModal'
import ErrorModal from '../components/modals/ErrorModal'
import Loader from '../components/Loader'
import axios from 'axios'
import { verifyUser, resetError } from '../slices/userSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const token  = searchParams.get("token")
  const { sucess, error, loading } = useSelector((state) => state.user)
  const [showErrorModal,setShowErrorModal] = useState(false)
  const [showEmailConfirmModal,setShowEmailConfirmModal] = useState(false)
  useEffect(()=>{
    dispatch(verifyUser(token))
  },[token])
  const handleClose = () =>{
    setShowErrorModal(false)
    
    dispatch(resetError())
    navigate("/resend-link")
  }
  useEffect(()=>{
    if(error!=null){
      setShowErrorModal(true)
    }
  },[error])
  useEffect(()=>{
    if(sucess==true){
      setShowEmailConfirmModal(true)
    }
  },[sucess])
  const handleLoginPageClick = () =>{
    setShowEmailConfirmModal(false)
    dispatch(resetError())
    dispatch(resetSucess())
    navigate("/login")
  }
  return (
    <div className='min-h-[400px]'>
      {showEmailConfirmModal && <EmailConfirmModal onClick={()=>handleLoginPageClick()}/>}
      {showErrorModal&& <ErrorModal message={error} btnMessage={"Resend Verification Email"} onClose={()=>handleClose()}/>}
      {loading?<Loader/>:""}
    </div>
  )
}

export default VerifyEmail
