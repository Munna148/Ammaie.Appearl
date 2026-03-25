const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');
const { sendResponse } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { email, password, name, phone } = req.body;

    const normalizedEmail = String(email).trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      return sendResponse(res, false, 'Email already registered', null, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        name: name || null,
        phone: phone || null,
      },
    });
    const token = generateToken(user.id);

    return sendResponse(
      res,
      true,
      'Registration successful',
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          fullName: user.name,
          phone: user.phone,
          createdAt: user.createdAt,
        },
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
    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return sendResponse(res, false, 'Invalid email or password', null, 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, false, 'Invalid email or password', null, 401);
    }

    const token = generateToken(user.id);

    return sendResponse(res, true, 'Login successful', {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        fullName: user.name,
        phone: user.phone,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });
    if (!user) {
      return sendResponse(res, false, 'User not found', null, 404);
    }
    return sendResponse(res, true, '', { user: { ...user, fullName: user.name } });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(fullName !== undefined ? { name: fullName } : {}),
        ...(phone !== undefined ? { phone } : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });
    return sendResponse(res, true, 'Profile updated', {
      user: { ...updated, fullName: updated.name },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile };
