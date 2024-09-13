import React, { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm({clientSecret}) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Fill in the data!");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (e) => {
        console.log("in handle submit", e)
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        if (elements) {
            let carddElement = elements.getElement('card');
            console.log("card element", carddElement, "elements", elements)
            if (carddElement) {
                cardCheck.on('change', (event) => {
                    console.log('event: ', event);
                });
            }
        }

        const { error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://wodproleague.es/payment',
                // return_url: 'http://localhost:5173/payment',
            },
        });


        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
     

     if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs"
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <button className="bg-blue-500 text-white py-2 px-4 my-4 w-full hover:bg-blue-800" disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text" className="">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {/* Show any error or success messages */}
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}





