const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const shippingAddressValidation = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
];

const createOrderValidation = [
  ...shippingAddressValidation,
  body('paymentMethod').isIn(['Card', 'UPI', 'COD']).withMessage('Valid payment method is required'),
];

const updateStatusValidation = [
  body('orderStatus').isIn(['Pending', 'Shipped', 'Delivered']).withMessage('Valid order status is required'),
];

router.post('/', protect, createOrderValidation, validate, createOrder);
router.get('/', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateStatusValidation, validate, updateOrderStatus);

module.exports = router;
