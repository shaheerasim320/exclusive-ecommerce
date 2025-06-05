import React, { useEffect, useState } from 'react'
import EmailSentModal from '../components/modals/EmailSentModal';
import ErrorModal from '../components/modals/ErrorModal';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { resendToken } from '../slices/userSlice';

const ResendLink = () => {
    const dispatch = useDispatch()
    const { sucess, error, loading } = useSelector((state) => state.user)
    const [showErrorModal,setShowErrorModal] = useState(false)
    const [showEmailModal,setShowEmailModal] = useState(false)
    const [showLoader,setShowLoader] = useState(false)
    const [formData, setFormData] = useState({
        email: ""
    })
    const [errors, setErrors] = useState({
        email: ""
    })
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const handleClick = () =>{
        if(errors.email==""){
            dispatch(resendToken(formData.email))
        }
    }
    const handleErrorClose = () =>{
        setShowErrorModal(false)
        setFormData({email:""})
    }
    const handleSucessModalClose = () =>{
        setShowEmailModal(false)
        setFormData({email:""})
    }
    const handleResendMail = () =>{
            dispatch(resendToken(formData.email))
        }
    useEffect(()=>{
        if(error!=null){
            setShowErrorModal(true)
        }
    },[error])
    useEffect(()=>{
        if(sucess==true){
            setShowEmailModal(true)
        }
    },[sucess])
    useEffect(()=>{
            if(loading==true){
                setShowLoader(true)
                setShowEmailModal(false)
                setShowErrorModal(false)
            }if(loading==false){
                setShowLoader(false)
                if(sucess==true){
                    setShowEmailModal(true)
                }
            }
        },[loading])
    return (
        <div className="min-h-[320px]">
            {showErrorModal && <ErrorModal message={error} btnMessage={"Retry"} onClose={()=>handleErrorClose()}/>}
            {showLoader && <Loader />}
            {showEmailModal &&<EmailSentModal name={"user"} onClose={()=>handleSucessModalClose()} onResend={()=>handleResendMail()}/>}
            <div className={`w-[1150px] mt-[16px] mb-[115px] ${showErrorModal || loading?"hidden":"flex"} gap-[129px]`}>
                <div className="image w-[805px] h-[446px] bg-[#CBE4E8]">
                    <img src="/images/dl.beatsnoop 1.png" alt="image" className="mt-[75px]" />
                </div>
                <div className="form w-[371px] h-[326px] my-[183px] flex flex-col gap-[48px]">
                    <div className="heading-content h-[78px]">
                        <h2 className="text-[32px] font-semibold">Request New Link</h2>
                        <p className="text-[16px]">Enter your details below</p>
                    </div>
                    <div className="form-content h-[104px] flex flex-col gap-[40px]">
                        <div className="fields h-[176px] flex flex-col gap-[46px]">
                            <div className="flex flex-col h-[24px]">
                                <input type="email" placeholder="Email" className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onBlur={() => setErrors({ ...errors, email: (formData.email === "" ? "Empty Field" : !validateEmail(formData.email) ? "Invalid Email Address" : "") })} onFocus={() => setErrors({ ...errors, email: "" })} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.email == "" ? "hidden" : "relative"}`} title={errors.email}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                        </div>
                        <div className="buttons  flex justify-center">
                            <button className="bg-[#DB4444] hover:bg-[#E07575] text-white rounded-sm py-[11px] px-[16px]" onClick={()=>handleClick()}>Get New Link</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResendLink
