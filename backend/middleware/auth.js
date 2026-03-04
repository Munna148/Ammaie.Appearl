const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendResponse } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendResponse(res, false, 'Not authorized to access this route', null, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendResponse(res, false, 'User not found', null, 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return sendResponse(res, false, 'Invalid or expired token', null, 401);
    }
    next(error);
  }
};

const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return sendResponse(res, false, 'Access denied. Admin only.', null, 403);
  }
  next();
};

module.exports = { protect, admin };
