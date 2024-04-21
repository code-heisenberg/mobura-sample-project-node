// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/signin', AuthController.signin);
router.post('/signup', AuthController.signup);
router.get('/verifyEmail/:code', AuthController.verifyEmail);
router.get('/verifyEmailOtp/:code', AuthController.verifyEmailOtp);

module.exports = router;
