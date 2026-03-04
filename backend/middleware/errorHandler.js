const { sendResponse } = require('../utils/response');

const notFound = (req, res, next) => {
  return sendResponse(res, false, `Not found - ${req.originalUrl}`, null, 404);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID or data format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value (e.g. email already in use)';
  }

  return sendResponse(res, false, message, null, statusCode);
};

module.exports = { notFound, errorHandler };
