const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: 'Too many login attempts. Please try again later.' },
});

const apiRateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 300,
	standardHeaders: true,
	legacyHeaders: false,
	message: { message: 'Too many requests. Please slow down.' },
});

module.exports = { loginRateLimiter, apiRateLimiter };
