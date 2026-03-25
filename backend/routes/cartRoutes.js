const express = require('express');
const { body, param } = require('express-validator');
const { getCart, addToCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const addToCartValidation = [
  body('productId').isString().notEmpty().withMessage('Valid product ID is required'),
  body('quantity').optional().isInt({ min: 1 }),
  body('size').isIn(['XS', 'S', 'M', 'L', 'XL']).withMessage('Valid size is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
];

const updateCartValidation = [
  param('productId').isString().notEmpty().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
];

router.get('/', getCart);
router.post('/', addToCartValidation, validate, addToCart);
router.put('/:productId', updateCartValidation, validate, updateCartItem);
router.delete('/:productId', removeFromCart);

module.exports = router;
