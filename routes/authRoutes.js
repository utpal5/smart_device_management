const express = require('express');
const { signup, login, getProfile } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/profile', auth, getProfile);

module.exports = router;