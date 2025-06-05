import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Aside from '../components/Aside'
import { useDispatch, useSelector } from 'react-redux'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { updateProfile } from '../slices/userSlice';
import Loader from '../components/Loader';
import { isValidPhoneNumber } from "libphonenumber-js";

const EditProfile = () => {
    const [isPasswordBoxVisible, setPasswordBoxVisible] = useState(false);
    const { user, error: userError, loading } = useSelector(state => state.user);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        if (userError) {
            setError(userError)
        }
    }, [userError])

    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])

    useEffect(() => {
        if (user) {
            setFullName(user.fullName)
            setGender(user.gender.toLowerCase())
            setPhone(user.phoneNumber)
        }
    }, [user])
    const handleNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setFullName(value);
        }
    }
    const handlePhoneChange = (value) => {
        setPhone(value);
    };
    const handleGenderChange = (e) => {
        setGender(e.target.value)
    }
    const handleSaveButton = async () => {
        let message = "";
        const passwordMismatch = isPasswordBoxVisible ? newPass != confirmNewPass : "";
        passwordMismatch ? message = "New password and confirmation password do not match" : ""
        setError(message)
        const allFieldsFilled = isPasswordBoxVisible ? (fullName != "" && gender != "" && phone != "" && currentPass != "" && newPass != "" && confirmNewPass != "") : (fullName != "" && gender != "" && phone != "")
        !allFieldsFilled ? message = "Please fill out all fields" : ""
        !isValidPhoneNumber("+" + phone) ? message = "Please fill valid phone number" : ""
        setError(message);
        console.log("Done setting all variable now going for for loop")
        if (!passwordMismatch && allFieldsFilled && isValidPhoneNumber("+" + phone)) {
            isPasswordBoxVisible ? await dispatch(updateProfile({ fullName: fullName, phoneNumber: phone, gender: gender, currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmNewPass })).unwrap() : await dispatch(updateProfile({ fullName: fullName, phoneNumber: phone, gender: gender })).unwrap()
            navigate("/my-profile");

        }
    }
    return (
        <div className="min-h-[320px]">
            {loading && <Loader />}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/manage-my-account" className="text-[#605f5f] text-[14px] hover:text-black">My Account</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/my-profile" className="text-[#605f5f] text-[14px] hover:text-black">My Profile</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/edit-profile" className="text-[14px]">Edit Profile</Link>
                    </div>
                    <div className="welcome  h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px]  mx-auto mb-[120px] flex justify-between">
                    <Aside />
                    <div className="edit-profile w-[870px] p-[80px] shadow-lg">
                        <div className="inner  flex flex-col">
                            <div className="heading mb-[8px]">
                                <h5 className="text-[20px] text-[#DB4444]">My Profile</h5>
                            </div>
                            <span className={`my-[2px] text-[13px] text-[#DB4444] ${error != "" ? "" : "invisible"}`}>{error}</span>
                            <div className="row-1 flex justify-between">
                                <div className="name w-[341px] h-[78px] flex flex-col">
                                    <label htmlFor="name" className="text-[12px] text-[#424242] mb-1">Full Name</label>
                                    <input type="text" id="name" value={fullName} className="w-[330px] h-[40px] px-[10px] bg-[#F5F5F5] focus:outline-none" onChange={handleNameChange} />
                                </div>
                                <div className="email w-[341px] h-[78px] flex flex-col">
                                    <label htmlFor="email" className="text-[12px] text-[#424242] mb-1">Email</label>
                                    <input id="email-id" type="email" defaultValue={user?.email} className="w-[330px] h-[40px] px-[10px] bg-[#F5F5F5] focus:outline-none" readOnly={true} />
                                </div>
                            </div>
                            <div className="row-2 flex justify-between">
                                <div className="phone w-[341px] h-[78px] flex flex-col">
                                    <label htmlFor="phone" className="text-[12px] text-[#424242] mb-1">Mobile</label>
                                    <PhoneInput value={phone} onChange={handlePhoneChange} inputStyle={{ width: "330px", height: "40px", background: "#F5F5F5", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" }} />
                                </div>
                                <div className="gender w-[341px] h-[78px] flex flex-col">
                                    <label htmlFor="gender" className="text-[12px] text-[#424242] mb-1">Gender</label>
                                    <select name="gender" id="gender" className="w-[100px] h-[40px] focus:outline-none border-[1.5px] border-black border-opacity-30" value={gender} onChange={handleGenderChange}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="others">Others</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row-3">
                                <div className={`password w-[341px] h-[78px] flex-col flex ${isPasswordBoxVisible != true ? 'flex' : 'hidden'}`}>
                                    <div className="label flex ">
                                        <span className="text-[12px] text-[#424242] mb-1">Password</span>
                                        <div className="border-r border-[1.05px] border-[#0000006b] mx-[6px]" />
                                        <span className="text-[12px] text-[#DB4444] cursor-pointer" onClick={() => setPasswordBoxVisible(true)}>Change</span>
                                    </div>
                                    <div className="password-text">***********</div>
                                </div>
                            </div>
                            <div className={`password-changes flex-col justify-between w-[710px] h-[180px] ${isPasswordBoxVisible == true ? 'flex' : 'hidden'} `}>
                                <div className="current-pass flex flex-col justify-between w-[710px] h-[75px]">
                                    <div className="heading">
                                        <span className="text-[16px]">Password Changes</span>
                                    </div>
                                    <input type="password" className="w-[710px] h-[40px] focus:outline-none px-[10px] bg-[#F5F5F5]" placeholder="Current Password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} />
                                </div>
                                <input type="password" className="w-[710px] h-[40px] focus:outline-none px-[10px] bg-[#F5F5F5]" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                                <input type="password" className="w-[710px] h-[40px] focus:outline-none px-[10px] bg-[#F5F5F5]" placeholder="Confirm New Password" value={confirmNewPass} onChange={(e) => setConfirmNewPass(e.target.value)} />
                            </div>
                            <div className="row-5 mt-[14px] ml-[413px]">
                                <Link to="/my-profile">
                                    <button className="w-[100px] border-[1.5px] h-[56px] border-black rounded-sm border-opacity-30 hover:border-opacity-70 mr-[5px]">CANCEL</button>
                                </Link>
                                <button className="btn-1 w-[214px] h-[56px]" onClick={handleSaveButton}>SAVE CHANGES</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default EditProfile
