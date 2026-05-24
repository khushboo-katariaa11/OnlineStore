const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

function getJwtSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret || secret.length < 32) {
		throw new Error('JWT_SECRET must be set and at least 32 characters.');
	}
	return secret;
}

function signAdminToken(admin) {
	const jti = crypto.randomUUID();
	const payload = {
		adminId: admin._id.toString(),
		email: admin.email,
		jti,
	};

	const token = jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });

	return { token, jti, expiresIn: JWT_EXPIRES_IN };
}

function verifyToken(token) {
	return jwt.verify(token, getJwtSecret());
}

function getTokenExpiryDate(decoded) {
	if (decoded.exp) {
		return new Date(decoded.exp * 1000);
	}
	return new Date(Date.now() + 8 * 60 * 60 * 1000);
}

module.exports = {
	signAdminToken,
	verifyToken,
	getTokenExpiryDate,
	getJwtSecret,
};
