import React, { useEffect,  useState } from 'react'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'react-phone-number-input';
import EmailSentModal from '../components/modals/EmailSentModal';
import { useDispatch, useSelector } from "react-redux";
import { registerUser, resendToken, resetSucess } from '../slices/userSlice';
import ErrorModal from '../components/modals/ErrorModal';
import Loader from "../components/Loader"

const SignUp = () => {
    const dispatch = useDispatch()
    const { sucess, error, loading,user } = useSelector((state) => state.user)
    const [isGenderDropDownSelected, setIsGenderDropDownSelected] = useState(false)
    const [isPhoneNumberFocused, setIsPhoneNumberFocused] = useState(false)
    const [showEmailSentModal, setShowEmailSentModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [allFieldsFilled, setAllFieldsFilled] = useState(true)
    const [showLoader, setShowLoader] = useState(false)

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: ""
    });

    const [errors, setErrors] = useState({
        fullName: "",
        email: "",
        password: "",
        phoneNumber: "",
        gender: ""
    });

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
        return passwordRegex.test(password)
    }

    const handleCreateAccount = (e) => {
        e.preventDefault();

        const areNoErrorsPresent = Object.values(errors).every(value => value == "");
        const areAllFieldsFilled = Object.values(formData).every(value => value != "");
        setAllFieldsFilled(areAllFieldsFilled)

        if (areNoErrorsPresent && areAllFieldsFilled) {
            dispatch(registerUser({ fullName: formData.fullName, email: formData.email, password: formData.password, phoneNumber: formData.phoneNumber, gender: formData.gender }))
        } else {
            setEmailModalName("")
        }

    }

    const handleGenderDropdown = () => {
        setIsGenderDropDownSelected(!isGenderDropDownSelected)
    }
    const setGender = (gender) => {
        setFormData({ ...formData, gender: gender })
        errors.gender != "" ? setErrors({ ...errors, gender: "" }) : ""
        handleGenderDropdown()
    }
    const handlePhoneNumberFocus = () => {
        setIsPhoneNumberFocused(true)
        setErrors({ ...errors, phoneNumber: "" })
    }

    const handlePhoneNumberBlur = () => {
        setIsPhoneNumberFocused(false)
        setErrors({ ...errors, phoneNumber: ((typeof (formData.phoneNumber) === "string" ? formData.phoneNumber == "" : formData.phoneNumber == undefined) ? "Empty Field" : !isValidPhoneNumber(formData.phoneNumber) ? "Invalid Phone Number" : "") })
    }
    const handleErrorClose = () => {
        setFormData({ fullName: "", email: "", password: "", phoneNumber: undefined, gender: "" })
        setShowErrorModal(false)
    }
    const handleEmailClose = () => {
        setFormData({ fullName: "", email: "", password: "", phoneNumber: "", gender: "" })
        setShowEmailSentModal(false)
        dispatch(resetSucess())
    }
    const handleResendMail = () => {
        dispatch(resendToken(formData.email))
    }
    useEffect(() => {
        if (error != null) {
            if(error=="Session expired, please log in." || error =="Access token required"){
                return
            }
            setShowErrorModal(true)
        }
    }, [error])
    useEffect(() => {
        if (sucess == true) {
            setShowEmailSentModal(true);
        }
    }, [sucess])
    useEffect(() => {
        if (loading == true) {
            setShowLoader(true)
            setShowEmailSentModal(false)
            setShowErrorModal(false)
        } if (loading == false) {
            setShowLoader(false)
            if (sucess == true) {
                setShowEmailSentModal(true)
            }
            if (error == true) {
                showErrorModal(true)
            }
        }
    }, [loading])
    return (
        <div>
            {showLoader && <Loader />}
            {/* {showErrorModal && error!="" && <ErrorModal message={error} btnMessage={"Retry"} onClose={() => handleErrorClose()} />} */}
            {showEmailSentModal && <EmailSentModal name={formData.fullName} onClose={() => handleEmailClose()} onResend={() => handleResendMail()} />}
            <div className={`signup h-[705px] w-[72rem]  mt-[16px] mb-[115px] ${showLoader ? "hidden" : "flex"} gap-[129px]`}>
                <div className="image w-[805px] h-[705px] bg-[#CBE4E8]">
                    <img src="/images/dl.beatsnoop 1.png" alt="cover-image" className="mt-[75px]" />
                </div>
                <div className="form w-[371px] h-[530px] flex flex-col gap-[48px]">
                    <div className="heading-content h-[78px]">
                        <h2 className="text-[36px] font-semibold">Create an account</h2>
                        <p className="text-[16px]">Enter your details below</p>
                        <p className={`text-[13px] text-[#DB4444] mt-[11px] ${!allFieldsFilled ? "" : "hidden"}`}>Please fill out all details</p>
                    </div>
                    <div className="form-content h-[404px] flex flex-col gap-[40px]">
                        <div className="fields  flex flex-col gap-[46px]">
                            <div className="flex flex-col h-[24px]">
                                <input type="text" placeholder="Full Name" className="w-[370px] h-[24px]  border-b-[1.5px] focus:outline-none focus:border-[#DB4444]" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} onBlur={() => setErrors({ ...errors, fullName: (formData.name === "" ? "Empty Field" : "") })} onFocus={() => setErrors({ ...errors, fullName: "" })} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.fullName == "" ? "hidden" : "relative"}`} title={errors.fullName}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                            <div className="flex flex-col h-[24px]">
                                <input type="email" placeholder="Email" className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} onBlur={() => setErrors({ ...errors, email: (formData.email === "" ? "Empty Field" : !validateEmail(formData.email) ? "Invalid Email Address" : "") })} onFocus={() => setErrors({ ...errors, email: "" })} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.email == "" ? "hidden" : "relative"}`} title={errors.email}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                            <div className="flex flex-col h-[24px]">
                                <input type="password" placeholder="Password" className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onBlur={() => setErrors({ ...errors, password: (formData.password === '' ? "Empty Field" : !validatePassword(formData.password) ? "Password must contain one upperCase letter, one lowerCase letter, one number and atleast 6 characters" : "") })} onFocus={() => setErrors({ ...errors, password: "" })} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.password == "" ? "hidden" : "relative"}`} title={errors.password}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                            <div className="flex flex-col h-[24px]">
                                <PhoneInput placeholder="Phone Number" className={`w-[370px] h-[24px] border-b-[1.5px] ${isPhoneNumberFocused ? "outline-none shadow-none border-[#DB4444]" : ""}`} value={formData.phoneNumber} onChange={(value) => setFormData({ ...formData, phoneNumber: value })} onFocus={handlePhoneNumberFocus} onBlur={handlePhoneNumberBlur} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.phoneNumber == "" ? "hidden" : "relative"}`} title={errors.phoneNumber}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                            <div className="flex flex-col h-[24px]">
                                <div className="flex flex-col">
                                    <div className="flex items-center w-[370px] justify-between">
                                        <div className="flex items-center gap-[14px]" onClick={() => { isGenderDropDownSelected === true ? setErrors({ ...errors, gender: (formData.gender == "" ? "Field Not Selected" : "") }) : ""; handleGenderDropdown() }}>
                                            <span>Gender</span>
                                            <div className="py-[4px] w-[96px] border-[1px] border-black border-opacity-25 flex items-center justify-evenly">
                                                <span className='select-none'>{formData.gender === '' ? 'Select' : formData.gender}</span>
                                                <div className="button w-[12px] h-[26px] flex" >
                                                    <img src="/images/decrease.svg" alt="drop-down" className="select-none" />
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`w-[21px] ${errors.gender == "" ? "hidden" : ""} `} title={errors.gender}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                                    </div>
                                    <div className={`options w-[96px] z-40 ml-[65px] bg-white border-[1px] border-black border-opacity-25 ${isGenderDropDownSelected ? "" : "hidden"}`}>
                                        <div className={`option h-[37px] flex items-center justify-center border-b-[1px] border-black border-opacity-25 ${formData.gender == "Male" ? "bg-[blue] text-white" : "hover:bg-[blue] hover:text-white"}  select-none`} onClick={() => setGender("Male")}>Male</div>
                                        <div className={`option h-[37px] flex items-center justify-center border-b-[1px] border-black border-opacity-25 ${formData.gender == "Female" ? "bg-[blue] text-white" : "hover:bg-[blue] hover:text-white"}  select-none`} onClick={() => setGender("Female")}>Female</div>
                                        <div className={`option h-[37px] flex items-center justify-center  ${formData.gender == "Others" ? "bg-[blue] text-white" : "hover:bg-[blue] hover:text-white"}  select-none`} onClick={() => setGender("Others")}>Others</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="buttons h-[188px] flex flex-col gap-[16px]">
                            <button className="btn-1 w-[371px] max-w-[371px] h-[56px] rounded-sm focus:outline-none" onClick={(e) => handleCreateAccount(e)}>Create Account</button>
                            <div className="google-btn-login h-[116px] flex flex-col gap-[27px]">
                                <button className="h-[56px] border-[1.5px] border-[#cccccc] rounded-sm hover:border-[#999999]">
                                    <div className="content flex gap-[16px] mx-[92px]">
                                        <img src="/images/Icon-Google.svg" alt="google" className="inline-block" />
                                        <p>Sign up with Google</p>
                                    </div>
                                </button>
                                <p className="text-[#4d4d4d79] text-center">Already have account? <Link to="/login" className="underline text-[#4D4D4D]">Log in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SignUp
