import React, { useEffect, useState } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import Loader from '../../components/Loader'
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Country, State, City } from "country-state-city";
import { useDispatch } from 'react-redux';
import { saveAddress, setDefaultBillingAddress, setDefaultShippingAddress } from '../../slices/addressSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorModal from '../../components/modals/ErrorModal';
import axios from 'axios';

const CustomerForm = () => {
    const edit = false
    const view = false
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [showError,setShowError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [selectedGender, setSelectedGender] = useState("default")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [addressName, setAddressName] = useState("")
    const [addressPhoneNumber, setAddressPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [selectedCountry, setSelectedCountry] = useState("")
    const [selectedState, setSelectedState] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [checked, setChecked] = useState(false)
    const [verificationStatus, setVerificationStatus] = useState(false)
    const [blockedStatus, setBlockedStatus] = useState(false)
    const [backendAddresses,setBackendAddresses] = useState([])
    const [editAddress, setEditAddress] = useState(false)
    const [addressIndexToEdit, setAddressIndexToEdit] = useState(null);
    const [defaultAddressSet, setDefaultAddressSet] = useState(false)
    const handlePhoneChange = (value) => {
        setPhoneNumber(value);
    };
    const handleNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setFullName(value);
        }
    }
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const handleAddressNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setAddressName(value);
        }
    }
    const handleCardNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCardName(value);
        }
    }
    const handleAddressPhoneChange = (value) => {
        setAddressPhoneNumber(value);
    };
    const handleAddressButtonClick = () => {
        const allFieldsFilled =
            addressName !== "" &&
            addressPhoneNumber !== "" &&
            address !== "" &&
            selectedCountry !== "" &&
            selectedState !== "" &&
            selectedCity !== "";

        const validPhoneNumber = isValidPhoneNumber("+" + addressPhoneNumber);

        if (!validPhoneNumber) {
            setError("Please enter a valid phone number.");
            return;
        }

        if (!allFieldsFilled) {
            setError(
                addressName === ""
                    ? "Please fill name in address fields"
                    : addressPhoneNumber === ""
                        ? "Please fill phone number in address fields"
                        : address === ""
                            ? "Please fill the address"
                            : selectedCountry === ""
                                ? "Please select the country"
                                : selectedState === ""
                                    ? "Please select province/state"
                                    : "Please select city"
            );
            return;
        }

        const newAddress = {
            name: addressName,
            phoneNumber: addressPhoneNumber,
            address: address,
            country: Country.getCountryByCode(selectedCountry).name,
            province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name,
            city: selectedCity,
            defaultShippingBilling: checked,
        };

        if (editAddress) {
            setAddresses((prev) =>
                prev.map((addr, index) =>
                    index === addressIndexToEdit ? newAddress : addr
                )
            );
        } else {
            // Adding: Check for duplicates
            const addressExists = addresses.some((addr) => {
                return (
                    addr.name === addressName &&
                    addr.phoneNumber === addressPhoneNumber &&
                    addr.address === address &&
                    addr.country === selectedCountry &&
                    addr.province === selectedState &&
                    addr.city === selectedCity
                );
            });

            if (addressExists) {
                setError("This address already exists.");
                return;
            }
            setAddresses((prev) => [...prev, newAddress]);
        }
        defaultAddressSet && !editAddress ? null : setDefaultAddressSet(checked)

        setError("");
        setAddressName("");
        setAddressPhoneNumber("");
        setAddress("");
        setSelectedCountry("");
        setSelectedState("");
        setSelectedCity("");
        setChecked(false);
        setEditAddress(false);
        setAddressIndexToEdit(null);
        setShowAddress(false);
    };



    const handleRemoveAddress = (indexToRemove) => {
        setAddresses(prevAddresses => prevAddresses.filter((_, index) => index !== indexToRemove));
    };
    const handleEditAddress = (indexToEdit) => {
        const address = addresses[indexToEdit];
        setAddressName(address.name)
        setAddressPhoneNumber(address.phoneNumber)
        setAddress(address.address)
        const allCountries = Country.getAllCountries();
        const country = allCountries.find(c => c.name.toLowerCase() === address.country.toLowerCase());
        const countryCode = country ? country.isoCode : null;
        setSelectedCountry(countryCode)
        const allStates = State.getStatesOfCountry(countryCode);
        const state = allStates.find(s => s.name.toLowerCase() === address.state.toLowerCase());
        const stateCode = state ? state.isoCode : null;
        setSelectedState(stateCode)
        setSelectedCity(address.city)
        setChecked(address.defaultShippingBilling)
        setEditAddress(true)
        setAddressIndexToEdit(indexToEdit)
        setShowAddress(true)
    }

    const handleShowAddressClick = () => {
        if (editAddress && showAddress) {
            setAddressName("");
            setAddressPhoneNumber("");
            setAddress("");
            setSelectedCountry("");
            setSelectedState("");
            setSelectedCity("");
            setChecked(false);
            setEditAddress(false)
        }
        setShowAddress(!showAddress)
    }

    useEffect(() => {
        console.log(defaultAddressSet)
    }, [defaultAddressSet])
    const handleButtonClick = async () => {
        const allFieldsFilled =
            fullName !== "" &&
            email !== "" &&
            phoneNumber !== "" &&
            selectedGender !== "default"

        if (!allFieldsFilled) {
            setError(
                fullName === ""
                    ? "Please fill customer's name "
                    : phoneNumber === ""
                        ? "Please fill customer's phone number"
                        : email === ""
                            ? "Please fill customer's email"
                            : "Please select customer's gender"

            );
            return;
        }

        const validPhoneNumber = isValidPhoneNumber("+" + phoneNumber);

        if (!validPhoneNumber) {
            setError("Please enter a valid phone number.");
            return;
        }

        const validEmail = validateEmail(email);

        if (!validEmail) {
            setError("Please enter a valid email.");
            return;
        }
        let defaultAddressId = null;
        setLoading(true)
        if (addresses.length > 0) {
            for (const addr of addresses) {
                try {
                    const { addressID } = await dispatch(saveAddress(addr)).unwrap();
                    if(addr.defaultShippingBilling){
                        defaultAddressId=addressID
                    }
                    setBackendAddresses((prev)=>[...prev,addressID])
                } catch (err) {
                    setLoading(false)
                    setShowError(true)
                }finally{
                }
            }
        }
        const customerPayload = {
            name: fullName,
            email: email,
            phoneNumber: phoneNumber,
            gender: selectedGender,
            ...(backendAddresses.length > 0 && { addresses: backendAddresses }),
            ...(defaultAddressId&&{defaultShippingAddress:defaultAddressId}),
            ...(defaultAddressId&&{defaultBillingAddress:defaultAddressId}),
          };
        try {
            const res = await axios.post("http://localhost:8080/api/v1/users/add-customer",customerPayload,{withCredentials:true})
            setLoading(false)
            navigate("/admin/customers")
        } catch (error) {
            setLoading(false)
            setShowError(true)
        }

    }

    const onCloseModal = () => {
        setShowError(false);
        window.location.reload()
    };
    return (
        <div>
            {loading && <Loader />}
            {showError && <ErrorModal message={"Something went wrong. Please try again"} btnMessage={"Retry"} onClose={onCloseModal}/>}
            <div className={`${loading || showError ? "hidden" : "flex"}`}>
                <AdminSidebar pageName={"customer-form"} />
                <div className="flex-1 p-4">
                    <h1 className="text-[36px] font-bold">{edit ? "Edit" : view ? "View" : "Add New"} Customer {view ? "Details" : ""}</h1>
                    <p className={`${error != "" ? "" : "invisible"} text-[#DB4444] my-[5px]`}>{error}</p>
                    <div className="form flex flex-col gap-[1rem]">
                        <div className="flex gap-[2rem]">
                            <div className="fullName flex flex-col w-[23rem]">
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="fullName">Full Name<span className={`${view ? "hidden" : ""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                <input id="fullName" type="text" value={fullName} onChange={handleNameChange} readOnly={view ? true : false} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                            </div>
                            <div className="email flex flex-col w-[23rem] ">
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="email">Email<span className={`${view ? "hidden" : ""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                <input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={view ? true : false} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " />
                            </div>
                        </div>
                        <div className="flex gap-[2rem]">
                            <div className="phoneNumber flex flex-col">
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="phoneNumber">Phone Number<span className={`${view ? "hidden" : ""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                <PhoneInput value={phoneNumber} onChange={handlePhoneChange} inputStyle={{ width: "23rem", height: "40px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", }} />
                            </div>
                            <div className="gender flex flex-col">
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="gender">Gender<span className={`${view ? "hidden" : ""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                <select id="gender" className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                                    <option value="default" disabled hidden>Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                        </div>
                        <div className="addresses flex flex-col gap-[0.3rem] ">
                            <label className="text-[#A6A6A6] font-[500]" htmlFor="addresses">Addresses</label>
                            <table className={` border shadow-lg rounded-md ${addresses.length > 0 ? "" : "hidden"}`}>
                                <thead className='border'>
                                    <tr>
                                        <th>Full name</th>
                                        <th>Phone number</th>
                                        <th>Address</th>
                                        <th>Country</th>
                                        <th>Province</th>
                                        <th>City</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addresses.length > 0 && addresses.map((addr, index) => (
                                        <tr key={index}>
                                            <td className="py-[0.6rem] text-center">{addr.name}</td>
                                            <td>+{addr.phoneNumber}</td>
                                            <td className="text-center">{addr.address}</td>
                                            <td>{addr.country}</td>
                                            <td>{addr.province}</td>
                                            <td>{addr.city}</td>
                                            <td className="text-center text-[10px]">{addr.defaultShippingBilling ? "Default Billing & Shipping Address" : ""}</td>
                                            <td className="text-center p-2 flex gap-2">{<button className={`bg-amber-400 hover:bg-amber-500 text-white rounded-md h-max w-max cursor-pointer py-2 px-4 ${view ? "hidden" : ""}`} onClick={() => handleEditAddress(index)}>Edit</button>}{<button className={`bg-[#DB4444] text-white rounded-md h-max w-max cursor-pointer hover:bg-[#E07575] py-2 px-4 ${view ? "hidden" : ""}`} onClick={() => handleRemoveAddress(index)}>Cancel</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex items-center mt-2">
                                <button className={`${view ? "hidden" : ""} border px-3 py-1 rounded text-sm w-max h-max hover:border-black hover:border-opacity-45 ease-in-out transition duration-500`} onClick={handleShowAddressClick}>
                                    {showAddress ? "Cancel" : "Add Address"}
                                </button>
                                {showAddress &&
                                    <div className="ml-4 flex flex-col gap-2">
                                        <div className="row-1 flex gap-2">
                                            <div className="flex flex-col">
                                                <label className="text-[#A6A6A6] font-[500]" htmlFor="addressName">Full Name<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                                <input type="text" value={addressName} id="addressName" onChange={handleAddressNameChange} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] w-[19.25rem]" />
                                            </div>
                                            <div className="phoneNumber flex flex-col">
                                                <label className="text-[#A6A6A6] font-[500]" htmlFor="phoneNumber">Phone Number<span className={`${view ? "hidden" : ""} text-[#DB4444] ml-[2px]`}>*</span></label>
                                                <PhoneInput value={addressPhoneNumber} onChange={handleAddressPhoneChange} inputStyle={{ width: "15rem", height: "40px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", }} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[#A6A6A6] font-[500]" htmlFor="address">Address<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                                <input type="text" value={address} id="address" onChange={(e) => setAddress(e.target.value)} className="rounded-lg border border-[#CCC] py-[8px] px-[15px] w-[16rem] " />
                                            </div>
                                        </div>
                                        <div className="row-2 flex gap-2">
                                            <div className="flex flex-col">
                                                <label className="text-[#A6A6A6] font-[500]" htmlFor="country">Country<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                                <select name="country" id="country" className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                                                    <option value="" disabled hidden>Select Your Country</option>
                                                    {Country.getAllCountries().map((country) => (
                                                        <option key={country.isoCode} value={country.isoCode}>
                                                            {country.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[#A6A6A6] font-[500]" htmlFor="province">Province<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                                <select name="province" id="province" className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " disabled={selectedCountry == "" ? true : false} onChange={(e) => setSelectedState(e.target.value)} value={selectedState}>
                                                    <option value="" disabled hidden>Select Your Province/Region</option>
                                                    {State.getStatesOfCountry(selectedCountry).map((state) => (
                                                        <option key={state.isoCode} value={state.isoCode}>
                                                            {state.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-[#A6A6A6] font-[500]" htmlFor="city">City<span className="text-[#DB4444] ml-[2px]">*</span></label>
                                                <select name="city" id="city" className="rounded-lg border border-[#CCC] py-[8px] px-[15px] " disabled={selectedState == "" ? true : false} onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity}>
                                                    <option value="" hidden disabled>Select Your City</option>
                                                    {City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
                                                        <option key={city.name} value={city.name}>
                                                            {city.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className={`${defaultAddressSet && !editAddress ? "hidden" : "flex"} flex-col gap-1`}>
                                            <label className="text-[#A6A6A6] font-[500] select-none" htmlFor="defaultAddress">Default Shipping & Billing Address</label>
                                            <div className="checkbox flex gap-[10px]" id='defaultAddress'>
                                                <div className={`w-[24px] h-[24px] border-[1.5px] ${checked ? "border-[#DB4444] bg-[#DB4444] p-[2px]" : "border-black"} border-opacity-40`} onClick={() => setChecked(!checked)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`${checked ? "" : "hidden"}w-4 h-4 text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </div>
                                                <span className="text-[16px] select-none" onClick={() => setChecked(!checked)}>Mark as default shipping & Billing Address</span>
                                            </div>
                                        </div>
                                        <button className="mt-5 bg-blue-500 text-white px-3 py-2 rounded h-max w-max hover:bg-blue-400 select-none" onClick={handleAddressButtonClick}>
                                            {editAddress ? "Update Address" : "Add This Address"}
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex gap-[2rem]">
                            <div className={`${edit?"flex":"hidden"} flex-col w-[23rem] `}>
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="fullName">Verification Status</label>
                                <button className={`${verificationStatus ? "bg-[#66c46a]" : "bg-[#DB4444]"} text-white rounded-3xl h-max w-max cursor-pointer py-2 px-4`}>{verificationStatus ? "Verified" : "Unverified"}</button>
                            </div>
                            <div className={`${edit?"flex":"hidden"} flex-col w-[23rem] `}>
                                <label className="text-[#A6A6A6] font-[500]" htmlFor="email">Blocked Status</label>
                                <button className={`${blockedStatus ? "bg-[#66c46a] hover:bg-[#8fd693]" : "bg-[#DB4444] hover:bg-[#E07575]"} text-white rounded-md h-max w-max cursor-pointer py-2 px-4`}>{blockedStatus ? "Unblock" : "Block"}</button>
                            </div>
                        </div>
                        <button className="bg-[#47b2ca] text-white p-[10px] rounded-full hover:bg-[#85bcca] w-[6.5rem] select-none" onClick={handleButtonClick}>
                            {edit ? "Save" : view ? "Edit" : "Submit"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomerForm
