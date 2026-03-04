const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('discountPrice').optional().isFloat({ min: 0 }),
  body('category').isIn(['Party', 'Casual', 'Wedding', 'Summer']).withMessage('Valid category is required'),
  body('sizes').optional().isArray(),
  body('stock').isInt({ min: 0 }).withMessage('Valid stock is required'),
];

const productUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('discountPrice').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['Party', 'Casual', 'Wedding', 'Summer']).withMessage('Valid category is required'),
  body('sizes').optional().isArray(),
  body('stock').optional().isInt({ min: 0 }).withMessage('Valid stock is required'),
];

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, productValidation, validate, createProduct);
router.put('/:id', protect, admin, productUpdateValidation, validate, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
