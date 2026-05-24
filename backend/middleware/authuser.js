const { verifyToken } = require('../utils/jwt');
const { isTokenBlacklisted } = require('../services/tokenBlacklist.service');

function extractToken(req) {
	const authHeader = req.headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.split(' ')[1];
	}
	if (req.cookies?.token) {
		return req.cookies.token;
	}
	return null;
}

const authUser = async (req, res, next) => {
	try {
		const token = extractToken(req);

		if (!token) {
			return res.status(401).json({ message: 'No token provided, authorization denied.' });
		}

		let decoded;
		try {
			decoded = verifyToken(token);
		} catch {
			return res.status(401).json({ message: 'Token is not valid or has expired.' });
		}

		if (await isTokenBlacklisted(decoded.jti)) {
			return res.status(401).json({ message: 'Session ended. Please sign in again.' });
		}

		req.user = decoded;
		req.token = token;
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = authUser;
