const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendResponse } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, false, 'Email already registered', null, 409);
    }

    const user = await User.create({ email, password });
    const token = generateToken(user._id);

    return sendResponse(
      res,
      true,
      'Registration successful',
      {
        user: { id: user._id, email: user.email, role: user.role },
        token,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendResponse(res, false, 'Invalid email or password', null, 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendResponse(res, false, 'Invalid email or password', null, 401);
    }

    const token = generateToken(user._id);

    return sendResponse(res, true, 'Login successful', {
      user: { id: user._id, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    return sendResponse(res, true, '', { user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
