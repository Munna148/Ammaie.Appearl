const prisma = require('../prisma/client');
const { sendResponse } = require('../utils/response');

const toCartResponse = (rows) => ({
  id: rows[0]?.id || null,
  user: rows[0]?.userId || null,
  items: rows.map((row) => ({
    product: row.product,
    quantity: row.quantity,
    size: row.size,
    color: row.color,
  })),
});

const getCart = async (req, res, next) => {
  try {
    const rows = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    const cart = toCartResponse(rows);
    return sendResponse(res, true, '', { cart });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return sendResponse(res, false, 'Product not found', null, 404);
    }

    if (!product.sizes.includes(size)) {
      return sendResponse(res, false, 'Invalid size for this product', null, 400);
    }

    if (quantity > product.stock) {
      return sendResponse(res, false, 'Insufficient stock', null, 400);
    }

    const existing = await prisma.cart.findFirst({
      where: { userId: req.user.id, productId, size, color },
    });

    if (existing) {
      const newQty = existing.quantity + Number(quantity);
      if (newQty > product.stock) {
        return sendResponse(res, false, 'Insufficient stock', null, 400);
      }
      await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cart.create({
        data: { userId: req.user.id, productId, quantity: Number(quantity), size, color },
      });
    }

    const rows = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    const cart = toCartResponse(rows);
    return sendResponse(res, true, 'Item added to cart', { cart }, 201);
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity, size, color } = req.body;

    const item = await prisma.cart.findFirst({
      where: {
        userId: req.user.id,
        productId,
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      },
    });
    if (!item) {
      return sendResponse(res, false, 'Item not in cart', null, 404);
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (quantity > product.stock) {
      return sendResponse(res, false, 'Insufficient stock', null, 400);
    }

    if (quantity <= 0) {
      await prisma.cart.delete({ where: { id: item.id } });
    } else {
      await prisma.cart.update({
        where: { id: item.id },
        data: { quantity: Number(quantity) },
      });
    }
    const rows = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    const cart = toCartResponse(rows);
    return sendResponse(res, true, 'Cart updated', { cart });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { size, color } = req.body || {};

    await prisma.cart.deleteMany({
      where: {
        userId: req.user.id,
        productId,
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      },
    });
    const rows = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    const cart = toCartResponse(rows);
    return sendResponse(res, true, 'Item removed from cart', { cart });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };
