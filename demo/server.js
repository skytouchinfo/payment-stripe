const stripe = require('stripe')('sk_test_51ORpDXSJivXBSgori9VyO88wHrWoD4kOsehaFCOgbYrTMMT6sRLztCh2vMeDNQmTpNBSSRJlbSIvWRmWPUeYT5ZB00iRVWyH5z');
const express = require('express');
const cors = require('cors');


const app = express();

app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true,
}));

app.post('/create-customer', async (req, res) => {
    try {
        const { payment_method_id, email, shipping } = req.body;

        // Create a customer and attach the payment method
        const customer = await stripe.customers.create({
            payment_method: payment_method_id,
            email: email,
            invoice_settings: {
                default_payment_method: payment_method_id,
            },
            // You can add more customer-related information here
        });

        res.status(200).json({ customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/get-saved-cards', async (req, res) => {
    try {
        // Fetch customer's default payment method ID
        const customer = await stripe.customers.retrieve('cus_Q1xdaGSZtEw4VM', {
            expand: ['invoice_settings.default_payment_method']
        });
        console.log("🚀 ~ app.get ~ customer:", customer)

        // Retrieve the default payment method ID
        const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;
        console.log("🚀 ~ app.get ~ defaultPaymentMethodId:", defaultPaymentMethodId)

        // If default payment method ID is available, retrieve the associated payment methods
        if (defaultPaymentMethodId) {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: 'cus_Q1xdaGSZtEw4VM',
                type: 'card',
            });
            // console.log("🚀 ~ app.get ~ paymentMethods:", paymentMethods)

            res.json({ savedCards: paymentMethods.data });
        } else {
            res.json({ savedCards: [] }); // No payment methods found
        }
    } catch (error) {
        console.error('Error fetching saved cards:', error);
        res.status(500).json({ error: 'Failed to fetch saved cards' });
    }
});
// Endpoint to process payment with selected payment method
app.post('/process-payment', async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000, // Amount in cents
            currency: 'usd',
            customer: 'cus_Q22UybIkToazjY',
            payment_method: 'card_1PCEmMSJivXBSgorBLcTV5ND',
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
            },
            return_url: "http://127.0.0.1:5500/index.html"
        });
        res.json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});