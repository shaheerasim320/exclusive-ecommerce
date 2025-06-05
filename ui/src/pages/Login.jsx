import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
// import { login, resetError } from '../slices/userSlice'
import { getAppliedCoupon } from '../slices/cartSlice'
// import { getWishlistItems } from '../slices/wishlistSlice'
import { getDefaultBillingAddress, getDefaultShippingAddress } from '../slices/addressSlice'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const { user, error, loading } = useSelector((state) => state.user)
    const { loading: wishistLoading } = useSelector(state => state.wishlist)
    const { loading: cartLoading } = useSelector(state => state.cart)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    })
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const handleLoginClick = async (e) => {
        e.preventDefault();
        const allFieldsAreFilled = Object.values(formData).every(value => value != "")
        const areNoErrorsPresent = Object.values(errors).every(value => value == "")
        if (allFieldsAreFilled && areNoErrorsPresent) {
            setFormData({ email: "", password: "" })
            // await dispatch(login({ email: formData.email, password: formData.password })).unwrap()
            // await dispatch(getCartItems()).unwrap()
            // await dispatch(getWishlistItems()).unwrap()
            // await dispatch(getAppliedCoupon()).unwrap()
            const redirectPath = location.state?.from || "/";
            navigate(redirectPath)
        }
    }
    useEffect(() => {
        if (error != null) {
            setFormData({ email: "", password: "" })
        }
    }, [error])
    return (
        <div className="min-h-[320px]">
            {(loading || cartLoading || wishistLoading) && <Loader />}
            <div className={`login h-[646px] w-[1150px] mt-[16px] mb-[115px] ${(loading || cartLoading || wishistLoading) ? "hidden" : "flex"} items-center gap-[129px]`}>
                <div className="image w-[805px] h-[646px] bg-[#CBE4E8]">
                    <img src="/images/dl.beatsnoop 1.png" alt="cover" className="mt-[75px]" />
                </div>
                <div className="form w-[371px] h-[326px] flex flex-col gap-[48px]">
                    <div className="heading-content h-[78px]">
                        <h2 className="text-[36px] font-semibold">Log in to Exclusive</h2>
                        <p className="text-[16px]">Enter your details below</p>
                        <p className={`text-[13px] text-[#DB4444] mt-[11px] ${error != null && error != "Access token required" && (error != "Session expired. Please log in again." && location.state?.from == undefined) ? "" : "hidden"}`}>{error}</p>
                    </div>
                    <form onSubmit={handleLoginClick}>
                        <div className="form-content h-[104px] flex flex-col gap-[40px]">
                            <div className="fields h-[176px] flex flex-col gap-[46px]">
                                <div className="flex flex-col h-[24px]">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]"
                                        name="loginEmail"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                        onBlur={() =>
                                            setErrors({
                                                ...errors,
                                                email:
                                                    formData.email === ""
                                                        ? "Empty Field"
                                                        : !validateEmail(formData.email)
                                                            ? "Invalid Email Address"
                                                            : "",
                                            })
                                        }
                                        onFocus={() => setErrors({ ...errors, email: "" })}
                                    />
                                    <span
                                        className={`left-[349px] bottom-[24px] w-[21px] ${errors.email == "" ? "hidden" : "relative"
                                            }`}
                                        title={errors.email}
                                    >
                                        <img src="/images/error-icon.png" alt="error-icon" width={20} height={20} />
                                    </span>
                                </div>

                                <div className="flex flex-col h-[24px]">
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-[370px] h-[24px] border-b-[1.5px] focus:outline-none focus:border-[#DB4444]"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                        onBlur={() =>
                                            setErrors({
                                                ...errors,
                                                password: formData.password === "" ? "Empty Field" : "",
                                            })
                                        }
                                        onFocus={() => setErrors({ ...errors, password: "" })}
                                    />
                                    <span
                                        className={`left-[349px] bottom-[24px] w-[21px] ${errors.password == "" ? "hidden" : "relative"
                                            }`}
                                        title={errors.password}
                                    >
                                        <img src="/images/error-icon.png" alt="error-icon" width={20} height={20} />
                                    </span>
                                </div>
                            </div>

                            <div className="buttons h-[56px] flex items-center gap-[87px]">
                                <button
                                    type="submit"
                                    className="btn-1 w-[143px] h-[56px] rounded-sm mx-0"
                                >
                                    Log in
                                </button>
                                <div className="forget-password">
                                    <Link to="/forgot-my-password" className="text-[#DB4444]">
                                        Forget Password?
                                    </Link>
                                </div>
                            </div>

                            <p className="text-[#4d4d4d79] text-center">
                                New to exclusive?{" "}
                                <Link to="/signup" className="underline text-[#4D4D4D]">
                                    Create a account
                                </Link>
                            </p>
                        </div>
                    </form>

                </div>
            </div>

        </div>
    )
}

export default Login
