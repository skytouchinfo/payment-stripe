import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const CheckOutForm = ({ totalPrice, onPayment }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });

            if (error) {
                setError(error.message);
                console.error('Error:', error);
                return;
            }

            if (paymentMethod && paymentMethod.id) {
                // Send paymentMethod ID to your backend
                const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/save-card`, {
                    paymentMethodId: paymentMethod.id,
                    amount: totalPrice, // Optionally, you can send the amount to your backend
                });

                console.log('Card details sent to backend:', response.data);
                onPayment(paymentMethod); // Call the onPayment callback
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while processing payment.');
        }

        console.log("🚀 ~ handleSubmit ~ paymentMethod.status:", paymentMethod)
    
    };

    




    return (
        <form onSubmit={handleSubmit}>
            <CardElement className='border rounded w-50 p-3 text-dark' id='card-element' />
            {error && <div>{error}</div>}
            <button type="submit" className='btn btn-primary' disabled={!stripe || loading}>
                {loading ? 'Loading...' : `Save Card`}
            </button>
        </form>
    );
};

export default CheckOutForm;
