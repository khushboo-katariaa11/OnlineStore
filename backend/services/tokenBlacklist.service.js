const TokenBlacklist = require('../models/tokenBlacklist.model');
const { getTokenExpiryDate } = require('../utils/jwt');

async function isTokenBlacklisted(jti) {
	if (!jti) return false;
	const entry = await TokenBlacklist.findOne({ jti }).lean();
	return Boolean(entry);
}

async function blacklistToken(decoded, adminId) {
	if (!decoded?.jti) {
		return;
	}

	const expiresAt = getTokenExpiryDate(decoded);

	await TokenBlacklist.findOneAndUpdate(
		{ jti: decoded.jti },
		{
			jti: decoded.jti,
			adminId,
			expiresAt,
		},
		{ upsert: true, new: true }
	);
}

module.exports = {
	isTokenBlacklisted,
	blacklistToken,
};
