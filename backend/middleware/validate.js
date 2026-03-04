const { validationResult } = require('express-validator');
const { sendResponse } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join(', ');
    return sendResponse(res, false, message, null, 400);
  }
  next();
};

module.exports = validate;
