const prisma = require('../prisma/client');
const { sendResponse } = require('../utils/response');

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const where = {
      ...(search
        ? { name: { contains: String(search), mode: 'insensitive' } }
        : {}),
      ...(category ? { category } : {}),
      ...((minPrice !== undefined || maxPrice !== undefined)
        ? {
            price: {
              ...(minPrice !== undefined ? { gte: Number(minPrice) } : {}),
              ...(maxPrice !== undefined ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
    };

    const sortOption =
      sort === 'price_asc' || sort === 'price'
        ? { price: 'asc' }
        : sort === 'price_desc'
        ? { price: 'desc' }
        : { createdAt: 'desc' };
    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: sortOption,
        skip,
        take: Number(limit),
      }),
      prisma.product.count({ where }),
    ]);

    return sendResponse(res, true, '', {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return sendResponse(res, false, 'Product not found', null, 404);
    }
    return sendResponse(res, true, '', { product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        price: Number(req.body.price),
        discountPrice:
          req.body.discountPrice === undefined || req.body.discountPrice === null || req.body.discountPrice === ''
            ? null
            : Number(req.body.discountPrice),
        stock: Number(req.body.stock),
      },
    });
    return sendResponse(res, true, 'Product created', { product }, 201);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      return sendResponse(res, false, 'Product not found', null, 404);
    }
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...req.body,
        ...(req.body.price !== undefined ? { price: Number(req.body.price) } : {}),
        ...(req.body.discountPrice !== undefined
          ? {
              discountPrice:
                req.body.discountPrice === null || req.body.discountPrice === ''
                  ? null
                  : Number(req.body.discountPrice),
            }
          : {}),
        ...(req.body.stock !== undefined ? { stock: Number(req.body.stock) } : {}),
      },
    });
    return sendResponse(res, true, 'Product updated', { product });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      return sendResponse(res, false, 'Product not found', null, 404);
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    return sendResponse(res, true, 'Product deleted', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
