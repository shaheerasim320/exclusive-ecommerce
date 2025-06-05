import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import Aside from '../components/Aside'
import { Country, State, City } from "country-state-city";
import { useDispatch, useSelector } from 'react-redux';
import { getAddressByID, getSavedAddresses, saveAddress, updateUserAddress } from '../slices/addressSlice';
import Loader from '../components/Loader';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";

const EditAddress = () => {
    const [searchParams] = useSearchParams()
    const { address, loading } = useSelector(state => state.address)
    const updateAddress = searchParams.has("update") ? searchParams.get("update") : null
    const [fullName, setFullName] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState(updateAddress && updateAddress ? State.getStatesOfCountry(selectedCountry).find((c) => c.name.toLowerCase() == address?.province.toLowerCase())?.isoCode : "");
    const [selectedCity, setSelectedCity] = useState(updateAddress ? address?.city : "");
    const [fieldsFilled, setFieldsFilled] = useState(true);
    const location = useLocation()
    const { user } = useSelector(state => state.user)
    const addressID = location.state?.addressID;
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function loadResource() {
            await dispatch(getAddressByID({ addressID })).unwrap();
        }
        if (addressID) {
            loadResource();
        }
        if (updateAddress && !addressID) {
            navigate("/address-book")
        }
    }, [dispatch, addressID]);

    useEffect(() => {
        if (updateAddress && address) {
            setPhone(address.phoneNumber);
            setFullName(address.name);
            setUserAddress(address.address);
            const country = Country.getAllCountries().find((c) => c.name.toLowerCase() === address.country.toLowerCase());
            const province = State.getStatesOfCountry(selectedCountry).find((c) => c.name.toLowerCase() == address.province.toLowerCase());

            if (country) {
                setSelectedCountry(country.isoCode)
            }
            if (province) {
                setSelectedState(province.isoCode)
            }
        }
    }, [address, updateAddress])

    useEffect(() => {
        if (updateAddress && selectedCountry && selectedState) {
            const city = City.getCitiesOfState(selectedCountry, selectedState).find((c) => c.name.toLowerCase() == address.city.toLowerCase());
            setSelectedCity(city?.name)
        }
    }, [selectedCountry, selectedState])

    const handlePhoneChange = (value) => {
        setPhone(value);
    };
    const handleNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setFullName(value);
        }
    }
    const handleAddressChange = (e) => {
        setUserAddress(e.target.value)
    }
    const handleSaveButton = async () => {
        if (updateAddress) {
            const updatedData = {
                name: fullName,
                phoneNumber: phone,
                address: userAddress,
                city: selectedCity,
                province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name,
                country: Country.getCountryByCode(selectedCountry).name
            }
            await dispatch(updateUserAddress({ id: addressID, updatedData: updatedData })).unwrap()
            console.log("Data Updated")
            return;
        }
        let message = "";
        const allFieldsFilled = fullName != "" && phone != "" && userAddress != "" && selectedCity != "" && selectedState != "" && selectedCountry != ""
        setFieldsFilled(allFieldsFilled)
        !isValidPhoneNumber("+" + phone) ? message = "Please fill valid phone number" : ""
        setError(message)
        if (allFieldsFilled && isValidPhoneNumber("+" + phone)) {
            const {addressID} = await dispatch(saveAddress({ name: fullName, phoneNumber: phone, address: userAddress, city: selectedCity, province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name, country: Country.getCountryByCode(selectedCountry).name })).unwrap()
            await dispatch(getSavedAddresses()).unwrap()
            
            const redirectURL = location?.state?.redirectURL || "/address-book"
            navigate(redirectURL, { state: { addressID: addressID } })
        }
    }

    const handleCancelButton = () => {
        const redirectURL = location?.state?.redirectURL || "/address-book"
        navigate(redirectURL)
    }

    return (
        <div className="min-h-[320px]">
            {loading && <Loader />}
            <div className={`${loading ? "hidden" : ""}`}>
                {/* Breadcrumbs */}
                <div className="nav w-[1170px] h-[21px] my-[34px] mx-auto flex justify-between">
                    <div className="bread-crumb">
                        <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/manage-my-account" className="text-[#605f5f] text-[14px] hover:text-black">My Account</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/address-book" className="text-[#605f5f] text-[14px] hover:text-black">Address Book</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to={`${location.pathname + location?.search}`} className="text-[14px]">{updateAddress ? "Edit Address" : "Add New Address"}</Link>
                    </div>
                    <div className="welcome h-[21px]">
                        <h6 className="text-[14px]">Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>
                {/* Breadcrumbs Ends Here*/}
                <section className="w-[1170px] h-[535px] mx-auto mb-[120px] flex justify-between">
                    <Aside />
                    <div className="add-new-address w-[955px] h-[457px]">
                        <div className="form flex flex-col justify-between w-[970px] h-[500px] p-[38px] mx-auto shadow-lg">
                            <div className="heading">
                                <h5 className="text-[20px] text-[#DB4444]">{updateAddress ? "Edit My Address" : "Add New Address"}</h5>
                            </div>
                            <p className={`text-[13px] text-[#DB4444] ${!fieldsFilled || error != "" ? "" : "invisible"}`}>{!fieldsFilled ? "Please fill out all details" : error}</p>
                            <div className="inner-form w-[955px] h-[300px] flex">
                                <div className="col-1 w-[447px] h-[264px]">
                                    <div className="name w-[417px] h-[78px] flex flex-col">
                                        <label htmlFor="name" className="text-[12px] text-[#424242] mb-1">Full Name</label>
                                        <input type="text" id="name" value={fullName} className="w-[325px] h-[40px] px-[10px] bg-[#F5F5F5] focus:outline-none" placeholder="Enter Your Full Name" onChange={handleNameChange} />
                                    </div>
                                    <div className="phone-number w-[417px] h-[78px] flex flex-col">
                                        <label htmlFor="phone" className="text-[12px] text-[#424242] mb-1">Phone Number</label>
                                        <PhoneInput value={phone} onChange={handlePhoneChange} inputStyle={{ width: "325px", height: "40px", background: "#F5F5F5", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", }} containerStyle={{ marginTop: "10px" }} />
                                    </div>
                                    <div className="address flex flex-col w-[417px] h-[62px]">
                                        <label htmlFor="address" className="text-[12px] text-[#424242] mb-1">Address</label>
                                        <input type="text" className="w-[325px] h-[40px] px-[10px] bg-[#F5F5F5] focus:outline-none" value={userAddress} placeholder="Enter Your Address" onChange={handleAddressChange} />
                                    </div>
                                </div>
                                <div className="col-2 flex flex-col w-[456px] h-[264px]">

                                    <div className="country flex flex-col w-[456px] h-[62px] mb-[15px]">
                                        <label htmlFor="country" className="text-[12px] text-[#424242] mb-1">Country</label>
                                        <select name="country" id="country" className="w-[456px] h-[38px] px-[10px] bg-[#F5F5F5] focus:outline-none" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                            <option value="" disabled hidden>Select Your Country</option>
                                            {Country.getAllCountries().map((country) => (
                                                <option key={country.isoCode} value={country.isoCode}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="province flex flex-col w-[456px] h-[62px] mb-[15px]">
                                        <label htmlFor="province" className="text-[12px] text-[#424242] mb-1">Province / Region</label>
                                        <select name="province" id="province" className="w-[456px] h-[38px] px-[10px] bg-[#F5F5F5] focus:outline-none" disabled={selectedCountry == "" ? true : false} onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
                                            <option value="" disabled hidden>Select Your Province/Region</option>
                                            {State.getStatesOfCountry(selectedCountry).map((state) => (
                                                <option key={state.isoCode} value={state.isoCode}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="city flex flex-col w-[456px] h-[62px]">
                                        <label htmlFor="city" className="text-[12px] text-[#424242] mb-1">City</label>
                                        <select name="city" id="city" className="w-[456px] h-[38px] px-[10px] bg-[#F5F5F5] focus:outline-none" disabled={selectedState == "" ? true : false} onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
                                            <option value="" hidden disabled>Select Your City</option>
                                            {City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
                                                <option key={city.name} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                </div>
                            </div>
                            <div className="form-actions w-[905px] h-[40px] flex justify-end gap-[14px] ">
                                <button className="w-[168px] h-[40px] border-[1.5px] rounded-sm  border-black border-opacity-30 hover:border-opacity-70 " onClick={handleCancelButton}>Cancel</button>
                                <button className="w-[168px] h-[40px] bg-[#DB4444] text-white hover:bg-[#E07575] rounded-sm" onClick={handleSaveButton}>SAVE</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
    )
}

export default EditAddress
