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

    const [searchParams] = useSearchParams();
    const [isSaving, setIsSaving] = useState(false);
    const { address, loading } = useSelector(state => state.address)
    const updateAddress = searchParams.has("update") ? searchParams.get("update") : null
    const [fullName, setFullName] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState(updateAddress && updateAddress ? State.getStatesOfCountry(selectedCountry).find((c) => c.name.toLowerCase() == address?.province.toLowerCase())?.isoCode : "");
    const [selectedCity, setSelectedCity] = useState(updateAddress ? address?.city : "");
    const [fieldsFilled, setFieldsFilled] = useState(true);
    const location = useLocation()
    const { user } = useSelector(state => state.auth)
    const addressID = location.state?.addressID;
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user) {
            navigate("/login", { state: { from: location.pathname } })
        }
    }, [user])

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
        setError(""); // Clear previous errors

        const countryData = Country.getCountryByCode(selectedCountry);
        const stateData = State.getStateByCodeAndCountry(selectedState, selectedCountry);

        const allFieldsFilled = fullName !== "" && phone !== "" && userAddress !== "" && selectedCity != "" && selectedState !== "" && selectedCountry !== "";
        console.log(selectedCity);
        if (!allFieldsFilled) {
            setFieldsFilled(false);
            return;
        }
        setFieldsFilled(true); // Reset if it was false

        if (!isValidPhoneNumber("+" + phone)) {
            setError("Please fill valid phone number");
            return;
        }

        setIsSaving(true); // Set saving state to true when button is clicked
        try {
            if (updateAddress) {
                console.log(stateData);
                const updatedData = {
                    name: fullName,
                    phoneNumber: phone,
                    address: userAddress,
                    city: selectedCity,
                    province: stateData?.name,
                    country: countryData?.name
                };
                console.log(updatedData);
                // Dispatch actual Redux action for update
                await dispatch(updateUserAddress({ addressId: addressID, updatedData: updatedData })).unwrap();
                await dispatch(getSavedAddresses()).unwrap(); // Refresh saved addresses list
                navigate("/address-book")
            } else {
                // Dispatch actual Redux action for save
                const { addressID: newAddressID } = await dispatch(saveAddress({
                    name: fullName,
                    phoneNumber: phone,
                    address: userAddress,
                    city: selectedCity,
                    province: stateData?.name,
                    country: countryData?.name
                })).unwrap();
                await dispatch(getSavedAddresses()).unwrap(); // Refresh saved addresses list
                const redirectURL = location?.state?.redirectURL || "/address-book";
                navigate(redirectURL, { state: { addressID: newAddressID } });
            }
        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSaving(false); // Reset saving state to false after API call
        }
    };




    const handleCancelButton = () => {
        const redirectURL = location?.state?.redirectURL || "/address-book"
        navigate(redirectURL)
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Show Loader if either page is loading or saving is in progress */}
            {(loading || isSaving) && <Loader />}
            <div className={`${(loading || isSaving) ? "hidden" : ""}`}>
                {/* Breadcrumbs - Responsive */}
                <div className="nav w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto h-auto my-4 md:my-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="bread-crumb flex items-center mb-2 sm:mb-0">
                        <Link to="/" className="text-[#605f5f] text-sm hover:text-black">Home</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/manage-my-account" className="text-[#605f5f] text-sm hover:text-black">My Account</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to="/address-book" className="text-[#605f5f] text-sm hover:text-black">Address Book</Link>
                        <span className="mx-2 text-sm text-[#605f5f]">/</span>
                        <Link to={`${location.pathname + location?.search}`} className="text-sm">{updateAddress ? "Edit Address" : "Add New Address"}</Link>
                    </div>
                    <div className="welcome h-auto text-sm">
                        <h6>Welcome! <span className="text-[#DB4444]">{user?.fullName}</span></h6>
                    </div>
                </div>

                <section className="w-full px-4 md:px-8 lg:max-w-[1170px] lg:mx-auto mb-10 md:mb-16 flex flex-col lg:flex-row lg:gap-10">

                    <div className="add-new-address w-full  bg-white p-6 md:p-8 rounded-md shadow-lg">
                        <div className="form flex flex-col gap-6 w-full"> {/* Adjusted gap and padding for responsiveness */}
                            <div className="heading">
                                <h5 className="text-xl md:text-2xl text-[#DB4444] font-semibold">{updateAddress ? "Edit My Address" : "Add New Address"}</h5>
                            </div>
                            <p className={`text-sm md:text-base text-[#DB4444] ${!fieldsFilled || error !== "" ? "" : "invisible"}`}>
                                {!fieldsFilled ? "Please fill out all details" : error}
                            </p>

                            <div className="inner-form flex flex-col md:flex-row gap-6 md:gap-8 w-full">
                                <div className="col-1 w-full md:w-1/2 flex flex-col gap-4">
                                    <div className="name w-full flex flex-col">
                                        <label htmlFor="name" className="text-xs md:text-sm text-[#424242] mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={fullName}
                                            className="w-full h-10 px-3 bg-[#F5F5F5] focus:outline-none rounded-sm border border-gray-300"
                                            placeholder="Enter Your Full Name"
                                            onChange={handleNameChange}
                                        />
                                    </div>
                                    <div className="phone-number w-full flex flex-col">
                                        <label htmlFor="phone" className="text-xs md:text-sm text-[#424242] mb-1">Phone Number</label>
                                        <PhoneInput
                                            country={'pk'} // Default country set to Pakistan
                                            value={phone}
                                            onChange={handlePhoneChange}
                                            inputStyle={{
                                                width: "100%", // Made responsive
                                                height: "40px",
                                                background: "#F5F5F5",
                                                fontSize: "16px",
                                                borderRadius: "5px",
                                                border: "1px solid #ccc",
                                            }}
                                            containerStyle={{ marginTop: "0" }} // Adjusted margin
                                            countryCodeEditable={false} // Disable editing country code for consistency
                                        />
                                    </div>
                                    <div className="address flex flex-col w-full">
                                        <label htmlFor="address" className="text-xs md:text-sm text-[#424242] mb-1">Address</label>
                                        <input
                                            type="text"
                                            id="address"
                                            className="w-full h-10 px-3 bg-[#F5F5F5] focus:outline-none rounded-sm border border-gray-300"
                                            value={userAddress}
                                            placeholder="Enter Your Address"
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                </div>

                                <div className="col-2 w-full md:w-1/2 flex flex-col gap-4">
                                    <div className="country flex flex-col w-full">
                                        <label htmlFor="country" className="text-xs md:text-sm text-[#424242] mb-1">Country</label>
                                        <select
                                            name="country"
                                            id="country"
                                            className="w-full h-10 px-3 bg-[#F5F5F5] focus:outline-none rounded-sm border border-gray-300"
                                            value={selectedCountry}
                                            onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(""); setSelectedCity(""); }} // Reset state/city on country change
                                        >
                                            <option value="" disabled hidden>Select Your Country</option>
                                            {Country.getAllCountries().map((country) => (
                                                <option key={country.isoCode} value={country.isoCode}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="province flex flex-col w-full">
                                        <label htmlFor="province" className="text-xs md:text-sm text-[#424242] mb-1">Province / Region</label>
                                        <select
                                            name="province"
                                            id="province"
                                            className="w-full h-10 px-3 bg-[#F5F5F5] focus:outline-none rounded-sm border border-gray-300"
                                            disabled={selectedCountry === ""}
                                            onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(""); }} // Reset city on state change
                                            value={selectedState}
                                        >
                                            <option value="" disabled hidden>Select Your Province/Region</option>
                                            {State.getStatesOfCountry(selectedCountry).map((state) => (
                                                <option key={state.isoCode} value={state.isoCode}>
                                                    {state.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="city flex flex-col w-full">
                                        <label htmlFor="city" className="text-xs md:text-sm text-[#424242] mb-1">City</label>
                                        <select
                                            name="city"
                                            id="city"
                                            className="w-full h-10 px-3 bg-[#F5F5F5] focus:outline-none rounded-sm border border-gray-300"
                                            disabled={selectedState === ""}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            value={selectedCity}
                                        >
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
                            <div className="form-actions w-full flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <button
                                    className="w-full sm:w-40 h-10 border-[1.5px] rounded-sm border-black border-opacity-30 hover:border-opacity-70 text-gray-700 font-semibold transition-colors duration-200"
                                    onClick={handleCancelButton}
                                    disabled={isSaving} // Disable during saving
                                >
                                    Cancel
                                </button>
                                <button
                                    className="w-full sm:w-40 h-10 bg-[#DB4444] text-white hover:bg-[#E07575] rounded-sm font-semibold transition-colors duration-200"
                                    onClick={handleSaveButton}
                                    disabled={isSaving} // Disable during saving
                                >
                                    {isSaving ? "Saving..." : "SAVE"} {/* Conditional text */}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );

}



export default EditAddress