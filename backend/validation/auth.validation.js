const { body } = require('express-validator');

const loginValidation = [
	body('email').trim().isEmail().withMessage('Valid email is required.'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters.'),
];

module.exports = { loginValidation };
