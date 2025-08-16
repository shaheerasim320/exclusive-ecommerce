import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BillingProductRow from "../components/BillingProductRow";
import { calculateCouponAmount, calculateSubtotal } from "../functions/cartTotal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderSuccessModal from "../components/modals/OrderSuccessModal";
import ErrorModal from "../components/modals/ErrorModal";
import BillingCardRow from "../components/BillingCardRow";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { Country, State, City } from "country-state-city";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getCardByID, getDefaultCard, saveCard, setDefaultCard, getSavedCards } from "../slices/cardSlice";
import { getAddressByID, getDefaultShippingAddress, saveAddress, setDefaultBillingAddress, setDefaultShippingAddress, getSavedAddresses } from "../slices/addressSlice";
import ChangeAddressModal from "../components/modals/ChangeAddressModal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import ChangeCardModal from "../components/modals/ChangeCardModal";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import api from "../api/axiosInstance";
import { getPlacedOrders } from "../slices/orderSlice";

const stripePromise = loadStripe("pk_test_51QrdnnC82WimU32rhRV2qhtHQ8IAinPoxp2ru8X5J1W3AyDlIf7M9zm9tFdnceVITHu5Zw9gWt36FhjxqP2X8wNf00vqPlat2B");

const Billing = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useSelector(state => state.auth);
    const [isCardSelected, setIsCardSelected] = useState(false);
    const [cardComplete, setCardComplete] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [cardError, setCardError] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [checked, setChecked] = useState(false);
    const [cardChecked, setCardChecked] = useState(false);
    const [cardName, setCardName] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [showChangeAddressModal, setShowChangeAddressModal] = useState(false);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [shippingAddress, setShippingAddress] = useState(null);
    const [showChangeCardModal, setShowChangeCardModal] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const { loading: orderLoading, error: orderError } = useSelector(state => state.order);
    const { defaultShippingAddress, savedAddresses } = useSelector(state => state.address);
    const { defaultCard } = useSelector(state => state.card);
    const [total, setTotal] = useState(0);
    const buyNow = searchParams.has("buyNow") ? searchParams.get("buyNow") : null;
    const proceedToCheckout = searchParams.has("proceedToCheckout") ? searchParams.get("proceedToCheckout") : null;
    const billingID = searchParams.get("billingID");
    const [loading, setLoading] = useState(false);
    const [card, setCard] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [showError, setShowError] = useState(false);
    const [billingItem, setBillingItem] = useState(null);
    const [coupon, setCoupon] = useState(null);
    const validateFields = () => {
        const errors = {};

        if (!shippingAddress) {
            if (!name.trim()) errors.name = "Full name is required";
            if (!phoneNumber || !isValidPhoneNumber("+" + phoneNumber)) errors.phone = "Valid phone number is required";
            if (!address.trim()) errors.address = "Address is required";
            if (!selectedCountry) errors.country = "Country is required";
            if (!selectedState) errors.state = "State/Province is required";
            if (!selectedCity) errors.city = "City is required";
        }

        if (isCardSelected && !defaultCard) {
            if (!cardName.trim()) errors.cardName = "Card holder's name is required";
            if (!cardComplete) errors.cardFields = "Complete card details are required";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCouponChange = (e) => {
        setCouponCode(e.target.value);
    };

    const handleCardNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCardName(value);
            setFieldErrors(prev => ({ ...prev, cardName: '' }));
        }
    };

    useEffect(() => {
        if (!user) {
            const from = location.pathname + location.search;
            navigate("/login", { state: { from } });
            return;
        }

        const loadBillingData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/billing/fetchBillingDetailsByID/${billingID}`);
                if (res.status === 200) {
                    setBillingItem(res.data.items);
                    setCoupon(res.data.coupon);
                }
            } catch (error) {
                setShowError(true);
            } finally {
                setLoading(false);
            }
        };

        loadBillingData();
    }, [dispatch, billingID, buyNow, proceedToCheckout, user, navigate, location]);

    useEffect(() => {
        if (billingItem) {
            const subTotalCal = calculateSubtotal(billingItem);
            const couponDiscountCal = coupon ?
                (coupon.discountType === "fixed" ?
                    calculateCouponAmount(coupon) :
                    calculateCouponAmount(coupon, subTotalCal)
                ) : 0;
            setSubTotal(subTotalCal);
            setCouponDiscount(couponDiscountCal);
            setTotal(subTotalCal - couponDiscountCal);
        }
    }, [billingItem, coupon]);

    useEffect(() => {
        if (defaultCard) {
            setCard(defaultCard);
        }
    }, [defaultCard]);

    useEffect(() => {
        if (location?.state?.addressID) {
            dispatch(getAddressByID({ addressID: location.state.addressID }))
                .then((address) => {
                    const fetchedShippingAddress = address.payload;
                    if (typeof fetchedShippingAddress === "object") {
                        setShippingAddress(fetchedShippingAddress);
                    } else {
                        setShippingAddress(defaultShippingAddress);
                    }
                })
                .catch((error) => {
                    setShippingAddress(defaultShippingAddress);
                });
        } else if (defaultShippingAddress) {
            setShippingAddress(defaultShippingAddress);
        }
    }, [location, defaultShippingAddress, dispatch]);

    const handleCouponClick = async () => {
        if (!couponCode.trim()) {
            toast.error("Please enter a coupon code");
            return;
        }
        try {
            const res = await api.post("/billing/apply-coupon", { billingID, couponCode });
            if (res.status === 200) {
                setCoupon(res.data.coupon);
                toast.success("Coupon applied successfully");
                setCouponCode("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply coupon");
            setCouponCode("");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        navigate("/");
    };
    const handleAddressChange = (e) => {
        setAddress(e.target.value);
        setFieldErrors(prev => ({ ...prev, address: '' }));
    };

    const placeOrder = async () => {
        if (!stripe || !elements) {
            toast.error("Payment system is not loaded. Please try again.");
            return;
        }
        if (!validateFields()) {
            toast.error("Please fill all required fields correctly");
            return;
        }
        setIsProcessing(true);
        let transactionId = "COD_PAYMENT";

        try {
            if (isCardSelected && !defaultCard) {
                if (!stripe || !elements) {
                    toast.error("Payment system not loaded");
                    setIsProcessing(false);
                    return;
                }

                const cardElement = elements.getElement(CardElement);
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
                    billing_details: { name: cardName },
                });

                if (error) {
                    toast.error(error.message);
                    setIsProcessing(false);
                    return;
                }

                const paymentResponse = await api.post("/payment/process-payment", {
                    amount: total * 100,
                    currency: "usd",
                    paymentMethodId: paymentMethod.id
                });

                if (paymentResponse.data.error) {
                    toast.error("Payment processing failed");
                    setIsProcessing(false);
                    return;
                }

                transactionId = paymentResponse.data.transactionId;
                if (cardChecked) {
                    await handleSaveCard();
                }
            } else if (isCardSelected && defaultCard) {
                transactionId = card.id;
            }

            if (checked && !shippingAddress) {
                await handleSaveAddress();
            }

            const order = {
                orderId: Date.now().toString() + Math.floor(100000 + Math.random() * 900000).toString(),
                products: billingItem.map(item => ({
                    productId: item.product._id,
                    name: item.product.title,
                    image: item.product.mainImage,
                    quantity: item.quantity,
                    color: item.color,
                    size: item.size,
                    price: item.product.price,
                    discount: item.product.discount
                })),
                couponCode: coupon?.code || null,
                couponDiscountAmount: couponDiscount,
                subtotal: subTotal,
                shippingFee: 0,
                totalAmount: total,
                paymentMethod: isCardSelected ? "card" : "cod",
                transactionId,
                shippingAddress: shippingAddress || {
                    name,
                    phoneNumber,
                    address,
                    country: Country.getCountryByCode(selectedCountry).name,
                    province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name,
                    city: selectedCity
                }
            };

            const res = await api.post("/orders/place-order", order);
            if (res.status === 201) {
                await api.delete(`/billing/delete-billing-by-id/${billingID}`);
                await dispatch(getPlacedOrders()).unwrap()
                setIsModalOpen(true);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to place order");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCardElementChange = (e) => {
        setCardError(e.error ? e.error.message : "");
        setCardComplete(e.complete);
        setFieldErrors(prev => ({ ...prev, cardFields: e.error ? e.error.message : e.complete ? '' : 'Complete card details are required' }));
    };

    const handleSaveCard = async () => {
        if (!stripe || !elements) return;
        try {
            const response = await api.post("/card/create-setup-intent", { name: cardName });
            if (!response.data.clientSecret) {
                throw new Error("Client Secret is missing");
            }

            const { clientSecret } = response.data;
            const cardSetupResponse = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: cardName }
                }
            });

            if (cardSetupResponse.error) {
                toast.error(cardSetupResponse.error.message);
                return;
            }

            const paymentMethodId = cardSetupResponse.setupIntent.payment_method;
            const savedCard = await dispatch(saveCard({ paymentMethodId })).unwrap();
            await dispatch(setDefaultCard({ paymentMethodId })).unwrap();
            await dispatch(getSavedCards()).unwrap();
        } catch (error) {
            toast.error("Failed to save card");
        }
    };

    const handleSaveAddress = async () => {
        try {
            const { addressID } = await dispatch(saveAddress({
                name,
                phoneNumber,
                address,
                city: selectedCity,
                province: State.getStateByCodeAndCountry(selectedState, selectedCountry).name,
                country: Country.getCountryByCode(selectedCountry).name
            })).unwrap();

            await Promise.all([
                dispatch(setDefaultBillingAddress({ addressId: addressID })).unwrap(),
                dispatch(setDefaultShippingAddress({ addressId: addressID })).unwrap(),
                dispatch(getSavedAddresses()).unwrap()
            ]);
        } catch (error) {
            toast.error("Failed to save address");
        }
    };

    const handleAddresChangeButton = () => {
        setShowChangeAddressModal(true);
    };

    const handlePhoneChange = (value) => {
        setPhoneNumber(value);
        setFieldErrors(prev => ({ ...prev, phone: '' }));
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setName(value);
            setFieldErrors(prev => ({ ...prev, name: '' }));
        }
    };

    const handleSaveButton = async (addressID) => {
        try {
            const response = await dispatch(getAddressByID({ addressID })).unwrap();
            setShippingAddress(response);
            setShowChangeAddressModal(false);
        } catch (error) {
            toast.error("Failed to update address");
        }
    };

    const handleCancelButton = () => {
        setShowChangeAddressModal(false);
    };

    const handleOnChangeClick = () => {
        setShowChangeCardModal(true);
    };

    const handleCardModalCancel = () => {
        setShowChangeCardModal(false);
    };

    const onCloseModal = () => {
        setShowError(false);
    };

    const handleCardModalSave = async (cardID) => {
        try {
            const response = await dispatch(getCardByID({ cardID })).unwrap();
            setCard(response);
            setShowChangeCardModal(false);
        } catch (error) {
            toast.error("Failed to update card");
        }
    };

    return (
        <div className="min-h-[320px] px-4 sm:px-6 lg:px-8 font-inter  md:mt-36 mt-48">
            {(loading || orderLoading) && (
                <div className="flex justify-center items-center h-screen w-full fixed inset-0 bg-white bg-opacity-75 z-50">
                    <Loader />
                </div>
            )}
            <div className={`${loading || orderLoading ? "hidden" : ""}`}>
                {showError && (
                    <ErrorModal
                        message="Something went wrong! Please try again"
                        btnMessage="Retry"
                        onClose={onCloseModal}
                    />
                )}
                <div className="nav w-max my-4 text-sm">
                    <Link to="/" className="text-gray-600 hover:text-black">Home</Link>
                    <span className="mx-2 text-gray-600">/</span>
                    <span>CheckOut</span>
                </div>
                <section className={`billing w-full px-0 sm:px-4 md:px-8 lg:max-w-7xl lg:mx-auto mb-10 md:mb-16 lg:mb-24 ${!billingItem || billingItem.length === 0 ? "hidden" : "block"}`}>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl my-4 md:my-6 lg:my-8 font-semibold">Billing Details</h2>
                    <div className="inner-box flex flex-col lg:flex-row lg:gap-16 xl:gap-24">
                        <div className="col-1 flex flex-col w-full lg:w-1/2 xl:w-[470px]">
                            <div className={`shipping w-full ${shippingAddress ? "flex" : "hidden"} flex-col gap-3 rounded-lg shadow-md p-4 sm:p-6`}>
                                <div className="address">
                                    <h4 className="text-xl md:text-2xl mb-2 font-semibold">Shipping address</h4>
                                    <h6 className="text-lg md:text-xl font-medium">{shippingAddress?.name}</h6>
                                    <p className="text-sm md:text-base text-gray-700">{shippingAddress?.address}</p>
                                    <p className="text-sm md:text-base text-gray-700">{shippingAddress?.city}, {shippingAddress?.province} {shippingAddress?.country}</p>
                                    <div className="flex justify-end mt-3">
                                        <button className="text-red-500 hover:text-red-600 font-semibold px-3 py-1 rounded transition-colors" onClick={handleAddresChangeButton}>CHANGE</button>
                                    </div>
                                </div>
                                {showChangeAddressModal && <ChangeAddressModal defaultAddress={shippingAddress?._id} onSave={handleSaveButton} onCancel={handleCancelButton} />}
                            </div>
                            <div className={`w-full ${shippingAddress ? "block" : "hidden"} mt-6 sm:mt-8 rounded-lg shadow-md overflow-hidden`}>
                                <div className="bg-gray-100 py-3 px-4 sm:px-6 flex justify-between items-center font-medium text-gray-700">
                                    <span className="text-sm sm:text-base w-1/2">Product</span>
                                    <span className="text-sm sm:text-base w-1/4 text-center">Price</span>
                                    <span className="text-sm sm:text-base w-1/4 text-center">Quantity</span>
                                </div>
                                <div className="flex flex-col w-full p-2 sm:p-4">
                                    {billingItem?.map((item) => (
                                        <BillingProductRow
                                            key={item?._id}
                                            product={item.product}
                                            quantity={item?.quantity}
                                            color={item?.color}
                                            size={item?.size}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className={`address-info ${!shippingAddress ? "block" : "hidden"} w-full lg:w-[470px] flex flex-col gap-4 mt-6`}>
                                {Object.keys(fieldErrors).length > 0 && (
                                    <p className="text-sm text-red-500">Please fill out all required fields correctly</p>
                                )}
                                <div className="name">
                                    <label htmlFor="name" className="text-base text-gray-500 mb-1 block">Full Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full h-12 bg-gray-100 outline-none px-3 py-2 rounded-md border border-gray-200 focus:border-blue-400 transition-colors"
                                        value={name}
                                        onChange={handleNameChange}
                                    />
                                    {fieldErrors.name && <span className="text-red-500 text-xs">{fieldErrors.name}</span>}
                                </div>
                                <div className="phone-number">
                                    <label htmlFor="phone-number" className="text-base text-gray-500 mb-1 block">Phone Number <span className="text-red-500">*</span></label>
                                    <PhoneInput
                                        value={phoneNumber}
                                        country={"pk"}
                                        onChange={handlePhoneChange}
                                        inputStyle={{ width: "100%", height: "50px", background: "#F5F5F5", fontSize: "16px", borderRadius: "5px", border: "1px solid #e2e8f0" }}
                                        containerStyle={{ marginTop: "10px" }}
                                        buttonStyle={{ borderRadius: "5px 0 0 5px", border: "1px solid #e2e8f0" }}
                                    />
                                    {fieldErrors.phone && <span className="text-red-500 text-xs">{fieldErrors.phone}</span>}
                                </div>
                                <div className="address">
                                    <label htmlFor="address" className="text-base text-gray-500 mb-1 block">Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        id="address"
                                        className="w-full h-12 bg-gray-100 outline-none px-3 py-2 rounded-md border border-gray-200 focus:border-blue-400 transition-colors"
                                        placeholder="Enter your address"
                                        value={address}
                                        onChange={handleAddressChange}
                                    />
                                    {fieldErrors.address && <span className="text-red-500 text-xs">{fieldErrors.address}</span>}
                                </div>
                                <div className="country">
                                    <label htmlFor="country" className="text-base text-gray-500 mb-1 block">Country <span className="text-red-500">*</span></label>
                                    <select
                                        name="country"
                                        id="country"
                                        className="w-full h-12 px-3 bg-gray-100 focus:outline-none rounded-md border border-gray-200 focus:border-blue-400 transition-colors"
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        value={selectedCountry || ""}
                                    >
                                        <option value="" disabled>Select Your Country</option>
                                        {Country?.getAllCountries().map((country) => (
                                            <option key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.country && <span className="text-red-500 text-xs">{fieldErrors.country}</span>}
                                </div>
                                <div className="province">
                                    <label htmlFor="province" className="text-base text-gray-500 mb-1 block">Province/Region <span className="text-red-500">*</span></label>
                                    <select
                                        name="province"
                                        id="province"
                                        className="w-full h-12 px-3 bg-gray-100 focus:outline-none rounded-md border border-gray-200 focus:border-blue-400 transition-colors"
                                        disabled={!selectedCountry}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        value={selectedState || ""}
                                    >
                                        <option value="" disabled>Select Your Province/Region</option>
                                        {selectedCountry && State?.getStatesOfCountry(selectedCountry).map((state) => (
                                            <option key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.state && <span className="text-red-500 text-xs">{fieldErrors.state}</span>}
                                </div>
                                <div className="city">
                                    <label htmlFor="city" className="text-base text-gray-500 mb-1 block">City <span className="text-red-500">*</span></label>
                                    <select
                                        name="city"
                                        id="city"
                                        className="w-full h-12 px-3 bg-gray-100 focus:outline-none rounded-md border border-gray-200 focus:border-blue-400 transition-colors"
                                        disabled={!selectedState}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        value={selectedCity || ""}
                                    >
                                        <option value="" disabled>Select Your City</option>
                                        {selectedCountry && selectedState && City?.getCitiesOfState(selectedCountry, selectedState).map((city) => (
                                            <option key={city.name} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.city && <span className="text-red-500 text-xs">{fieldErrors.city}</span>}
                                </div>
                                <div className="checkbox flex gap-2 items-center mt-2 cursor-pointer" onClick={() => setChecked(!checked)}>
                                    <div className={`w-6 h-6 border-[1.5px] rounded ${checked ? "border-red-500 bg-red-500 p-[2px]" : "border-gray-400"}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`${checked ? "" : "hidden"} w-full h-full text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span className="text-base select-none text-gray-700">Save this information for faster check-out next time</span>
                                </div>
                            </div>
                        </div>
                        <div className="billing-details w-full lg:w-1/2 xl:w-[527px] flex flex-col gap-6 mt-8 lg:mt-0 p-4 sm:p-6 rounded-lg shadow-md">
                            <div className={`w-full ${!shippingAddress ? "block" : "hidden"} rounded-lg shadow-md overflow-hidden`}>
                                <div className="bg-gray-100 py-3 px-4 sm:px-6 flex justify-between items-center font-medium text-gray-700">
                                    <span className="text-sm sm:text-base w-1/2">Product</span>
                                    <span className="text-sm sm:text-base w-1/4 text-center">Price</span>
                                    <span className="text-sm sm:text-base w-1/4 text-center">Quantity</span>
                                </div>
                                <div className="flex flex-col w-full p-2 sm:p-4">
                                    {billingItem?.map((item) => (
                                        <BillingProductRow
                                            key={item?._id}
                                            product={item.product}
                                            quantity={item?.quantity}
                                            color={item?.color}
                                            size={item?.size}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="product-details w-full flex flex-col gap-3 border border-gray-300 rounded-lg p-4 sm:p-6">
                                <div className="sub-total-shipping flex flex-col gap-3">
                                    <div className="sub-total h-6 flex justify-between text-base">
                                        <h6 className="font-medium text-gray-700">Subtotal:</h6>
                                        <span className="font-semibold text-gray-800">${subTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-gray-300" />
                                    <div className="shipping h-6 flex justify-between text-base">
                                        <h6 className="font-medium text-gray-700">Shipping</h6>
                                        <span className="font-semibold text-gray-800">Free</span>
                                    </div>
                                    <div className="border-b-[1.5px] border-gray-300" />
                                </div>
                                <div className={`coupon-discount h-6 ${coupon ? "flex" : "hidden"} justify-between text-base`}>
                                    <h6 className="font-medium text-gray-700">Coupon Discount <span className={`${!coupon ? "hidden" : ""} text-red-500`}>({coupon?.code})</span></h6>
                                    <span className="text-red-500 font-semibold">-${couponDiscount.toFixed(2)}</span>
                                </div>
                                <div className={`border-b-[1.5px] ${coupon ? "block" : "hidden"} border-gray-300`} />
                                <div className="total h-6 flex justify-between text-lg font-bold mt-2">
                                    <h6>Total</h6>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="payment-mode flex flex-col gap-6 border border-gray-300 rounded-lg p-4 sm:p-6">
                                <div className="bank w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <label htmlFor="bank" className="label flex gap-2 items-center text-base font-medium text-gray-700 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment-mode"
                                            id="bank"
                                            className="w-5 h-5 accent-blue-500 outline-none"
                                            onChange={() => setIsCardSelected(true)}
                                            checked={isCardSelected}
                                        />
                                        <span>Bank</span>
                                    </label>
                                    <div className="card-images flex gap-2 ml-7 sm:ml-0">
                                        <div className="card w-10 h-7 flex items-center justify-center border border-gray-300 rounded-md overflow-hidden">
                                            <img src="/images/visa.png" alt="visa" className="max-w-full h-auto object-cover" />
                                        </div>
                                        <div className="card w-10 h-7 flex items-center justify-center border border-gray-300 rounded-md overflow-hidden">
                                            <img src="/images/master-card.png" alt="master-card" className="max-w-full h-auto object-cover" />
                                        </div>
                                        <div className="card w-10 h-7 flex items-center justify-center border border-gray-300 rounded-md overflow-hidden">
                                            <img src="/images/union-pay.png" alt="e-payment" className="max-w-full h-auto object-cover" />
                                        </div>
                                    </div>
                                </div>
                                <div className={`w-full ${isCardSelected ? "block" : "hidden"} flex flex-col gap-4`}>
                                    <div className={`${!user?.defaultCard ? "flex" : "hidden"} flex-col gap-4`}>
                                        {fieldErrors.cardFields && <p className="text-sm text-red-500">{fieldErrors.cardFields}</p>}
                                        <div className="cardName">
                                            <label htmlFor="cardName" className="text-base text-gray-500 mb-1 block">Card Holder's Name <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                id="cardName"
                                                className="w-full h-12 bg-gray-100 outline-none px-3 py-2 rounded-md border border-gray-200 focus:border-blue-400 transition-colors"
                                                autoComplete="off"
                                                value={cardName}
                                                onChange={handleCardNameChange}
                                            />
                                            {fieldErrors.cardName && <span className="text-red-500 text-xs">{fieldErrors.cardName}</span>}
                                        </div>
                                        <div className="w-full h-auto">
                                            <div className="border border-gray-300 p-3 rounded-md text-sm md:text-base">
                                                {!user?.defaultCard && <CardElement id="cardElement" options={{ hidePostalCode: true }} onChange={handleCardElementChange} />}
                                            </div>
                                        </div>
                                        <div className="card-checkbox flex gap-2 items-center cursor-pointer" onClick={() => setCardChecked(!cardChecked)}>
                                            <div className={`w-6 h-6 border-[1.5px] rounded ${cardChecked ? "border-red-500 bg-red-500 p-[2px]" : "border-gray-400"}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className={`${cardChecked ? "" : "hidden"} w-full h-full text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                            <span className="text-base select-none text-gray-700">Save card</span>
                                        </div>
                                    </div>
                                    <div className={`w-full ${user?.defaultCard ? "block" : "hidden"} rounded-lg shadow-sm overflow-hidden border border-gray-200`}>
                                        <div className="bg-gray-100 py-3 px-4 sm:px-6 flex justify-between items-center font-medium text-gray-700">
                                            <span className="font-normal w-1/2 text-left text-sm md:text-base">Card Number</span>
                                            <span className="font-normal w-1/2 text-left text-sm md:text-base">Expiry Date</span>
                                        </div>
                                        <div className="flex flex-col w-full p-2 sm:p-4">
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-sm  text-gray-800 font-mono w-1/2">{`**** **** **** ${card?.last4}`}</span>
                                                <span className="text-sm text-gray-700 w-1/2 pl-16">{`${card?.exp_month}/${card?.exp_year}`}</span>
                                                <button onClick={handleOnChangeClick} className="text-red-500 hover:text-red-600 font-semibold px-3 py-1 rounded transition-colors text-sm ml-auto">CHANGE</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {showChangeCardModal && (
                                    <ChangeCardModal defaultCard={card?.id} onCancel={handleCardModalCancel} onSave={handleCardModalSave} />
                                )}
                                <label htmlFor="cash" className="cash flex gap-2 items-center w-full text-base font-medium text-gray-700 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment-mode"
                                        id="cash"
                                        className="w-5 h-5 accent-blue-500 outline-none"
                                        onChange={() => setIsCardSelected(false)}
                                        checked={!isCardSelected}
                                    />
                                    <span>Cash on delivery</span>
                                </label>
                            </div>
                            <div className="coupon w-full flex flex-col sm:flex-row gap-4 mt-2">
                                <div className="coupon-code w-full sm:flex-grow">
                                    <input
                                        type="text"
                                        className="w-full h-14 focus:outline-none px-4 border-[1.5px] border-gray-300 rounded-md focus:border-blue-400 transition-colors"
                                        placeholder="Coupon Code"
                                        onChange={handleCouponChange}
                                        value={couponCode}
                                    />
                                </div>
                                <button
                                    className="btn-1 w-full sm:w-auto h-14 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors px-6 py-2"
                                    onClick={handleCouponClick}
                                    disabled={isProcessing}
                                >
                                    Apply Coupon
                                </button>
                            </div>
                            {isModalOpen && <OrderSuccessModal onClose={handleCloseModal} />}
                            <div className="btn w-full mt-4 flex justify-end">
                                <button
                                    className="btn-1 w-full sm:w-auto px-8 py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg disabled:bg-blue-400"
                                    onClick={placeOrder}
                                    disabled={isProcessing || !billingItem?.length}
                                >
                                    {isProcessing ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
                <div className={`${!billingItem || billingItem.length === 0 ? "flex" : "hidden"} flex-col mt-16 px-4 md:px-8 items-center justify-center`}>
                    <p className="text-center text-gray-600 text-base mb-6">{billingItem === null ? "Invalid or expired Billing ID" : "No item selected for Billing"}</p>
                    <Link to="/" className="text-center">
                        <button className="btn-1 w-auto px-8 py-4 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-md">Continue Shopping</button>
                    </Link>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Billing;