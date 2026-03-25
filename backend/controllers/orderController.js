const prisma = require('../prisma/client');
const { sendResponse } = require('../utils/response');

const mapOrder = (order) => ({
  ...order,
  orderStatus: order.status,
});

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cartItems = await prisma.cart.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });
    if (!cartItems || cartItems.length === 0) {
      return sendResponse(res, false, 'Cart is empty', null, 400);
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return sendResponse(res, false, `Product not found`, null, 400);
      }
      if (item.quantity > product.stock) {
        return sendResponse(res, false, `Insufficient stock for ${product.name}`, null, 400);
      }
      const price = product.discountPrice ?? product.price;
      const itemTotal = price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price,
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        shippingAddress,
        paymentMethod,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
      },
    });

    await prisma.cart.deleteMany({ where: { userId: req.user.id } });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return sendResponse(res, true, 'Order placed successfully', { order: mapOrder(order) }, 201);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true, price: true } } } },
      },
    });
    return sendResponse(res, true, '', { orders: orders.map(mapOrder) });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true } },
        items: { include: { product: { select: { id: true, name: true, images: true, price: true } } } },
      },
    });
    return sendResponse(res, true, '', { orders: orders.map(mapOrder) });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const existing = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return sendResponse(res, false, 'Order not found', null, 404);
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: orderStatus },
      include: {
        items: { include: { product: { select: { id: true, name: true, images: true } } } },
      },
    });
    return sendResponse(res, true, 'Order status updated', { order: mapOrder(order) });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
