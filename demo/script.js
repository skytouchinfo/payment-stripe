const stripe = Stripe('pk_test_51ORpDXSJivXBSgor7CxOo2rbwC8nhsIfwqxlxb76hPtuTzY4z2we4yK30AnBGsFbalURavuyqsk8obBmYRd7ZA8d00UPnsjnGY');

const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');


const cardholderName = document.getElementById('cardholder-name');
const cardButton = document.getElementById('card-button');
const resultContainer = document.getElementById('card-result');

cardButton.addEventListener('click', async (ev) => {
    // Collect cardholder's name
    const name = cardholderName.value;

    // Create payment method
    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: name,
        },
    });

    if (error) {
        // Display error.message in your UI.
        resultContainer.textContent = error.message;
    } else {
        // You have successfully created a new PaymentMethod
        resultContainer.textContent = "Created payment method: " + paymentMethod.id;

        // Send payment method ID to your server
        saveCard(paymentMethod.id, name);
    }
});

// Function to send payment method ID to your server
async function saveCard(paymentMethodId, name) {
    try {
        const response = await fetch('http://localhost:3000/create-customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment_method_id: paymentMethodId,
                email: 'webdev826@gmail.com', // Add email if available
                // shipping: { name: name } // Add shipping details if available
            })
        });

        const responseData = await response.json();
        console.log(responseData); // Log server response
        // Handle success or error response from the server as needed
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}





