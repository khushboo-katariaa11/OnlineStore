require('dotenv').config();
const { validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const app = require('./app');

try {
	validateEnv();
} catch (error) {
	console.error('Environment configuration error:', error.message);
	process.exit(1);
}

const PORT = process.env.PORT;

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
		});
	})
	.catch((error) => {
		console.error('Failed to start server:', error.message);
		process.exit(1);
	});
