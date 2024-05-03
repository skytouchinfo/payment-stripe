
const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    customerId: { type: String, required: true }, // ID of the customer associated with the payment method
    paymentMethodId: { type: String, required: true }, // ID of the saved payment method
    cardBrand: String,
    last4: String,
    exp_month: Number,
    exp_year: Number,
    // Add more fields as needed
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;