import React, { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import BillingProductRow from "../components/BillingProductRow";
import { calculateCouponAmount, calculateSubtotal, calculateTotal } from "../functions/cartTotal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSuccessModal from "../components/modals/OrderSuccessModal";
import ErrorModal from "../components/modals/ErrorModal"
import BillingCardRow from "../components/BillingCardRow";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { applyCoupon, deleteBillingRecordByID, fetchBillingDetailsByID, getAppliedCoupon } from "../slices/billingSlice";
import { Country, State, City } from "country-state-city";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { processPayment } from "../slices/paymentSlice";
import { createOrder } from "../slices/orderSlice";
import { createSetupIntent, getCardByID, getDefaultCard, saveCard, setDefaultCard } from "../slices/cardSlice";
import { getAddressByID, getDefaultShippingAddress, saveAddress, setDefaultBillingAddress, setDefaultShippingAddress } from "../slices/addressSlice";
import ChangeAddressModal from "../components/modals/ChangeAddressModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import ChangeCardModal from "../components/modals/ChangeCardModal";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51QrdnnC82WimU32rhRV2qhtHQ8IAinPoxp2ru8X5J1W3AyDlIf7M9zm9tFdnceVITHu5Zw9gWt36FhjxqP2X8wNf00vqPlat2B")


const Billing = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useSelector(state => state.user)
    const [isCardSelected, setIsCardSelected] = useState(false)
    const [couponCode, setCouponCode] = useState("");
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState("")
    const [cardError, setCardError] = useState("")
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [checked, setChecked] = useState(false)
    const [cardChecked, setCardChecked] = useState(false)
    const [cardNameError, setCardNameError] = useState("")
    const [addressFieldsFilled, setAddressFieldsFilled] = useState(true)
    const [cardFieldsFilled, setCardFieldsFilled] = useState(true)
    const [cardName, setCardName] = useState("")
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()
    const [showChangeAddressModal, setShowChangeAddressModal] = useState(false)
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [shippingAddress, setShippingAddress] = useState(null);
    const [showChangeCardModal, setShowChangeCardModal] = useState(false);



    const { billingItem, loading: billingLoading, error: billingError, coupon } = useSelector(state => state.billing)
    const { loading: paymentLoading, error: paymentError } = useSelector(state => state.payment)
    const { loading: orderLoading, error: orderError } = useSelector(state => state.order)
    const { defaultShippingAddress } = useSelector(state => state.address)

    const { defaultCard } = useSelector(state => state.card)
    const [total, setTotal] = useState(0)
    const buyNow = searchParams.has("buyNow") ? searchParams.get("buyNow") : null
    const proceedToCheckout = searchParams.has("proceedToCheckout") ? searchParams.get("proceedToCheckout") : null
    const billingID = searchParams.get("billingID")
    const [loading, setLoading] = useState()
    const [card, setCard] = useState(null)
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [showError, setShowError] = useState(false);

    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };
    const handleCardNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCardName(value);
        }
    }
    useEffect(() => {
        if (!user) {
            const from = location.pathname + location.search;
            navigate("/login", { state: { from: from } })
        }
        if (!buyNow && !proceedToCheckout) {
            navigate("/")
        }
    }, [buyNow, proceedToCheckout, user])

    useEffect(() => {
        setLoading(true);
        dispatch(fetchBillingDetailsByID({ billingID }))
            .then(() => {
                dispatch(getAppliedCoupon({ billingID: billingID }))
                dispatch(getDefaultCard())
                dispatch(getDefaultShippingAddress())
                setLoading(false)
            })
            .catch(() => setLoading(false));
    }, [dispatch])


    useEffect(() => {
        if (billingItem) {
            const subTotalCal = calculateSubtotal(billingItem.items);
            const couponDiscountCal = coupon ? (coupon?.discountType === "fixed" ? calculateCouponAmount(coupon) : calculateCouponAmount(coupon, subTotalCal)) : 0;
            const totalCal = subTotalCal - couponDiscountCal

            setSubTotal(subTotalCal)
            setCouponDiscount(couponDiscountCal)
            setTotal(totalCal)
        }

    }, [billingItem, coupon])

    useEffect(() => {
        if (defaultCard) {
            setCard(defaultCard)
        }
    }, [defaultCard])

    useEffect(() => {
        if (location?.state?.addressID) {
            const addressID = location.state.addressID
            dispatch(getAddressByID({ addressID }))
                .then((address) => {
                    const fetchedShippingAddress = address.payload;
                    typeof fetchedShippingAddress !== "object" ? setShippingAddress(defaultShippingAddress) : setShippingAddress(fetchedShippingAddress);
                })
                .catch((error) => console.log(error));
        } else if (defaultShippingAddress) {
            setShippingAddress(defaultShippingAddress)
        }
    }, [location, defaultShippingAddress, dispatch])



    const handleCouponClick = async () => {
        if (couponCode == "") {
            toast.error("No coupon code applied")
            return
        }
        try {
            await dispatch(applyCoupon({ billingID: billingID, couponCode: couponCode })).unwrap()
            await dispatch(getAppliedCoupon({ billingID })).unwrap()
            toast.success("Coupon applied successfully")
            setCouponCode("")
        } catch (error) {
            toast.error(billingError)
            setCouponCode("")
        }
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        navigate("/")
    }

    const handleAddressChange = (e) => {
        setAddress(e.target.value)
    }

    const placeOrder = async () => {
        const areAddressFieldsFilled = user?.defaultShippingAddress == null
            ? (name !== "" && phoneNumber != "" && address !== "" && selectedCountry !== null && selectedState !== null && selectedCity !== null)
            : true;

        const areCardFieldsFilled = isCardSelected && !user?.defaultCard ? cardFieldsFilled && cardName != "" : true;
        setAddressFieldsFilled(areAddressFieldsFilled && isValidPhoneNumber("+" + phoneNumber));
        setCardFieldsFilled(areCardFieldsFilled);

        if (areAddressFieldsFilled && areCardFieldsFilled) {
            let transactionId = "COD_PAYMENT";

            if (isCardSelected) {
                if (!user?.defaultCard) {
                    if (!stripe || !elements) {
                        alert("Stripe or elements has not been loaded yet.");
                        return;
                    }
                    setIsProcessing(true);
                    const cardElement = elements.getElement(CardElement);

                    try {
                        const { error, paymentMethod } = await stripe.createPaymentMethod({
                            type: "card",
                            card: cardElement,
                            billing_details: {
                                name: cardName,
                            },
                        });

                        if (error) {
                            console.error(error.message);
                            alert("Failed to create payment method. Please try again.");
                            setIsProcessing(false);
                            return;
                        }

                        const paymentResponse = await dispatch(processPayment({
                            amount: total * 100,
                            currency: "usd",
                            paymentMethodId: paymentMethod.id
                        })).unwrap();

                        if (paymentResponse.error) {
                            console.error(paymentResponse.error);
                            alert("Payment processing failed. Please try again.");
                            setIsProcessing(false);
                            return;
                        }

                        transactionId = paymentResponse.transactionId;
                        if (cardChecked) {
                            await handleSaveCard()
                        }
                    } catch (err) {
                        setShowError(true)
                        setIsProcessing(false);
                        return;
                    }
                } else {
                    transactionId = card.id
                }
            }
            if (checked) {
                await handleSaveAddress()

            }
            const order = {
                orderId: Date.now().toString() + Math.floor(100000 + Math.random() * 900000).toString(),
                products: billingItem.items.map(item => ({
                    productId: item.product._id,
                    name: item.product.title,
                    image: item.product.mainImage,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    price: item.product.price,
                    discount: item.product.discount
                })),
                couponCode: coupon != null ? coupon?.code : null,
                couponDiscountAmount: couponDiscount,
                subtotal: subTotal,
                shippingFee: 0,
                totalAmount: total,
                paymentMethod: isCardSelected ? "card" : "cod",
                transactionId: transactionId,
                shippingAddress: shippingAddress != null ? shippingAddress : {
                    name: name,
                    phoneNumber: phoneNumber,
                    address: address,
                    country: Country.getCountryByCode(selectedCountry).name,
                    province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name,
                    city: selectedCity
                }
            }
            try {
                const res = await axios.post("http://localhost:8080/api/v1/orders/place-order", order, { withCredentials: true })
                await dispatch(deleteBillingRecordByID({ billingID: billingID })).unwrap()
                setIsModalOpen(!isModalOpen)
            } catch (error) {
                if (error.response?.status === 500) {
                    setShowError(true);
                } else if (error.response?.status === 401) {
                    try {
                        await dispatch(refreshAccessToken()).unwrap();
                        const retryRes = await axios.post("http://localhost:8080/api/v1/orders/place-order", order, { withCredentials: true });
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                }
            } finally {
                setIsProcessing(false)
            }
        }
    };


    const handleCardElementChange = (e) => {
        e.error ? setCardError(e.error.message) : setCardError("")
        setCardFieldsFilled(e.complete)
    }

    const handleCardNameBlur = (e) => {
        if (e.target.value == "") {
            setCardNameError("Invalid Name")
        }
    }

    const handleSaveCard = async () => {
        if (!stripe || !elements) return;

        try {
            const response = await dispatch(createSetupIntent({ name: cardName })).unwrap();

            if (!response || !response.clientSecret) {
                throw new Error("Client Secret is missing in API response");
            }

            const { clientSecret } = response;

            const cardSetupResponse = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: cardName }
                }
            });

            if (cardSetupResponse.error) {
                console.error("Error saving card:", cardSetupResponse.error.message);
            } else {
                const paymentMethodId = cardSetupResponse.setupIntent.payment_method
                await dispatch(saveCard({ paymentMethodId })).unwrap()
                await dispatch(setDefaultCard({ paymentMethodId })).unwrap()
            }
        } catch (error) {
            console.error("Failed to save card:", error);
        }
    };

    const handleSaveAddress = async () => {
        try {
            const { addressID } = await dispatch(saveAddress({ name: name, phoneNumber: phoneNumber, address, city: selectedCity, province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name, country: Country.getCountryByCode(selectedCountry).name })).unwrap()
            await dispatch(setDefaultBillingAddress({ addressID })).unwrap()
            await dispatch(setDefaultShippingAddress({ addressID })).unwrap()
        } catch (error) {
            console.error("Failed to save address:", error);
        }
    }

    const handleAddresChangeButton = () => {
        setShowChangeAddressModal(true);
    }

    const handlePhoneChange = (value) => {
        setPhoneNumber(value);
    };
    const handleNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setName(value);
        }
    }
    const handleSaveButton = async (addressID) => {
        const response = await dispatch(getAddressByID({ addressID })).unwrap()
        setShippingAddress(response)
        setShowChangeAddressModal(!showChangeAddressModal);
    }

    const handleCancelButton = () => {
        setShowChangeAddressModal(!showChangeAddressModal)
    }

    const handleOnChangeClick = () => {
        setShowChangeCardModal(!showChangeCardModal);
    }

    const handleCardModalCancel = () => {
        setShowChangeCardModal(!showChangeCardModal)
    }

    const onCloseModal = () => {
        setShowError(false);
        navigate(location.pathname + location.search);
    };

    const handleCardModalSave = async (cardID) => {
        const response = await dispatch(getCardByID({ cardID })).unwrap()
        setCard(response)
        setShowChangeCardModal(!showChangeCardModal)

    }

    return (
        <div className="min-h-[320px]">
            {(loading || billingLoading || paymentLoading || orderLoading) && <Loader />}
            <div className={`${loading || billingLoading || paymentLoading || orderLoading ? "hidden" : ""}`}>
                {showError && (
                    <ErrorModal
                        message="Something went wrong! Please try again"
                        btnMessage="Retry"
                        onClose={onCloseModal}
                    />
                )}
                {/* Breadcrumbs */}
                <div className="nav w-[1156px] h-[21px]  my-[34px] mx-auto">
                    <Link to="/" className="text-[#605f5f] text-[14px] hover:text-black">Home</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="/cart" className="text-[#605f5f] text-[14px] hover:text-black">Cart</Link><span className="m-[11px] text-[14px] text-[#605f5f]">/</span><Link to="#" className="text-[14px]">CheckOut</Link>
                </div>
                {/* Breadcrumbs Ends Here*/}
                {/* Billing */}
                <section className={`billing w-[1170px] mx-auto mb-[120px] ${(billingItem === null) ? "hidden" : "flex"} flex-col`}>
                    <h2 className="text-[36px] my-[17px]">Billing Details</h2>
                    {/* Inner Billing Box */}
                    <div className="inner-box flex gap-[173px] ">
                        <div className="col-1 flex flex-col ">
                            {/* Shipping Address */}
                            <div className={`shipping w-[470px] ${shippingAddress ? "flex" : "hidden"}  flex flex-col gap-[9px] `}>
                                {/* Address */}
                                <div className="address py-[5px] px-[13px] shadow">
                                    <h4 className="text-[23px] mb-[9px]">Shipping address</h4>
                                    <h6 className="text-[19px]">{shippingAddress && shippingAddress.name}</h6>
                                    <p className="house-no-street text-[13px]">{shippingAddress && shippingAddress.address}</p>
                                    <p className="city-state-country text-[13px]">{shippingAddress && shippingAddress.city},{shippingAddress && shippingAddress.province} {shippingAddress && shippingAddress.country}</p>
                                </div>
                                {showChangeAddressModal && <ChangeAddressModal defaultAddress={shippingAddress._id} onSave={handleSaveButton} onCancel={handleCancelButton} />}
                                {/* Address Ends Here */}
                                <div className="change ">
                                    <button className="text-[#DB4444] hover:text-[#d88888] relative left-[398px] bottom-[74px]" onClick={handleAddresChangeButton}>CHANGE</button>
                                </div>
                            </div>
                            {/* Shipping Address Ends Here*/}
                            {/* Products */}
                            <table className={`${shippingAddress ? "flex flex-col" : "hidden"}`}>
                                <thead className="mb-[7px] w-[470px] h-[53px] flex items-center shadow ">
                                    <tr className="h-[24px] w-[470px] px-[8px] flex justify-between">
                                        <td className="font-normal">Product</td>
                                        <td className="font-normal">Price</td>
                                        <td className="font-normal">Quantity</td>
                                    </tr>
                                </thead>
                                <tbody className="flex flex-col w-[470px]">
                                    {billingItem && billingItem.items.map((item) => (
                                        <BillingProductRow
                                            key={item?._id}
                                            product={item.product}
                                            quantity={item?.quantity}
                                            color={item?.color}
                                            size={item?.size}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            <div className={`address-info ${!shippingAddress ? "" : "hidden"} w-[470px] h-[814px] flex flex-col gap-[32px]`}>
                                <p className={`text-[13px] text-[#DB4444] ${!addressFieldsFilled || !isValidPhoneNumber("+" + phoneNumber) ? "" : "invisible"}`}>{!isValidPhoneNumber("+" + phoneNumber) ? "Please fill valid phone number" : "Please fill out all details"}</p>
                                <div className="name">
                                    <label htmlFor="name" className="text-[16px] text-[#B4B4B4]">Full Name</label>
                                    <input type="text" id="name" className="w-[470px] h-[50px] bg-[#F5F5F5] outline-none px-[9px] py-[7px]" value={name} onChange={handleNameChange} />
                                </div>
                                <div className="phone-number">
                                    <label htmlFor="phone-number" className="text-[16px] text-[#B4B4B4]">Phone Number</label>
                                    <PhoneInput value={phoneNumber} onChange={handlePhoneChange} inputStyle={{ width: "470px", height: "50px", background: "#F5F5F5", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc", }} containerStyle={{ marginTop: "10px" }} />
                                </div>
                                <div className="address">
                                    <label htmlFor="address" className="text-[16px] text-[#B4B4B4]">Address <span className="text-[#DB4444]">*</span></label>
                                    <input type="text" id="address" className="w-[470px] h-[50px] bg-[#F5F5F5] outline-none px-[9px] py-[7px]" placeholder="Enter your address" value={address} onChange={handleAddressChange} />
                                </div>
                                <div className="country">
                                    <label htmlFor="country" className="text-[16px] text-[#B4B4B4] mb-1">Country  <span className="text-[#DB4444]">*</span></label>
                                    <select name="country" id="country" className="w-[470px] h-[50px] px-[10px] bg-[#F5F5F5] focus:outline-none" onChange={(e) => setSelectedCountry(e.target.value)} defaultValue="select your country" >
                                        <option value="select your country" disabled hidden>Select Your Country</option>
                                        {Country.getAllCountries().map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="province">
                                    <label htmlFor="province" className="text-[16px] text-[#B4B4B4] mb-1">Province/ Region  <span className="text-[#DB4444]">*</span></label>
                                    <select name="province" id="province" className="w-[470px] h-[50px] px-[10px] bg-[#F5F5F5] focus:outline-none" disabled={selectedCountry == null ? true : false} onChange={(e) => setSelectedState(e.target.value)} defaultValue="select your region">
                                        <option value="select your region" disabled hidden>Select Your Province/Region</option>
                                        {State.getStatesOfCountry(selectedCountry).map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="city">
                                    <label htmlFor="city" className="text-[16px] text-[#B4B4B4] mb-1">City  <span className="text-[#DB4444]">*</span></label>
                                    <select name="city" id="city" className="w-[470px] h-[50px] px-[10px] bg-[#F5F5F5] focus:outline-none" disabled={selectedState == null ? true : false} onChange={(e) => setSelectedCity(e.target.value)} defaultValue="select your city">
                                        <option value="select your city" hidden disabled>Select Your City</option>
                                        {City.getCitiesOfState(selectedCountry, selectedState).map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="checkbox flex gap-[10px]">
                                    <div className={`w-[24px] h-[24px] border-[1.5px] ${checked ? "border-[#DB4444] bg-[#DB4444] p-[2px]" : "border-black"} border-opacity-40`} onClick={() => setChecked(!checked)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`${checked ? "" : "hidden"}w-4 h-4 text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span className="text-[16px] select-none" >Save this information for faster check-out next time</span>
                                </div>
                            </div>
                        </div>
                        <div className="billing-details w-[527px] flex flex-col gap-[32px]">
                            <table className={`${!shippingAddress ? "" : "hidden"}`}>
                                <thead className="mb-[7px] w-[422px] h-[53px] flex items-center shadow ">
                                    <tr className="h-[24px] w-[422px] px-[8px] flex justify-between">
                                        <td className="font-normal">Product</td>
                                        <td className="font-normal">Price</td>
                                        <td className="font-normal">Quantity</td>
                                    </tr>
                                </thead>
                                <tbody className="flex flex-col w-[425px]">
                                    {billingItem && billingItem.items.map((item) => (
                                        <BillingProductRow
                                            key={item?._id}
                                            product={item.product}
                                            quantity={item?.quantity}
                                            color={item?.color}
                                            size={item?.size}
                                            adjustWidth={true}
                                        />
                                    ))}
                                </tbody>
                            </table>
                            {/* Product Details */}
                            <div className="product-details w-[422px] flex flex-col gap-[12px]">
                                <div className="sub-total-shipping flex flex-col gap-[12px]">
                                    <div className="sub-total h-[24px] flex justify-between">
                                        <h6>Subtotal:</h6>
                                        {/* <span>${billingItem && calculateSubtotal(billingItem.items)}</span> */}
                                        <span>${subTotal}</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-black border-opacity-60" />
                                    <div className="shipping h-[24px] flex justify-between">
                                        <h6>Shipping</h6>
                                        <span>Free</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-black border-opacity-60" />
                                </div>

                                <div className={`coupon-discount h-[24px] ${coupon ? "flex" : "hidden"} justify-between`}>
                                    <h6>Coupon Discount <span className={`${!coupon ? "hidden" : ""} text-[#DB4444]`}>({coupon?.code})</span></h6>
                                    {/* <span className="text-[#DB4444]">-${billingItem && coupon ? ((coupon?.discountType === "fixed") ? calculateCouponAmount(coupon) : calculateCouponAmount(coupon, calculateSubtotal(billingItem.items))) : ""}</span> */}
                                    <span className="text-[#DB4444]">-${couponDiscount}</span>
                                </div>
                                <div className={`border-b-[1.5px] ${coupon ? "flex" : "hidden"} border-black border-opacity-60`} />
                                <div className="total h-[24px] flex justify-between">
                                    <h6>Total</h6>
                                    <span>${total}</span>
                                </div>
                            </div>
                            {/* Product Details Ends Here */}
                            {/* Payment Mode */}
                            <div className="payment-mode flex flex-col gap-[23px] ">
                                {/* Bank */}
                                <div className="bank w-[427px] h-[28px] flex items-center justify-between">
                                    <div className="label flex gap-[8px] items-center w-[80px] h-[24px] ">
                                        <input type="radio" name="payment-mode" id="bank" className="w-[24px] h-[24px] outline-none" onClick={() => setIsCardSelected(true)} /><span className="name">Bank</span>
                                    </div>
                                    <div className="card w-[142px] h-[28px] flex gap-[8px]">
                                        <div className="card w-[42px] h-[28px] flex items-center justify-center">
                                            <img src="/images/visa.png" alt="visa" />
                                        </div>
                                        <div className="card w-[42px] h-[28px] flex items-center justify-center">
                                            <img src="/images/master-card.png" alt="master-card" />
                                        </div>
                                        <div className="card w-[42px] h-[28px] flex items-center justify-center">
                                            <img src="/images/union-pay.png" alt="e-payment" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-[427px] ${isCardSelected ? "flex" : "hidden"} `}>
                                    <div className={`${!user?.defaultCard ? "" : "hidden"} gap-[15px] flex flex-col justify-between`}>
                                        <p className={`text-[13px] text-[#DB4444] ${!cardFieldsFilled ? "" : "hidden"}`}>{cardError != "" ? cardError : "Please fill out all card details"}</p>
                                        <div className="cardName h-[74px]">
                                            <label htmlFor="cardName" className="text-[16px] text-[#B4B4B4]">Card Holder's Name <span className="text-[#DB4444]">*</span></label>
                                            <input type="text" id="cardName" className="w-[427px] h-[50px] bg-[#F5F5F5] outline-none px-[9px] py-[7px]" autoComplete="off" value={cardName} onFocus={() => setCardNameError("")} onChange={handleCardNameChange} onBlur={handleCardNameBlur} />
                                            <span className={`block left-[400px] bottom-[35px] w-[21px] ${cardNameError == "" ? "hidden" : "relative"}`} title={cardNameError}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                                        </div>
                                        <div className="w-[427px] h-[24px] flex flex-col justify-center">
                                            <CardElement id="cardElement" options={{ hidePostalCode: true }} onChange={handleCardElementChange} />
                                        </div>
                                        <div className="card-checkbox flex gap-[10px]">
                                            <div className={`w-[24px] h-[24px] border-[1.5px] ${cardChecked ? "border-[#DB4444] bg-[#DB4444] p-[2px]" : "border-black"} border-opacity-40`} onClick={() => setCardChecked(!cardChecked)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`${cardChecked ? "" : "hidden"}w-4 h-4 text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                            <span className="text-[16px] select-none">Save card</span>
                                        </div>
                                    </div>
                                    <table className={`${user?.defaultCard ? "" : "hidden"}`}>
                                        <thead className=" w-[427px] h-[50px] flex items-center shadow">
                                            <tr className="w-[400px] mx-auto flex ">
                                                <th className="font-normal w-[180px] text-left">Card Number</th>
                                                <th className="font-normal w-[133px] text-left">Expiry Date</th>
                                                <th />
                                            </tr>
                                        </thead>
                                        <tbody className="flex flex-col w-[427px]">
                                            <BillingCardRow card={card} onChange={handleOnChangeClick} />
                                        </tbody>

                                    </table>
                                </div>
                                {/* Bank Ends Here*/}

                                {showChangeCardModal && (
                                    <Elements stripe={stripePromise}>
                                        <ChangeCardModal defaultCard={card.id} onCancel={handleCardModalCancel} onSave={handleCardModalSave} />
                                    </Elements>
                                )}

                                {/* Cash */}
                                <div className="cash flex gap-[8px] items-center w-[174px] h-[24px] ">
                                    <input type="radio" name="payment-mode" defaultChecked={true} id="cash" className="w-[24px] h-[24px] outline-none" onClick={() => setIsCardSelected(false)} /><span className="name">Cash on delivery</span>
                                </div>
                                {/* Cash Ends Here*/}
                            </div>
                            {/* Payment Mode Ends Here*/}
                            {/* Coupon */}
                            <div className="coupon w-[527px] h-[56px] flex">
                                <div className="coupon-code w-[300px] h-[56px]">
                                    <input type="text" className="w-[300px] h-[56px] focus:outline-none px-[14px] border-[1.5px] border-black" placeholder="Coupon Code" onChange={handleCouponChange} value={couponCode} />
                                </div>
                                <button className="btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm" onClick={handleCouponClick}>Apply Coupon</button>
                            </div>
                            {/* Coupon Ends Here */}
                            {isModalOpen && <OrderSuccessModal onClose={handleCloseModal} />}
                            <div className="btn w-[422px] ">
                                <button className="btn-1 max-w-[190px] h-[56px]" onClick={placeOrder}>Place Order</button>
                            </div>
                        </div>
                    </div>
                    {/* Inner Billing Box Ends Here */}
                </section>
                {/* Billing Ends Here*/}
                <div className={`${!billingItem || billingError ? "flex" : "hidden"} flex-col mt-[85px]`}>
                    <p className="text-center text-[#757575]">{billingError == "Requested resource not found" || billingItem == null ? "Invalid or expired Billing ID" : "No item selected for Billing"}</p>
                    <Link to="/" className="text-center">
                        <button className="btn-1 max-w-[211px] w-[211px] h-[56px] rounded-sm mt-[25px]">Continue Shopping</button>
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default Billing
