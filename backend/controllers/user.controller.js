const User = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwtService = require('../services/jwt.service');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51ORpDXSJivXBSgori9VyO88wHrWoD4kOsehaFCOgbYrTMMT6sRLztCh2vMeDNQmTpNBSSRJlbSIvWRmWPUeYT5ZB00iRVWyH5z');



const registerUser = async (req, res) => {
    // console.log("🚀 ~ process.env.STRIPE_KEY123:", process.env.STRIPE_KEY)
    const { username, password, email } = req.body



    const customer = await stripe.customers.create({
        email: email,
        name: username
    });
    console.log("🚀 ~ registerUser ~ customer:", customer)


    try {
        const user = await User.create({ username, password, email, customer_id: customer.id })
        return res.status(201).json({
            status: 201,
            message: "User created successfully!",
            data: user
        })
    } catch (error) {
        const deleteCustomer = await stripe.customers.del(customer.id);
        console.log("🚀 ~ registerUser ~ deleteCustomer:", deleteCustomer)
        return res.status(500).json({
            status: 500,
            message: "Error creating user!",
            error: error.message
        })
    }
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "Error during login user!",
                error: "User not found"
            });
        }
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                message: "Error during login user!",
                error: "Incorrect password"
            });
        }

        // Generate JWT token
        const token = jwtService.generateAccessToken({ user });
        const maxAgeInDays = 4;
        const maxAgeInMilliseconds = maxAgeInDays * 24 * 60 * 60 * 1000;
        let options = {
            httpOnly: true, // The cookie is only accessible by the web server
            secure: true,
            sameSite: "None",
        };

        res.cookie('jwt', token, options);

        // Login successful
        return res.status(200).json({
            status: 200,
            message: "Login successful",
            data: user,
            token: token,
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error logging in",
            error: error.message
        });
    }
};

const logoutUser = async (req, res) => {
    // Clear token from client-side storage (e.g., localStorage)
    res.clearCookie('jwt'); // For cookies
    return res.status(200).json({ message: "Logout successful" });
};

const testUser = async (req, res) => {
    return res.send("hello world")
}

module.exports = { registerUser, loginUser, logoutUser, testUser }