import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

export const CustomForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [name, setName] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [customer, setCustomer] = useState();



    useEffect(() => {
        try {
            const token = localStorage?.getItem('token') ?? "";
            setCustomer(jwtDecode(token));
        } catch (e) {
            console.error(e);
        }
    }, [])
    console.log("🚀 ~ CustomForm ~ customer:", customer);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const cardElement = elements.getElement(CardNumberElement);

        // Use Stripe.js to create a token or payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: name,
                address: {
                    postal_code: postalCode
                }
            }
        });

        const { error: stripeError, token } = await stripe.createToken(cardElement);

        if (error) {
            console.error('Error creating token:', stripeError);
            // Handle error
        } else {
            // console.log(paymentMethod);

            console.log("🚀 ~ handleSubmit ~ token:", token)

            await addCardToCustomer(customer.user.customer_id, token.id)

            // await attachPaymentMethod(paymentMethod.id)

            // Send the payment method ID to your server to save it to the customer
            // savePaymentMethod(paymentMethod.id);
        }
    };

    const attachPaymentMethod = async (paymentMethodId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/stripe/attach-payment-method`, {
                customer_id: customer.user.customer_id,
                payment_method_id: paymentMethodId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            // Handle success response from the server
        } catch (error) {
            console.error('Error saving payment method:', error);
            // Handle error
        }
    };

    const addCardToCustomer = async (customer_id, card_token) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/stripe/add-card`, {
                customer_id: customer_id,
                card_token: card_token, // This should be a valid card token obtained from Stripe Elements or Stripe.js
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log(response.data);
            // Handle success response
        } catch (error) {
            console.error('Error adding card:', error);
            // Handle error
        }
    };

    return (
        <div className='custom-form m-auto my-4'>
            <form onSubmit={handleSubmit}>
                <div className='d-flex align-items-center  flex-column  gap-2 w-full fw-bold m-auto'>
                    <label htmlFor="card-number">CardNo:</label>
                    <CardNumberElement className='p-2 border w-25 rounded' id='card-number' options={{ showIcon: true, iconStyle: "solid" }} />
                </div>
                <div className='d-flex align-items-center flex-column   form-group gap-2 w-full fw-bold m-auto'>
                    <label htmlFor="card-expiry">Expiry Date:</label>
                    <CardExpiryElement id='card-expiry' className='p-2 border form-control w-25  rounded' />
                </div>
                <div className='d-flex align-items-center flex-column   form-group gap-2 w-full fw-bold m-auto'>
                    <label htmlFor="card-Cvc">Card Cvv:</label>
                    <CardCvcElement id='card-Cvc' className='p-2 border form-control w-25  rounded' />
                </div>
                <div className='d-flex align-items-center flex-column   form-group gap-2 w-full fw-bold m-auto'>
                    <label htmlFor="username">Name on card:</label>
                    <input id='username' className='p-2 border form-control w-25  rounded' placeholder='Name on your card' onChange={(e) => setName(e.target.value)} />
                </div>
                <div className='d-flex align-items-center flex-column   form-group gap-2 w-full fw-bold m-auto'>
                    <label htmlFor="postal">PostalCode:</label>
                    <input id='postal' className='p-2 border form-control w-25  rounded' placeholder='postalcode' onChange={(e) => setPostalCode(e.target.value)} />
                </div>
                <div className='d-flex align-items-center  flex-column mt-3  form-group gap-2 w-full fw-bold m-auto'>
                    <button className="btn-success btn w-25 fw-bold" type="submit">Save Payment Method</button>
                </div>
                <Link to={'/payment-form'}>Go To the Payment</Link>
            </form>
        </div>
    );
};
