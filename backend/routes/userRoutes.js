const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const { validateRegistration, validateLogin } = require('../validators/Validators');

router.post('/register', validateRegistration, register);

router.post('/login', validateLogin, login);

module.exports = router;