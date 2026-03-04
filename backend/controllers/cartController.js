const { Cart, Product } = require('../models');
const { sendResponse } = require('../utils/response');

const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price discountPrice images');
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    return sendResponse(res, true, '', { cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return sendResponse(res, false, 'Product not found', null, 404);
    }

    if (!product.sizes.includes(size)) {
      return sendResponse(res, false, 'Invalid size for this product', null, 400);
    }

    if (quantity > product.stock) {
      return sendResponse(res, false, 'Insufficient stock', null, 400);
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, quantity, size, color }],
      });
    } else {
      const existingIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const newQty = cart.items[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          return sendResponse(res, false, 'Insufficient stock', null, 400);
        }
        cart.items[existingIndex].quantity = newQty;
      } else {
        cart.items.push({ product: productId, quantity, size, color });
      }
      await cart.save();
    }

    await cart.populate('items.product', 'name price discountPrice images');
    return sendResponse(res, true, 'Item added to cart', { cart }, 201);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return sendResponse(res, false, 'Cart not found', null, 404);
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return sendResponse(res, false, 'Item not in cart', null, 404);
    }

    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return sendResponse(res, false, 'Insufficient stock', null, 400);
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images');
    return sendResponse(res, true, 'Cart updated', { cart });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return sendResponse(res, false, 'Cart not found', null, 404);
    }

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'name price discountPrice images');
    return sendResponse(res, true, 'Item removed from cart', { cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
