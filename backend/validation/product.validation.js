const { body, param, query } = require('express-validator');

// Validation for adding/updating product
const productValidation = [
  body('category').notEmpty().withMessage('Category is required'),
  body('subcategory').optional().isString().withMessage('Subcategory must be a string'),
  // image validation removed; multer handles file upload
  body('price').isNumeric().withMessage('Price must be a number'),
  body('colors')
    .custom((value) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === 'string') {
        // Accept comma-separated string, must not be empty
        return value.trim().length > 0;
      }
      return false;
    })
    .withMessage('Colors must be a non-empty array or comma-separated string'),
];

// Validation for product ID param
const idValidation = [
  param('id').isMongoId().withMessage('Invalid product ID'),
];

// Validation for search query
const searchValidation = [
  query('q').notEmpty().withMessage('Search query is required'),
];

module.exports = {
  productValidation,
  idValidation,
  searchValidation,
};
