import React, { useEffect, useState } from 'react'
import Card from '../Card'
import { useDispatch, useSelector } from 'react-redux'
import { createSetupIntent, getSavedCards, saveCard, setDefaultCard } from '../../slices/cardSlice'
import Loader from '../Loader'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const ChangeCardModal = ({ defaultCard, onSave, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [selectedCard, setSelectedCard] = useState(!defaultCard ? null : defaultCard)
    const dispatch = useDispatch()
    const { savedCards, loading, error } = useSelector(state => state.card)
    const [cardSelected, setCardSelected] = useState(true)
    const [isAddNewCardSelected, setIsAddNewCardSelected] = useState(false);
    const [cardFieldsFilled, setCardFieldsFilled] = useState(true);
    const [cardError, setCardError] = useState("")
    const [cardNameError, setCardNameError] = useState("")
    const [cardChecked, setCardChecked] = useState(false)
    const [cardName, setCardName] = useState("")
    useEffect(() => {
        dispatch(getSavedCards())
    }, [dispatch])

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
                    if(cardChecked){
                        await dispatch(setDefaultCard({ paymentMethodId })).unwrap()
                    }
                    return paymentMethodId
                }
            } catch (error) {
                console.error("Failed to save card:", error);
            }
        };

    const handleSelect = (cardID) => {
        console.log(cardID)
        setSelectedCard(cardID)
    }
    const handleSave = async () => {
        isAddNewCardSelected ? onSave(await handleSaveCard()) : selectedCard ? onSave(selectedCard) : setCardSelected(false);
    }
    const handleCancel = () => {
        isAddNewCardSelected ? setIsAddNewCardSelected(!isAddNewCardSelected) : onCancel()
    }
    const handleAddNewCardClick = () => {
        setIsAddNewCardSelected(!isAddNewCardSelected)
    }

    const handleCardElementChange = (e) => {
        e.error ? setCardError(e.error.message) : setCardError("")
        setCardFieldsFilled(e.complete)
    }

    const handleCardNameBlur = (e) => {
        if (e.target.value == "") {
            setCardNameError("Invalid Name")
        }
    }

    const handleCardNameChange = (e) => {
        const value = e.target.value
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCardName(value);
        }
    }

    return (
        <div>
            <div className="backdrop z-40 inset-0 bg-black opacity-50 fixed"></div>
            <div className="z-50 inset-0 fixed flex items-center justify-center">
                {loading && <Loader />}
                <div className={`bg-[#e8e7e7] p-4  ${loading ? "hidden" : "flex"} flex-col`}>
                    <h1 className="font-bold text-center text-lg">{isAddNewCardSelected ? "Add new card" : "Payment Methods"}</h1>
                    <span className={`text-[13px] text-[#DB4444] py-[0.5rem] ${!cardSelected ? "" : "hidden"}`}>Please select a card</span>
                    <div className={`cards ${isAddNewCardSelected ? "hidden" : "flex"} flex-col max-h-96 gap-2 overflow-y-auto overflow-x-hidden ${!cardSelected ? "" : "mt-[0.5rem]"}`}>
                        {savedCards && savedCards.map((card, index) => (
                            <Card key={index} card={card} isCheck={selectedCard} onSelect={handleSelect} />
                        ))}
                    </div>
                    <div className={`${isAddNewCardSelected ? "mt-[0.5rem] mb-[1rem]" : "hidden"} gap-[15px] flex flex-col justify-between`}>
                        <p className={`text-[13px] text-[#DB4444] ${!cardFieldsFilled ? "" : "hidden"}`}>{cardError != "" ? cardError : "Please fill out all card details"}</p>
                        <div className="cardName h-[94px] flex flex-col">
                            <label htmlFor="cardName" className="text-[16px] text-[#B4B4B4]">Card Holder's Name <span className="text-[#DB4444]">*</span></label>
                            <input type="text" id="cardName" className="w-[427px] h-[50px] bg-[#F5F5F5] outline-none px-[9px] py-[7px]" autoComplete="off" value={cardName} onFocus={() => setCardNameError("")} onChange={handleCardNameChange} onBlur={handleCardNameBlur} />
                            <span className={`block left-[400px] bottom-[35px] w-[21px] ${cardNameError == "" ? "hidden" : "relative"}`} title={cardNameError}><img src="/images/error-icon.png" alt="error-icon" width={20} height={20} /></span>
                        </div>
                        <div className="w-[427px] h-[34px] flex flex-col justify-center ">
                            <CardElement id="cardElement" options={{ hidePostalCode: true }} onChange={handleCardElementChange} />
                        </div>
                        <div className="card-checkbox flex gap-[10px]">
                            <div className={`w-[24px] h-[24px] border-[1.5px] ${cardChecked ? "border-[#DB4444] bg-[#DB4444] p-[2px]" : "border-black"} border-opacity-40`} onClick={() => setCardChecked(!cardChecked)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`${cardChecked ? "" : "hidden "}w-4 h-4 text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <span className="text-[16px] select-none">Set as default payment method</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-[0.5rem]">
                        <div className={`${isAddNewCardSelected ? "hidden" : "flex"} justify-end`}>
                            <button className="w-[168px] h-[40px] bg-[#47B2CA] text-white text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:bg-[#85BCCA]" onClick={handleAddNewCardClick}>ADD NEW CARD</button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button className="w-[168px] h-[40px] bg-white text-black border-[1.5px] border-black border-opacity-30 text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:border-opacity-70" onClick={handleCancel}>Cancel</button>
                            <button className="w-[168px] h-[40px] bg-[#DB4444] text-white text-sm font-medium rounded-sm transition duration-300 ease-in-out hover:bg-[#E07575]" onClick={handleSave}>SAVE</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeCardModal
