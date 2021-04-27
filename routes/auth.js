const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth');

//Handling the POST request from the register form
router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

module.exports = router;