const express = require('express');
const { default: mongoose } = require('mongoose');
const products = require('./products')
const cors = require('cors');
const PaymentMethod = require('./models/paymentMethod.model');
const { userRouter } = require('./routes/user.routes');
const stripeRouter = require('./routes/payment.routes');
const { varifyUser } = require('./middlewares/varify');






const dotenv = require('dotenv').config({ path: "./.env" })
const stripe = require('stripe')(process.env.STRIPE_KEY)

const PORT = 8000;

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true,
}))




const connectionMongodb = async () => {
    await mongoose.connect('mongodb+srv://webdev826:webdev123@stripe.gsb95ua.mongodb.net/?retryWrites=true&w=majority&appName=Stripe', {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
}

connectionMongodb().then(() => app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})).catch(() => console.log("Connection is not established!"))


app.use('/api/user', userRouter)

app.use(varifyUser)
app.use('/api/stripe', stripeRouter)


app.get('/products', (req, res) => {
    res.send(products)
})


