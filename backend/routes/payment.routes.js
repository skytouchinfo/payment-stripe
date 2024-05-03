const express = require('express');
const { attachPaymentMethod, addCardToCustomer, getCardInfo, checkOutCard } = require('../controllers/stripe.conroller');

const stripeRouter = express.Router();


stripeRouter.post('/attach-payment-method', attachPaymentMethod);

stripeRouter.post('/add-card', addCardToCustomer)

stripeRouter.get('/get-cards', getCardInfo);


stripeRouter.post('/checkout',checkOutCard)



module.exports = stripeRouter;