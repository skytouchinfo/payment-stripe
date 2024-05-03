const mongoose = require("mongoose");

const cardSchema = mongoose.Schema({
    id: { type: String, required: true },
    brand: String,
    last4: { type: Number, required: true },
    exp_month: { type: Number, required: true },
    fingerprint: { type: String},
    user_id: { type: String, required: true },
    exp_year: Number,
    customer: String,
    country: String,
    name: String
    // Add more fields as needed
})

const Card = mongoose.model('Card', cardSchema);


module.exports = Card;