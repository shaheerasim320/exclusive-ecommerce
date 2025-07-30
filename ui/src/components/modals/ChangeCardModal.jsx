import React, { useEffect, useState, useRef } from 'react';
import Card from '../Card';
import { useDispatch, useSelector } from 'react-redux';
import { getSavedCards, saveCard, setDefaultCard } from '../../slices/cardSlice';
import Loader from '../Loader';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../api/axiosInstance';

const ChangeCardModal = ({ defaultCard, onSave, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [selectedCard, setSelectedCard] = useState(defaultCard || null);
    const dispatch = useDispatch();
    const { savedCards, loading, error } = useSelector(state => state.card);
    const [cardSelected, setCardSelected] = useState(!!defaultCard);
    const [isAddNewCardSelected, setIsAddNewCardSelected] = useState(false);
    const [cardError, setCardError] = useState("");
    const [cardNameError, setCardNameError] = useState("");
    const [cardChecked, setCardChecked] = useState(false);
    const [cardName, setCardName] = useState("");
    const cardElementRef = useRef(null);

    useEffect(() => {
        dispatch(getSavedCards());
    }, [dispatch]);

    // Reset state when "add new card" is deselected
    useEffect(() => {
        if (!isAddNewCardSelected) {
            setCardError("");
            setCardName("");
            setCardNameError("");
        }
    }, [isAddNewCardSelected]);

    const handleSaveCard = async () => {
        if (!stripe || !elements) return;

        // Basic validation for card name before attempting Stripe API call
        if (!cardName.trim()) {
            setCardNameError("Card Holder's Name is required");
            return null;
        }

        try {
            const response = await api.post("/card/create-setup-intent", { name: cardName });

            if (!response || !response.data.clientSecret) {
                throw new Error("Client Secret is missing in API response");
            }

            const { clientSecret } = response.data;
            const cardElement = elements.getElement(CardElement);

            if (!cardElement) {
                // This error means CardElement was not properly mounted.
                // With the new rendering logic, this should be less likely.
                throw new Error("CardElement not found. It might not be mounted or correctly initialized.");
            }

            const cardSetupResponse = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: { name: cardName }
                }
            });

            if (cardSetupResponse.error) {
                console.error("Error saving card:", cardSetupResponse.error.message);
                setCardError(cardSetupResponse.error.message);
                return null;
            } else {
                const paymentMethodId = cardSetupResponse.setupIntent.payment_method;
                await dispatch(saveCard({ paymentMethodId })).unwrap();
                if (cardChecked) {
                    await dispatch(setDefaultCard({ paymentMethodId })).unwrap();
                }
                return paymentMethodId;
            }
        } catch (error) {
            console.error("Failed to save card:", error);
            setCardError("Failed to save card. Please try again.");
            return null;
        }
    };

    const handleSelect = (cardID) => {
        setSelectedCard(cardID);
        setCardSelected(true);
        setIsAddNewCardSelected(false); // Hide add new card form if a saved card is selected
    };

    const handleSave = async () => {
        if (isAddNewCardSelected) {
            const newCardId = await handleSaveCard();
            if (newCardId) onSave(newCardId);
        } else if (selectedCard) {
            onSave(selectedCard);
        } else {
            setCardSelected(false); // No card selected, show warning
        }
    };

    const handleCancel = () => {
        setIsAddNewCardSelected(false);
        setCardError("");
        setCardName("");
        setCardNameError("");
        onCancel();
    };

    const handleAddNewCardClick = () => {
        setIsAddNewCardSelected(true);
        // Clear previous state when switching to add new card
        setCardError("");
        setCardName("");
        setCardNameError("");
        setSelectedCard(null); // Deselect any previously selected card
        setCardSelected(false); // No card is selected initially for new card flow
    };

    const handleCardNameBlur = (e) => {
        if (!e.target.value.trim()) {
            setCardNameError("Card Holder's Name is required");
        }
    };

    const handleCardNameChange = (e) => {
        const value = e.target.value;
        // Allow letters and spaces only
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCardName(value);
            setCardNameError(""); // Clear error if input becomes valid
        } else {
            setCardNameError("Name can only contain letters and spaces.");
        }
    };

    const handleCardElementChange = (event) => {
        setCardError(event.error ? event.error.message : "");
    };

    return (
        <div>
            <div className="backdrop fixed inset-0 bg-black opacity-50 z-40"></div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-[#e8e7e7] p-4 flex flex-col max-w-md w-full mx-auto">
                    {loading && <div className="flex items-center justify-center"> <Loader /></div>}
                    <h1 className="font-bold text-center text-lg">{isAddNewCardSelected ? "Add new card" : "Payment Methods"}</h1>
                    <span className={`text-sm text-red-500 py-2 ${cardSelected || isAddNewCardSelected ? 'hidden' : ''}`}>Please select a card</span>

                    {/* Saved Cards Section - Hidden if "Add new card" is selected */}
                    <div className={`cards ${isAddNewCardSelected ? 'hidden' : 'flex'} flex-col max-h-96 gap-2 overflow-y-auto overflow-x-hidden ${!cardSelected ? '' : 'mt-2'}`}>
                        {savedCards && savedCards.map((card, index) => (
                            <Card key={index} card={card} isCheck={selectedCard === card.id} onSelect={handleSelect} />
                        ))}
                    </div>

                    {/* Add New Card Section - Always mounted but visually hidden if not selected */}
                    {/* The crucial change is ensuring this div (and thus CardElement) is always in the DOM if isAddNewCardSelected */}
                    <div className={`${!isAddNewCardSelected ? 'hidden' : ''} mt-2 mb-4 gap-4 flex flex-col justify-between`}>
                        <p className={`text-sm text-red-500 ${!cardError ? 'hidden' : ''}`}>{cardError}</p>
                        <div className="cardName h-24 flex flex-col">
                            <label htmlFor="cardName" className="text-base text-gray-400">Card Holder's Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                id="cardName"
                                className="w-full h-12 bg-gray-200 outline-none px-2.5 py-2"
                                autoComplete="off"
                                value={cardName}
                                onFocus={() => setCardNameError("")}
                                onChange={handleCardNameChange}
                                onBlur={handleCardNameBlur}
                            />
                            <span className={`block text-red-500 text-xs ${cardNameError ? '' : 'hidden'}`}>{cardNameError}</span>
                        </div>
                        <div ref={cardElementRef} className="w-full h-8 flex flex-col justify-center">
                            {/* CardElement is now rendered unconditionally *within this section*.
                                Its display is controlled by the parent div's 'hidden' class. */}
                            <CardElement id="cardElement" options={{ hidePostalCode: true }} onChange={handleCardElementChange} />
                        </div>
                        <div className="card-checkbox flex gap-2.5">
                            <div
                                className={`w-6 h-6 border-2 ${cardChecked ? 'border-red-500 bg-red-500 p-0.5' : 'border-black border-opacity-40'}`}
                                onClick={() => setCardChecked(!cardChecked)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`${cardChecked ? '' : 'hidden'} w-4 h-4 text-white`}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="text-base select-none">Set as default payment method</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                        <div className={`${isAddNewCardSelected ? 'hidden' : 'flex'} justify-end`}>
                            <button
                                className="w-40 h-10 bg-[#47B2CA] text-white text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:bg-[#85BCCA]"
                                onClick={handleAddNewCardClick}
                            >
                                ADD NEW CARD
                            </button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="w-40 h-10 bg-white text-black border-2 border-black border-opacity-30 text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:border-opacity-70"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="w-40 h-10 bg-[#DB4444] text-white text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:bg-[#E07575]"
                                onClick={handleSave}
                                disabled={!cardSelected && !isAddNewCardSelected}
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeCardModal;