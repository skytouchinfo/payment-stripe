const stripe = Stripe('pk_test_51ORpDXSJivXBSgor7CxOo2rbwC8nhsIfwqxlxb76hPtuTzY4z2we4yK30AnBGsFbalURavuyqsk8obBmYRd7ZA8d00UPnsjnGY');

document.addEventListener("DOMContentLoaded", async function () {
    // Fetch saved cards for the current customer
    const savedCards = await fetchSavedCards();
    const cardSelector = document.getElementById('card-selector');

    // Populate saved cards in the dropdown
    savedCards.forEach(card => {
        const option = document.createElement('option');
        option.value = card.id;
        option.textContent = `${card.card.brand} ending in ${card.card.last4}`;
        cardSelector.appendChild(option);
    });

    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const paymentMethodId = cardSelector.value;
        await processPayment(paymentMethodId);
    });

    // Function to fetch saved cards from the server
    async function fetchSavedCards() {
        try {
            const response = await fetch('http://localhost:3000/get-saved-cards');
            const data = await response.json();
            return data.savedCards;
        } catch (error) {
            console.error('Error fetching saved cards:', error);
            return [];
        }
    }

    // Function to process payment with selected payment method
    async function processPayment(paymentMethodId) {
        try {
            const response = await fetch('http://localhost:3000/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ payment_method_id: paymentMethodId, return_url: 'https://your-website.com/payment-success' })
            });
            const responseData = await response.json();
            console.log(responseData);
            // Handle success or error response from the server
        } catch (error) {
            console.error('Error processing payment:', error);
            // Handle error
        }
    }
});