const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { apiRateLimiter } = require('./middleware/rateLimit');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

const allowedOrigins = process.env.FRONTEND_URL
	? process.env.FRONTEND_URL.split(',')
			.map((o) => o.trim())
			.filter(Boolean)
	: [];
app.set('trust proxy', 1);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});



app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use(
	helmet({
		crossOriginResourcePolicy: { policy: 'cross-origin' },
	})
);

// app.use(apiRateLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');



app.get('/health', (req, res) => {
	res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/admin', authRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
	res.json({ message: 'WomenHub API', version: '1.0.0' });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
