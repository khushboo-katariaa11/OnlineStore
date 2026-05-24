
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	category: {
		type: String,
		required: true,
		trim: true
	},
	subcategory: {
		type: String,
		required: false,
		trim: true,
		default: ''
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	image: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	colors: {
		type: [String],
		required: true
	}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
