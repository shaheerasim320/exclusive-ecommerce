import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Aside from '../components/Aside'
import { useSelector } from 'react-redux'

const Profile = () => {
    const { user } = useSelector(state => state.user)
    const location = useLocation()
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])
    return (
        <div>
            <div>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/manage-my-account" className="text-[#605f5f] text-[14px] hover:text-black">My Account</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/my-profile" className="text-[14px]">My Profile</Link>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px] h-[430px] mx-auto mb-[120px] flex justify-between">
                    <Aside setActive='my-profile' />
                    <div className="profile w-[870px] h-[450px] p-[70px] shadow-lg">
                        <div className="inner h-[350px] flex flex-col justify-between">
                            <div className="heading mb-[8px]">
                                <h5 className="text-[20px] text-[#DB4444]">My Profile</h5>
                            </div>
                            <div className="row-1 flex justify-between">
                                <div className="name w-[341px] h-[78px] flex flex-col">
                                    <span className="text-[12px] text-[#424242] mb-1">Full Name</span>
                                    <div className="name-text">{user?.fullName}</div>
                                </div>
                                <div className="email w-[341px] h-[78px] flex flex-col">
                                    <span className="text-[12px] text-[#424242] mb-1">Email</span>
                                    <div className="name-text">{user?.email}</div>
                                </div>
                            </div>
                            <div className="row-2 flex justify-between">
                                <div className="phone w-[341px] h-[78px] flex flex-col">
                                    <span className="text-[12px] text-[#424242] mb-1">Mobile</span>
                                    <div className="phone-text">{"+" + user?.phoneNumber}</div>
                                </div>
                                <div className="gender w-[341px] h-[78px] flex flex-col">
                                    <span className="text-[12px] text-[#424242] mb-1">Gender</span>
                                    <div className="gender-text">{user?.gender}</div>
                                </div>
                            </div>
                            <div className="row-4">
                                <div className="password w-[341px] h-[78px] flex flex-col">
                                    <span className="text-[12px] text-[#424242] mb-1">Password</span>
                                    <div className="password-text">***********</div>
                                </div>
                            </div>
                            <div className="row-5 ml-[518px]">
                                <Link to="/edit-profile">
                                    <button className="btn-1 w-[214px] h-[56px]">EDIT PROFILE</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default Profile
