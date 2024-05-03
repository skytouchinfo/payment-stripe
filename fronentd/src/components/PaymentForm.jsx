import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const PaymentForm = () => {
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        getSavedCards();
    }, []);

    const getSavedCards = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/stripe/get-cards`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setCards(res.data.data);
        } catch (error) {
            console.error('Error fetching saved cards:', error);
        }
    };

    const handleCheckout = async () => {
        if (!stripe || !elements || !selectedCard) {
            return;
        }

        // Perform checkout using the selected card
        const payload = {
            payment_method_id: selectedCard.id,
        }
        await checkOut(payload)
    };


    const checkOut = async (payload) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/stripe/checkout`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log(res.data)
        } catch (error) {
            console.error('Error while checking out:', error);
        }
    }

    const handleCardSelection = (card) => {
        setSelectedCard(card);
    };

    return (
        <div className="container mt-4">
            <table className="table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Card Type</th>
                        <th>Ending In</th>
                    </tr>
                </thead>
                <tbody>
                    {cards.map((card) => (
                        <tr key={card.id}>
                            <td>
                                <input
                                    type="radio"
                                    name="selectedCard"
                                    checked={selectedCard && selectedCard.id === card.id}
                                    onChange={() => handleCardSelection(card)}
                                />
                            </td>
                            <td>{card.brand}</td>
                            <td>**** **** **** {card.last4}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="btn btn-primary" onClick={handleCheckout} disabled={!selectedCard}>
                Checkout
            </button>
        </div>
    );
};

export default PaymentForm;
