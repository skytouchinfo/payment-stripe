const express = require('express');
const { registerUser, loginUser, logoutUser, testUser } = require('../controllers/user.controller');

const router = express.Router();

router.post('/', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/test', testUser)



module.exports = {
    userRouter: router
}