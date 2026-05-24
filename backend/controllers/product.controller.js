
const Product = require('../models/product.model');

// Helper function to convert file path to accessible URL
const getImageUrl = (filePath) => {
	if (!filePath) return null;
	
	// Skip if it's already a full URL
	if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
		return filePath;
	}
	
	// Normalize backslashes to forward slashes (Windows paths)
	let normalizedPath = filePath.replace(/\\/g, '/');
	
	// Remove duplicate 'uploads/' if present
	if (normalizedPath.includes('uploads/uploads/')) {
		normalizedPath = normalizedPath.replace('uploads/uploads/', 'uploads/');
	}
	
	// Ensure it starts with /uploads/
	if (!normalizedPath.startsWith('/uploads/')) {
		if (normalizedPath.startsWith('uploads/')) {
			normalizedPath = '/' + normalizedPath;
		} else {
			normalizedPath = '/uploads/' + normalizedPath;
		}
	}
	
	return normalizedPath;
};

// Helper to format a single product
const formatProduct = (product) => {
	if (!product) return null;
	const obj = product.toObject ? product.toObject() : product;
	return {
		...obj,
		image: getImageUrl(obj.image)
	};
};

// Helper to format multiple products
const formatProducts = (products) => {
	return products.map(formatProduct);
};

// Add a new product
const addProductController = async (req, res) => {
	try {
		const { category, subcategory, name, price, description } = req.body;
		let { colors } = req.body;
		let image = req.body.image;
		if (req.file) {
			image = req.file.path;
		}
		// Convert colors to array if it's a string
		if (typeof colors === 'string') {
			colors = colors.split(',').map(c => c.trim());
		}
		if (!category || !name || !image || !price || !description || !colors) {
			return res.status(400).json({ message: 'All fields except subcategory are required.' });
		}
		const product = new Product({ category, subcategory, name, image, price, description, colors });
		await product.save();
		res.status(201).json(formatProduct(product));
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Get all products with pagination
const getAllProductsController = async (req, res) => {
	try {
		let { page = 1, limit = 10 } = req.query;
		page = parseInt(page);
		limit = parseInt(limit);
		if (isNaN(page) || page < 1) page = 1;
		if (isNaN(limit) || limit < 1) limit = 10;
		const skip = (page - 1) * limit;
		const products = await Product.find().skip(skip).limit(limit);
		const total = await Product.countDocuments();
		const formattedProducts = formatProducts(products);
		res.json({ products: formattedProducts, total, page, limit });
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Get single product by ID
const getProductByIdController = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found.' });
		}
		res.json(formatProduct(product));
	} catch (error) {
		if (error.name === 'CastError') {
			return res.status(400).json({ message: 'Invalid product ID.' });
		}
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Update product by ID
const updateProductController = async (req, res) => {
	try {
		const { id } = req.params;
		const { category, subcategory, name, price, description } = req.body;
		let { colors } = req.body;
		let image = req.body.image;
		if (req.file) {
			image = req.file.path;
		}
		// Convert colors to array if it's a string
		if (typeof colors === 'string') {
			colors = colors.split(',').map(c => c.trim());
		}
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found.' });
		}
		if (category) product.category = category;
		if (subcategory !== undefined) product.subcategory = subcategory;
		if (name) product.name = name;
		if (image) product.image = image;
		if (price) product.price = price;
		if (description) product.description = description;
		if (colors) product.colors = colors;
		await product.save();
		res.json(formatProduct(product));
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Delete product by ID
const deleteProductController = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			return res.status(404).json({ message: 'Product not found.' });
		}
		res.json({ message: 'Product deleted successfully.' });
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Get products by category (and optional subcategory) with pagination
const getProductsByCategoryController = async (req, res) => {
	try {
		const { category } = req.params;
		const { subcategory } = req.query;
		let { page = 1, limit = 10 } = req.query;
		page = parseInt(page);
		limit = parseInt(limit);
		if (isNaN(page) || page < 1) page = 1;
		if (isNaN(limit) || limit < 1) limit = 10;
		const skip = (page - 1) * limit;
		const filter = { category };
		if (subcategory) filter.subcategory = subcategory;
		const products = await Product.find(filter).skip(skip).limit(limit);
		const total = await Product.countDocuments(filter);
		res.json({ products: formatProducts(products), total, page, limit });
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Search products by name, description, or subcategory with pagination
const searchProductsController = async (req, res) => {
	try {
		const { q } = req.query;
		let { page = 1, limit = 10 } = req.query;
		page = parseInt(page);
		limit = parseInt(limit);
		if (isNaN(page) || page < 1) page = 1;
		if (isNaN(limit) || limit < 1) limit = 10;
		const skip = (page - 1) * limit;
		const query = {
			$or: [
				{ name: { $regex: q, $options: 'i' } },
				{ description: { $regex: q, $options: 'i' } },
				{ subcategory: { $regex: q, $options: 'i' } }
			]
		};
		const products = await Product.find(query).skip(skip).limit(limit);
		const total = await Product.countDocuments(query);
		res.json({ products: formatProducts(products), total, page, limit });
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Get all unique categories
const getUniqueCategoriesController = async (req, res) => {
	try {
		const categories = await Product.distinct('category');
		res.json({ categories });
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

// Get all unique subcategories (optionally by category)
const getUniqueSubcategoriesController = async (req, res) => {
	try {
		const { category } = req.query;
		let filter = {};
		if (category) filter.category = category;
		const subcategories = await Product.distinct('subcategory', filter);
		res.json({ subcategories });
	} catch (error) {
		res.status(500).json({
			message:
				process.env.NODE_ENV === 'production'
					? 'Server error'
					: error.message,
		});
	}
};

module.exports = {
	addProductController,
	getAllProductsController,
	getProductByIdController,
	updateProductController,
	deleteProductController,
	getProductsByCategoryController,
	searchProductsController,
	getUniqueCategoriesController,
	getUniqueSubcategoriesController
};
