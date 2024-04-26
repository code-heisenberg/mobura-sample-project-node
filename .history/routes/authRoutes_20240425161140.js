// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authpostgressql.controller');
const verifyToken = require('../middleware/authMiddleware');

router.post('/signin', AuthController.signin);
router.post('/signup', AuthController.signup);
router.get('/users/',verifyToken, AuthController.usersList);
router.get('/verifyEmail/:code', AuthController.verifyEmail);
router.get('/verifyEmailOtp/:code', AuthController.verifyEmailOtp);
router.get('/verifyMobileOtp/:code', AuthController.verifyMobileOtp);
// router.post('/signup',authpostgressql.con );
// router.get('/verifyEmail/:code', AuthController.verifyEmail);
 //router.get('/verifyEmailOtp/:code', AuthController.verifyEmailOtp);
 //router.get('/verifyMobileOtp/:code', AuthController.verifyMobileOtp);

module.exports = router;
