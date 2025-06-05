import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import Billing from './Billing'

const stripePromise = loadStripe("pk_test_51QrdnnC82WimU32rhRV2qhtHQ8IAinPoxp2ru8X5J1W3AyDlIf7M9zm9tFdnceVITHu5Zw9gWt36FhjxqP2X8wNf00vqPlat2B")

const BillingWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
       <Billing />
    </Elements>
  )
}

export default BillingWrapper
