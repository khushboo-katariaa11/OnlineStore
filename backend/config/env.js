function requireEnv(name) {
	const value = process.env[name];
	if (!value || String(value).trim() === '') {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value.trim();
}

function validateEnv() {
	requireEnv('PORT');
	requireEnv('MONGO_URI');
	requireEnv('JWT_SECRET');

	if (process.env.JWT_SECRET.length < 32) {
		const msg =
			'JWT_SECRET must be at least 32 characters. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"';
		if (process.env.NODE_ENV === 'production') {
			throw new Error(msg);
		}
		console.warn(`Warning: ${msg}`);
	}

	if (!process.env.FRONTEND_URL) {
		console.warn('Warning: FRONTEND_URL is not set. CORS will default to http://localhost:5173');
	}
}

module.exports = { validateEnv, requireEnv };
