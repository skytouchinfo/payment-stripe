const Stripe = require('stripe');
const stripe = Stripe('sk_test_51ORpDXSJivXBSgori9VyO88wHrWoD4kOsehaFCOgbYrTMMT6sRLztCh2vMeDNQmTpNBSSRJlbSIvWRmWPUeYT5ZB00iRVWyH5z');
const Card = require('../models/card.model');

const attachPaymentMethod = async (req, res) => {
    const { customer_id, payment_method_id } = req.body
    console.log("🚀 ~ attachPaymentMethod ~ customer_id:", customer_id)
    try {
        // Attach the payment method to the existing customer
        const method = await stripe.paymentMethods.attach(payment_method_id, {
            customer: customer_id,
        });
        console.log("🚀 ~ attachPaymentMethod ~ method:", method)

        // Set the attached payment method as the default for invoices
        await stripe.customers.update(customer_id, {
            invoice_settings: {
                default_payment_method: payment_method_id,
            },
        });

        return res.json({ success: true, message: 'Payment method attached successfully.' });
    } catch (error) {
        console.error('Error attaching payment method:', error);
        return res.json({ success: false, message: 'Payment method attached successfully' })
    }
}


const addCardToCustomer = async (req, res) => {
    try {
        const { customer_id, card_token } = req.body;

        // Create a payment method for the card

        const paymentMethods = await stripe.paymentMethods.list({
            type: 'card',
            customer: customer_id,
        });

        const card = await stripe.customers.createSource(
            customer_id,
            {
                source: card_token,
            }
        );


        const alreadySavedCard = paymentMethods.data.filter(paymentMethod => paymentMethod.card.fingerprint === card.fingerprint)
        console.log("🚀 ~ addCardToCustomer ~ paymentMethods:", alreadySavedCard)


        console.log("🚀 ~ addCardToCustomer ~ alreadySavedCard:", paymentMethods)
        if (alreadySavedCard.length > 0) {
            const deleteCard = await stripe.customers.deleteSource(customer_id, card.id)
            return res.status(409).json({ success: false, message: 'Card already exists.' });
        }

        try {
            const createdCard = await Card.create({ ...card, user_id: req.user.user._id });
            console.log("🚀 ~ addCardToCustomer ~ card:", createdCard)
        } catch (err) {
            console.log("🚀 ~ addCardToCustomer ~ err:", err)
            return res.json({ message: err.message, status: 402 })
        }
        return res.json({ success: true, message: 'Card added successfully.'});
    } catch (error) {
        console.error('Error adding card:', error);
        return res.status(500).json({ success: false, error: 'Failed to add card.' });
    }
}



const getCardInfo = async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user.user._id })
        console.log("🚀 ~ getCardInfo ~ req.user.user._id:", req.user.user._id);
        return res.status(200).json({ success: true, data: cards, status: 200 });
    } catch (error) {
        console.log("🚀 ~ getCardInfo ~ error:", error)
        return res.status(500).json({ success: false, error: 'Failed to get card info.' });
    }
}




const checkOutCard = async(req, res) => {
    const { payment_method_id } = req.body
    try {
        console.log("🚀 ~ checkOutCard ~ req.body:", req.body)
        const paymentIntent = await stripe.paymentIntents.create({
            customer: req.user.user.customer_id,
            payment_method: payment_method_id,
            amount: 1000,
            currency: 'usd',
        });
        console.log("🚀 ~ checkOutCard ~ paymentIntent:", paymentIntent)
        res.json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = { attachPaymentMethod, addCardToCustomer, getCardInfo, checkOutCard }