import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Loader from '../components/Loader';
import { isValidPhoneNumber } from "libphonenumber-js";
import { updateProfile } from '../slices/authSlice';


const EditProfile = () => {
    const [isPasswordBoxVisible, setPasswordBoxVisible] = useState(false);
    const [saving, setSaving] = useState(false);  
    const { user, error: userError, loading } = useSelector(state => state.auth);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(()=>{
        if(!user){
            navigate("/login", { state: { from: location.pathname } })
        }
    },[user])
    useEffect(() => {
        if (userError) {
            setError(userError);
        }
    }, [userError]);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName);
            setGender(user.gender?.toLowerCase() || "");
            setPhone(user.phoneNumber || "");
        }
    }, [user]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setFullName(value);
        }
    };
    const handlePhoneChange = (value) => {
        setPhone(value);
    };
    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    const handleSaveButton = async () => {
        let message = "";
        const passwordMismatch = isPasswordBoxVisible ? newPass !== confirmNewPass : "";
        if (passwordMismatch) message = "New password and confirmation password do not match";
        
        const allFieldsFilled = isPasswordBoxVisible
            ? fullName !== "" && gender !== "" && phone !== "" && currentPass !== "" && newPass !== "" && confirmNewPass !== ""
            : fullName !== "" && gender !== "" && phone !== "";
        
        if (!allFieldsFilled) message = "Please fill out all fields";
        if (!isValidPhoneNumber("+" + phone)) message = "Please enter a valid phone number";
        setError(message);

        if (!passwordMismatch && allFieldsFilled && isValidPhoneNumber("+" + phone)) {
            const payload = { fullName, phoneNumber: phone, gender };
            if (isPasswordBoxVisible) {
                Object.assign(payload, { currentPassword: currentPass, newPassword: newPass, confirmPassword: confirmNewPass });
            }

            setSaving(true);  
            dispatch(updateProfile(payload))
                .unwrap()  
                .then(() => {
                    setSaving(false);
                    navigate("/my-profile");
                })
                .catch((error) => {
                    setSaving(false);
                    setError(error);
                });
        }
    };

    return (
        <div className="min-h-[320px]">
            {loading && <Loader />}
            {!loading && (
                <>
                    {/* Breadcrumbs */}
                    <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                            <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                            <span className="mx-2 text-sm text-[#605f5f]">/</span>
                            <Link to="/manage-my-account" className="text-[#605f5f] text-sm hover:text-black">My Account</Link>
                            <span className="mx-2 text-sm text-[#605f5f]">/</span>
                            <Link to="/edit-profile" className="text-sm">Edit Profile</Link>
                        </div>
                        <div className="welcome h-auto text-sm">
                            <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                        </div>
                    </div>

                    <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">
                        <div className="flex-1 bg-white shadow-md rounded-lg p-6 md:p-10">
                            <h5 className="text-xl text-[#DB4444] font-semibold mb-6">My Profile</h5>

                            {error && <p className="text-sm text-[#DB4444] mb-4">{error}</p>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="text-xs text-gray-600 block mb-1">Full Name</label>
                                    <input type="text" id="name" value={fullName} onChange={handleNameChange} className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md focus:outline-none" />
                                </div>
                                <div>
                                    <label htmlFor="email-id" className="text-xs text-gray-600 block mb-1">Email</label>
                                    <input id="email-id" type="email" defaultValue={user?.email} readOnly className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="text-xs text-gray-600 block mb-1">Mobile</label>
                                    <PhoneInput
                                        country={'pk'}
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        inputStyle={{ width: "100%", height: "40px", background: "#F5F5F5", fontSize: "16px" }}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 block mb-1">Gender</label>
                                    <select
                                        name="gender"
                                        value={gender}
                                        onChange={handleGenderChange}
                                        className="w-full px-3 py-2 border-b-2 border-gray-300 bg-[#F5F5F5] focus:outline-none rounded-md text-gray-600"
                                        required
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            {user?.password && !isPasswordBoxVisible && (
                                <div className="mt-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span>Password</span>
                                        <span className="mx-2 border-r border-gray-400 h-4"></span>
                                        <span className="text-[#DB4444] cursor-pointer" onClick={() => setPasswordBoxVisible(true)}>Change</span>
                                    </div>
                                    <div className="text-base font-medium mt-1">***********</div>
                                </div>
                            )}

                            {user?.password && isPasswordBoxVisible && (
                                <div className="mt-8 space-y-4">
                                    <h6 className="text-base font-semibold">Password Changes</h6>
                                    <input type="password" placeholder="Current Password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md" />
                                    <input type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md" />
                                    <input type="password" placeholder="Confirm New Password" value={confirmNewPass} onChange={(e) => setConfirmNewPass(e.target.value)} className="w-full px-3 py-2 bg-[#F5F5F5] rounded-md" />
                                </div>
                            )}

                            <div className="mt-8 flex justify-end gap-4">
                                <Link to="/my-profile">
                                    <button className="px-6 py-3 border border-gray-400 hover:border-gray-600 rounded">CANCEL</button>
                                </Link>
                                <button 
                                    onClick={handleSaveButton} 
                                    className="bg-[#DB4444] text-white px-6 py-3 rounded hover:bg-red-600"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "SAVE CHANGES"}  {/* Conditionally change text */}
                                </button>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default EditProfile;
