const isProduction = process.env.NODE_ENV === 'production';

function notFoundHandler(req, res) {
	res.status(404).json({ message: 'Route not found.' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
	if (err.name === 'MulterError') {
		const message =
			err.code === 'LIMIT_FILE_SIZE'
				? 'Image must be smaller than 5MB.'
				: 'File upload failed.';
		return res.status(400).json({ message });
	}

	const status = err.status || err.statusCode || 500;
	const message =
		isProduction && status === 500
			? 'Internal server error.'
			: err.message || 'Internal server error.';

	if (!isProduction) {
		console.error(err);
	}

	res.status(status).json({ message });
}

module.exports = { notFoundHandler, errorHandler };
