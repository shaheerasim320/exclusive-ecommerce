import React, { useEffect, useState } from 'react'
import ErrorModal from '../components/modals/ErrorModal';
import Loader from '../components/Loader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import EmailConfirmModal from '../components/modals/EmailConfirmModal';

const PasswordForm = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [searchParams] = useSearchParams()
    const create = searchParams.get("create")
    const reset = searchParams.get("reset")
    const token = searchParams.get("token")
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [errorButtonMessage, setErrorButtonMessage] = useState("")
    const [error, setError] = useState("")
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    })
    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: ""
    })
    const validatePassword = (password) => {
        const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
        return passwordRegex.test(password)
    }

    const handleClick = async () => {
        const { password, confirmPassword } = formData;
        const allFieldsFilled = password !== "" && confirmPassword !== "";

        if (!allFieldsFilled) {
            setError(password === "" ? "Please fill the password" : "Please fill confirm password");
            return;
        }

        if (errors.password === "" && errors.confirmPassword === "" && create) {
            try {
                console.log("Sending request with:", { token, password });
                setLoading(true);
                const res = await axios.post("http://localhost:8080/api/v1/users/set-password", {
                    token,
                    password
                });
                setShowConfirmModal(true);
            } catch (error) {
                const message = error.response?.data?.message || error.message;
                setErrorMessage(message == "Token has expired" ? "Your link has expired. Please request a new one." : "Something went wrong! Please try again");
                setErrorButtonMessage(message == "Token has expired" ? "Request New Link" : "Retry");
                setShowErrorModal(true)
            } finally {
                setLoading(false);
            }
        }
    };


    const handleClose = () => {
        errorMessage == "Your link has expired. Please request a new one." ? navigate("/resend-link") : window.location.reload()
        setShowErrorModal(!showErrorModal)
    }

    const handleConfirmModal = () => {
        setShowConfirmModal(!showConfirmModal)
        navigate("/login")
    }


    return (
        <div className="min-h-[320px]">
            {loading && <Loader />}
            {showErrorModal && <ErrorModal message={errorMessage} btnMessage={errorButtonMessage} onClose={handleClose} />}
            {showConfirmModal && <EmailConfirmModal onClick={handleConfirmModal} account={true} />}
            <div className={`w-[1150px] mt-[16px] mb-[115px] ${showErrorModal || loading ? "hidden" : "flex"} gap-[129px]`}>
                <div className="image w-[805px] h-[446px] bg-[#CBE4E8]">
                    <img src="/images/dl.beatsnoop 1.png" alt="pic" className="mt-[75px]" />
                </div>
                <div className="form w-[371px] h-[326px] my-[183px] flex flex-col gap-[48px]">
                    <div className="heading-content h-[78px]">
                        <h2 className="text-[32px] font-semibold">{reset ? "Reset Password" : "Set your password"}</h2>
                        <p className="text-[16px]">Enter your details below</p>
                        <p className={`text-[13px] text-[#DB4444] mt-[11px] ${error != "" ? "" : "hidden"}`}>{error}</p>
                    </div>
                    <div className="form-content h-[104px] flex flex-col gap-[40px]">
                        <div className="fields h-[176px] flex flex-col gap-[46px]">
                            <div className="flex flex-col h-[24px]">
                                <input type="password" placeholder="Password" className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} onBlur={() => setErrors({ ...errors, password: (formData.password === '' ? "Empty Field" : !validatePassword(formData.password) ? "Password must contain one upperCase letter, one lowerCase letter, one number and atleast 6 characters" : "") })} onFocus={() => { setErrors({ ...errors, password: "" }); setError(error == "Please fill password" ? "" : error) }} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.password == "" ? "hidden" : "relative"}`} title={errors.password}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                            <div className="flex flex-col h-[24px]">
                                <input type="password" placeholder="Confirm Password" className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} onBlur={() => setErrors({ ...errors, confirmPassword: (formData.confirmPassword === '' ? "Empty Field" : formData.password != formData.confirmPassword ? "Password and confirm password don't match" : "") })} onFocus={() => { setErrors({ ...errors, confirmPassword: "" }); setError(error == "Please fill confirm password" ? "" : error) }} />
                                <span className={`left-[349px] bottom-[24px] w-[21px] ${errors.confirmPassword == "" ? "hidden" : "relative"}`} title={errors.confirmPassword}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                            </div>
                        </div>
                        <div className="buttons  flex justify-center">
                            <button className="bg-[#DB4444] hover:bg-[#E07575] text-white rounded-sm py-[11px] px-[16px]" onClick={handleClick}>Set Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PasswordForm
