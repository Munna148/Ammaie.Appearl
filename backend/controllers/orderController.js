const { Order, Cart, Product } = require('../models');
const { sendResponse } = require('../utils/response');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return sendResponse(res, false, 'Cart is empty', null, 400);
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return sendResponse(res, false, `Product ${item.product.name} not found`, null, 400);
      }
      if (item.quantity > product.stock) {
        return sendResponse(res, false, `Insufficient stock for ${product.name}`, null, 400);
      }
      const price = product.discountPrice ?? product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price,
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    cart.items = [];
    await cart.save();

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    await order.populate('items.product', 'name images');
    return sendResponse(res, true, 'Order placed successfully', { order }, 201);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price');
    return sendResponse(res, true, '', { orders });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'email')
      .populate('items.product', 'name images price');
    return sendResponse(res, true, '', { orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('items.product', 'name images');

    if (!order) {
      return sendResponse(res, false, 'Order not found', null, 404);
    }
    return sendResponse(res, true, 'Order status updated', { order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
