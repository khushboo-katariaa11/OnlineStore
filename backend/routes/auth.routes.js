const express = require('express');
const router = express.Router();
const authUser = require('../middleware/authuser');
const { loginRateLimiter } = require('../middleware/rateLimit');
const { loginValidation } = require('../validation/auth.validation');
const {
	loginUserController,
	getUserController,
	logoutUserController,
} = require('../controllers/auth.controller');

router.post('/login', loginRateLimiter, loginValidation, loginUserController);
router.get('/user', authUser, getUserController);
router.post('/logout', authUser, logoutUserController);

module.exports = router;
