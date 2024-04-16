// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);

// Other user routes

module.exports = router;
