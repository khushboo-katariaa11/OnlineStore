
const express = require('express');
const router = express.Router();


// Import controllers
const {
	addProductController,
	getAllProductsController,
	getProductByIdController,
	updateProductController,
	deleteProductController,
	getProductsByCategoryController,
	searchProductsController
} = require('../controllers/product.controller');

// Import validation
const { productValidation, idValidation, searchValidation } = require('../validation/product.validation');
const upload = require('../middleware/upload');
const { validationResult } = require('express-validator');

// Validation error handler
const handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Import auth middleware
const authUser = require('../middleware/authuser');

// Add product (private, with image upload)
router.post('/', authUser, upload.single('image'), productValidation, handleValidation, addProductController);

// Get all products with pagination
router.get('/', getAllProductsController);

// Get all unique categories (MUST be before /:id)
router.get('/unique/categories', require('../controllers/product.controller').getUniqueCategoriesController);

// Get all unique subcategories (MUST be before /:id)
router.get('/unique/subcategories', require('../controllers/product.controller').getUniqueSubcategoriesController);

// Search products (MUST be before /:id)
router.get('/search', searchValidation, handleValidation, searchProductsController);

// Get products by category with pagination (MUST be before /:id)
router.get('/category/:category', getProductsByCategoryController);

// Get single product by ID (MUST be after specific routes)
router.get('/:id', idValidation, handleValidation, getProductByIdController);

// Update product by ID (private, with image upload)
router.put('/:id', authUser, upload.single('image'), idValidation, productValidation, handleValidation, updateProductController);

// Delete product by ID (private)
router.delete('/:id', authUser, idValidation, handleValidation, deleteProductController);

module.exports = router;
